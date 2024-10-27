// utils/authMiddleware.ts
import jwt from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticateToken = (handler) => async (req: NextApiRequest, res: NextApiResponse) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Add decoded data to request object
    return handler(req, res);
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};
