require('dotenv').config();
// Polyfill fetch for node < 18
if (!global.fetch) {
  const fetch = require('node-fetch');
  global.fetch = fetch;
  global.Headers = fetch.Headers;
  global.Request = fetch.Request;
  global.Response = fetch.Response;
}
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const { mongoose, Question, Interaction, User, UserProgress, QuestionNote } = require('./db/database');
const { hashPassword, comparePassword, generateToken, verifyToken, isAdmin } = require('./auth');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`, req.body);
  next();
});

// --- AUTH ROUTES ---

// 1. Register
app.post('/api/auth/register', async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const hashedPassword = await hashPassword(password);
    const user = new User({ username, password: hashedPassword, role: role || 'user' });
    await user.save();
    res.json({ message: 'User registered successfully' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    console.error('Registration Error:', err.message);
    res.status(500).json({ error: err.message || 'Registration failed' });
  }
});

// 2. Login
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: 'User not found' });
    
    const isValid = await comparePassword(password, user.password);
    if (!isValid) return res.status(401).json({ error: 'Invalid password' });
    
    if (!user.is_approved) {
      return res.status(403).json({ error: 'Your account is pending approval by an administrator.' });
    }
    
    const token = generateToken(user);
    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- CONTENT ROUTES ---

// 3. Get all questions with their stats and current user's progress
app.get('/api/questions', async (req, res) => {
  const userId = req.query.userId;
  
  try {
    // We need to fetch questions, their interactions (likes/asked), and progress if any
    const questions = await Question.find().lean();
    
    const interactions = await Interaction.find().lean();
    const interactionsMap = interactions.reduce((acc, i) => {
      acc[i.question_id.toString()] = i;
      return acc;
    }, {});
    
    let progressMap = {};
    if (userId && userId !== '0' && mongoose.Types.ObjectId.isValid(userId)) {
       const userProgressList = await UserProgress.find({ user_id: userId }).lean();
       progressMap = userProgressList.reduce((acc, p) => {
         acc[p.question_id.toString()] = p;
         return acc;
       }, {});
    }

    const payload = questions.map(q => {
       const i = interactionsMap[q._id.toString()] || { likes: 0, asked_count: 0 };
       const s = progressMap[q._id.toString()];
       return {
         ...q,
         id: q._id, // Map for frontend
         likes: i.likes,
         asked_count: i.asked_count,
         user_status: s ? s.status : 'todo',
         has_liked: s ? s.has_liked : false,
         has_asked: s ? s.has_asked : false
       };
    });

    // sort by created_at desc
    payload.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));

    res.json(payload);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// 4. Update progress
app.post('/api/questions/:id/progress', verifyToken, async (req, res) => {
  const { status } = req.body; // 'todo', 'completed', 'revision'
  const questionId = req.params.id;
  const userId = req.user.id;

  try {
    await UserProgress.findOneAndUpdate(
      { user_id: userId, question_id: questionId },
      { status, updated_at: new Date() },
      { upsert: true, new: true }
    );
    res.json({ message: 'Progress updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Add a new question (Admin only)
app.post('/api/questions', verifyToken, isAdmin, async (req, res) => {
  const { question, answer, category, difficulty } = req.body;
  try {
    const q = new Question({ question, answer, category, difficulty });
    await q.save();
    
    const i = new Interaction({ question_id: q._id });
    await i.save();
    
    res.json({ id: q.id, message: 'Question added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Like a question (toggle)
app.post('/api/questions/:id/like', verifyToken, async (req, res) => {
  const userId = req.user.id;
  const questionId = req.params.id;

  try {
    let progress = await UserProgress.findOne({ user_id: userId, question_id: questionId });
    if (!progress) {
      progress = new UserProgress({ user_id: userId, question_id: questionId, has_liked: false });
    }

    if (progress.has_liked) {
      // Unlike
      progress.has_liked = false;
      await Interaction.findOneAndUpdate({ question_id: questionId }, { $inc: { likes: -1 } }, { upsert: true });
    } else {
      // Like
      progress.has_liked = true;
      await Interaction.findOneAndUpdate({ question_id: questionId }, { $inc: { likes: 1 } }, { upsert: true });
    }
    
    await progress.save();
    
    res.json({ message: progress.has_liked ? 'Liked!' : 'Unliked!', has_liked: progress.has_liked });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Mark as "Asked" (toggle)
app.post('/api/questions/:id/asked', verifyToken, async (req, res) => {
  const userId = req.user.id;
  const questionId = req.params.id;

  try {
    let progress = await UserProgress.findOne({ user_id: userId, question_id: questionId });
    if (!progress) {
      progress = new UserProgress({ user_id: userId, question_id: questionId, has_asked: false });
    }

    if (progress.has_asked) {
      // Un-ask
      progress.has_asked = false;
      await Interaction.findOneAndUpdate({ question_id: questionId }, { $inc: { asked_count: -1 } }, { upsert: true });
    } else {
      // Ask
      progress.has_asked = true;
      await Interaction.findOneAndUpdate({ question_id: questionId }, { $inc: { asked_count: 1 } }, { upsert: true });
    }
    
    await progress.save();
    
    res.json({ message: progress.has_asked ? 'Marked as asked!' : 'Unmarked!', has_asked: progress.has_asked });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- NOTES ROUTES ---

// 8. Get all notes for a question (for the logged-in user)
app.get('/api/questions/:id/notes', verifyToken, async (req, res) => {
  try {
    const notes = await QuestionNote.find({ user_id: req.user.id, question_id: req.params.id }).sort({ created_at: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 9. Add a note to a question
app.post('/api/questions/:id/notes', verifyToken, async (req, res) => {
  const { note_text } = req.body;
  if (!note_text || !note_text.trim()) {
    return res.status(400).json({ error: 'Note text cannot be empty' });
  }
  try {
    const note = new QuestionNote({ 
      user_id: req.user.id, 
      question_id: req.params.id, 
      note_text: note_text.trim() 
    });
    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 10. Edit a note
app.put('/api/notes/:noteId', verifyToken, async (req, res) => {
  const { note_text } = req.body;
  if (!note_text || !note_text.trim()) {
    return res.status(400).json({ error: 'Note text cannot be empty' });
  }
  try {
    const note = await QuestionNote.findOneAndUpdate(
      { _id: req.params.noteId, user_id: req.user.id },
      { note_text: note_text.trim(), updated_at: new Date() },
      { new: true }
    );
    if (!note) return res.status(403).json({ error: 'Not authorized or note not found' });
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 11. Delete a note
app.delete('/api/notes/:noteId', verifyToken, async (req, res) => {
  try {
    const note = await QuestionNote.findOneAndDelete({ _id: req.params.noteId, user_id: req.user.id });
    if (!note) return res.status(403).json({ error: 'Not authorized or note not found' });
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- AI ROUTES ---
// --- ADMIN USER MANAGEMENT ---

// 12. Get all users
app.get('/api/admin/users', verifyToken, isAdmin, async (req, res) => {
  try {
    let filter = {};
    // Regular admins can only see "user" role
    if (req.user.role === 'admin') {
      filter = { role: 'user' };
    }
    // Superadmins can see everyone
    
    const users = await User.find(filter, '-password').sort({ username: 1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 13. Approve a user
app.post('/api/admin/users/:id/approve', verifyToken, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { is_approved: true }, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: `User ${user.username} approved successfully` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 14. Delete a user
app.delete('/api/admin/users/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const userToDelete = await User.findById(req.params.id);
    if (!userToDelete) return res.status(404).json({ error: 'User not found' });

    // Prevent deleting oneself
    if (req.params.id === req.user.id) {
      return res.status(400).json({ error: 'You cannot delete your own account' });
    }

    // Permission check: Admins cannot delete other admins or superadmins
    if (req.user.role === 'admin' && (userToDelete.role === 'admin' || userToDelete.role === 'superadmin')) {
      return res.status(403).json({ error: 'Admins cannot delete other administrators.' });
    }

    await User.findByIdAndDelete(req.params.id);
    
    // Also clean up their progress and notes
    await UserProgress.deleteMany({ user_id: req.params.id });
    await QuestionNote.deleteMany({ user_id: req.params.id });
    
    res.json({ message: `User ${userToDelete.username} deleted` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 15. Update user role (Superadmin only)
const { isSuperAdmin } = require('./auth');
app.post('/api/admin/users/:id/role', verifyToken, isSuperAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    res.json({ message: `User ${user.username} role updated to ${role}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/ai/generate', verifyToken, isAdmin, async (req, res) => {
  const { question } = req.body;
  
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_API_KEY_HERE') {
    return res.status(400).json({ error: 'GEMINI_API_KEY is not configured in the server .env file.' });
  }

  if (!question || !question.trim()) {
    return res.status(400).json({ error: 'Please enter a question first to generate an answer.' });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a Senior Angular/Frontend Engineer giving an expert architectural solution to an interview question.
Write a clear, highly technical, yet concise answer for the following Angular interview question. Keep it under 250 words and use markdown bullet points for key concepts. Include a tiny code snippet if highly necessary.
Question: "${question}"`;

    const result = await model.generateContent(prompt);
    res.json({ answer: result.response.text().trim() });
  } catch (error) {
    console.error("AI Generation Error: ", error);
    res.status(500).json({ error: 'Failed to generate answer. Check server logs or your API key.' });
  }
});

app.post('/api/ai/roadmap', verifyToken, async (req, res) => {
  const { category } = req.body;
  
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_API_KEY_HERE') {
      return res.status(400).json({ error: 'GEMINI_API_KEY is not configured.' });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are an expert technical curriculum designer.
Generate a structured learning roadmap for the technology: "${category}".
If the category is "All", generate a roadmap for "Fullstack Web Development".

Return ONLY a valid JSON object with this exact structure:
{
  "title": "Title of the Roadmap",
  "subtitle": "A short descriptive subtitle",
  "steps": [
    {
      "title": "Phase Name",
      "status": "completed" or "upcoming",
      "items": ["Skill 1", "Skill 2", "Skill 3"]
    }
  ]
}
Provide exactly 4 or 5 steps. Mark the first 1 or 2 as "completed" and others as "upcoming" to simulate progress. Avoid any markdown formatting like \`\`\`json, just return the raw object.`;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const roadmap = JSON.parse(text);
    res.json(roadmap);
  } catch (error) {
    console.error("Roadmap Generation Error: ", error);
    res.status(500).json({ error: 'Failed to generate roadmap.' });
  }
});

// --- PERSISTENT ROADMAP ROUTES ---

const { Roadmap } = require('./db/database');

// 16. Get roadmap for a category
app.get('/api/roadmaps/:category', verifyToken, async (req, res) => {
  try {
    const roadmap = await Roadmap.findOne({ category: req.params.category });
    if (!roadmap) return res.status(404).json({ error: 'Roadmap not found' });
    res.json(roadmap);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 17. Save/Update roadmap (Admin only)
app.post('/api/roadmaps', verifyToken, isAdmin, async (req, res) => {
  const { category, title, subtitle, steps } = req.body;
  try {
    const roadmap = await Roadmap.findOneAndUpdate(
      { category },
      { title, subtitle, steps, updated_at: new Date() },
      { upsert: true, new: true }
    );
    res.json(roadmap);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 18. Delete roadmap (Superadmin only)
const { isSuperAdmin } = require('./auth');
app.delete('/api/roadmaps/:category', verifyToken, isSuperAdmin, async (req, res) => {
  try {
    const result = await Roadmap.deleteOne({ category: req.params.category });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Roadmap not found' });
    res.json({ message: 'Roadmap deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 19. Delete all questions in a category (Superadmin only)
app.delete('/api/questions/category/:category', verifyToken, isSuperAdmin, async (req, res) => {
  try {
    const { category } = req.params;
    await Question.deleteMany({ category });
    // Also delete the roadmap for this category
    await Roadmap.deleteOne({ category });
    res.json({ message: `Curriculum ${category} deleted successfully.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
