import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';
import Order from '../../../models/Order';
import { authenticateToken } from '../../../utils/authMiddleware';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      const orders = await Order.find();
      res.status(200).json(orders);
      break;

    case 'POST':
      try {
        const order = await Order.create(req.body);
        res.status(201).json(order);
      } catch (error) {
        res.status(400).json({ message: 'Error creating order' });
      }
      break;
      
    default:
      res.status(405).end();
  }
}

export default authenticateToken(handler);
