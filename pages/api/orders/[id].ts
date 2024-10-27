import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';
import Order from '../../../models/Order';
import { authenticateToken } from '../../../utils/authMiddleware';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  await dbConnect();

  switch (req.method) {
    case 'GET': // Get a specific order by ID
      try {
        const order = await Order.findById(id);
        if (!order) {
          return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
      } catch (error) {
        res.status(400).json({ message: 'Error fetching order' });
      }
      break;

    case 'PUT': // Update an order by ID
      try {
        const updatedOrder = await Order.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedOrder) {
          return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(updatedOrder);
      } catch (error) {
        res.status(400).json({ message: 'Error updating order' });
      }
      break;

    case 'DELETE': // Delete an order by ID
      try {
        const deletedOrder = await Order.findByIdAndDelete(id);
        if (!deletedOrder) {
          return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({ message: 'Order deleted successfully' });
      } catch (error) {
        res.status(400).json({ message: 'Error deleting order' });
      }
      break;

    default:
      res.status(405).json({ message: 'Method not allowed' });
      break;
  }
}

export default authenticateToken(handler);
