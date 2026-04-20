const mongoose = require('mongoose');

async function connectDatabase(uri) {
  if (!uri) {
    return null;
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  console.log('Connected to MongoDB');
  return mongoose.connection;
}

module.exports = { connectDatabase };
