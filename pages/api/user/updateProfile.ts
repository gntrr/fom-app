import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';
import User from '../../../models/User';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

export default async function updateProfile(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const { name, email, password, profileImage } = req.body;

  // Mendapatkan token dari header Authorization
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    // Verifikasi token
    const decoded = jwt.verify(token, SECRET_KEY) as { userId: string };
    const user_id = decoded.userId;
    console.log('decoded user_id:', user_id);

    if (!user_id) {
      return res.status(400).json({ message: 'User email not found' });
    }

    // Update data pengguna
    const updateData: any = { name, email, profileImage };
    if (password) updateData.password = password;

    // Update profil pengguna berdasarkan email
    const updatedUser = await User.findOneAndUpdate(
      { _id: user_id },
      updateData,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Error updating profile:', error);  // Log error detail
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
}
