const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
  
      if (!user) return res.status(401).json({ message: 'User not found' });
  
      const activeSession = user.sessions.find(session => session.token === token && session.expiresAt > new Date());
      if (!activeSession) {
        return res.status(401).json({ message: 'Session expired or not valid' });
      }
  
      req.user = decoded;
      next();
    } catch (error) {
      console.log(error)
      res.status(401).json({ message: 'Token is not valid' });
    }
  };

module.exports = authMiddleware;
