
import jwt from 'jsonwebtoken';

const Protect = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || 'luxecart-admin-secret-fallback-2024';
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('🔍 JWT verification error:', error.message);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export { Protect };