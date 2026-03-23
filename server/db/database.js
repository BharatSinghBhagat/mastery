const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/angular_interview_db';

mongoose.connect(MONGODB_URI).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Questions schema
const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  category: { type: String, default: 'General' },
  difficulty: { type: String, default: 'Intermediate' },
  created_at: { type: Date, default: Date.now }
});

// Added toJSON transform so _id goes to id
questionSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {   delete ret._id;  }
});

const Question = mongoose.model('Question', questionSchema);

// Interactions schema
const interactionSchema = new mongoose.Schema({
  question_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true, unique: true },
  likes: { type: Number, default: 0 },
  asked_count: { type: Number, default: 0 }
});

interactionSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {   delete ret._id;  }
});

const Interaction = mongoose.model('Interaction', interactionSchema);

// Users schema
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' }
});

userSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {   delete ret._id;  delete ret.password; }
});

const User = mongoose.model('User', userSchema);

// User Progress schema
const userProgressSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  question_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  status: { type: String, default: 'todo' }, // 'todo', 'completed', 'revision'
  has_liked: { type: Boolean, default: false },
  has_asked: { type: Boolean, default: false },
  updated_at: { type: Date, default: Date.now }
});
userProgressSchema.index({ user_id: 1, question_id: 1 }, { unique: true });

userProgressSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {   delete ret._id;  }
});

const UserProgress = mongoose.model('UserProgress', userProgressSchema);

// Question Notes schema
const questionNoteSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  question_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  note_text: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

questionNoteSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {   delete ret._id;  }
});

const QuestionNote = mongoose.model('QuestionNote', questionNoteSchema);

// Seed Admin
const seedAdmin = async () => {
    try {
        const adminExists = await User.findOne({ username: 'admin' });
        if (!adminExists) {
            const adminPassword = '$2b$10$VGWrqIgz.cLv2vqlWViGSuHKoxaxuOFvLsXo9N9GfzkbXk1B/zR86'; // 'admin' hashed
            await User.create({ username: 'admin', password: adminPassword, role: 'admin' });
            console.log("Admin user seeded in MongoDB.");
        }
    } catch (e) {
        console.error("Error seeding admin", e);
    }
}
mongoose.connection.once('connected', seedAdmin);

module.exports = {
  mongoose,
  Question,
  Interaction,
  User,
  UserProgress,
  QuestionNote
};
