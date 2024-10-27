import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';
import Service from '../../../models/Service';
import { authenticateToken } from '../../../utils/authMiddleware';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const service = await Service.findById(id);
      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }
      res.status(200).json(service);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching service details' });
    }
  } else if (req.method === 'PUT') {
    try {
      const service = await Service.findByIdAndUpdate(id, req.body, { new: true });
      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }
      res.status(200).json(service);
    } catch (error) {
      res.status(500).json({ message: 'Error updating service' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const deletedService = await Service.findByIdAndDelete(id);
      if (!deletedService) {
        return res.status(404).json({ message: 'Service not found' });
      }
      res.status(200).json({ message: 'Service deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting service' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).json({ message: 'Method not allowed' });
  }
}

export default authenticateToken(handler);
