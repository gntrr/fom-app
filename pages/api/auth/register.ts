import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';
import gravatar from 'gravatar';

export default async function register(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const { name, email, password, profileImage } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Use Gravatar if no profile image is provided
    const avatar = profileImage || gravatar.url(email, { s: '200', d: 'robohash' }, true);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      profileImage: avatar,
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user' });
  }
}
