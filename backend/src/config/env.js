const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const MONGODB_URI = process.env.MONGODB_URI || '';
const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret';

module.exports = {
  PORT,
  NODE_ENV,
  MONGODB_URI,
  JWT_SECRET,
};
