// utils/authMiddleware.ts
import jwt from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticateToken = (handler) => async (req: NextApiRequest, res: NextApiResponse) => {
  const cookies = cookie.parse(req.headers.cookie || '');
  const token = cookies.token;

  if (!token) {
    console.log("Token not provided.");
    return res.status(401).json({ message: 'Token not provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    // console.log("Token verified successfully:", decoded);
    return handler(req, res);
  } catch (error) {
    console.log("Invalid token:", error);
    return res.status(403).json({ message: 'Invalid token' });
  }
};
