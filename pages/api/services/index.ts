import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';
import Service from '../../../models/Service';
import { authenticateToken } from '../../../utils/authMiddleware';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const services = await Service.find();
      res.status(200).json(services);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching services' });
    }
  } else if (req.method === 'POST') {
    const { name, image, price, description, revision, workingTime, availability } = req.body;

    try {
      const newService = new Service({ name, image, price, description, revision, workingTime, availability });
      await newService.save();
      res.status(201).json(newService);
    } catch (error) {
      res.status(500).json({ message: 'Error creating service' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

export default authenticateToken(handler);
