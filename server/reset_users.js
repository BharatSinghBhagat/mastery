const { mongoose, User, UserProgress, QuestionNote } = require('./db/database');

async function resetUsers() {
  try {
    console.log('Connecting to MongoDB for user reset...');
    
    // Wait for connection
    await new Promise((resolve) => {
      if (mongoose.connection.readyState === 1) resolve();
      else mongoose.connection.once('connected', resolve);
    });

    console.log('Deleting all users, progress, and notes...');
    await User.deleteMany({});
    await UserProgress.deleteMany({});
    await QuestionNote.deleteMany({});
    
    console.log('Seeding default admin...');
    const adminPassword = '$2b$10$eWpdBQxYdXVevH.MKPK1henBRkUQOEHs3W0a9As90TSwqxa4eq1PG'; // 'admin' hashed
    await User.create({ 
      username: 'admin', 
      password: adminPassword, 
      role: 'superadmin',
      is_approved: true 
    });
    
    console.log('✅ User reset complete. Only "admin" remains.');
    process.exit(0);
  } catch (err) {
    console.error('Error resetting users:', err);
    process.exit(1);
  }
}

resetUsers();
