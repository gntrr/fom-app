import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../utils/dbConnect';
import Order from '../../models/Order';
import { authenticateToken } from '../../utils/authMiddleware';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  try {
    const earnings = await Order.aggregate([
      {
        $group: {
          _id: { $month: '$deadline' },
          total: { $sum: '$price' },
        },
      },
      {
        $sort: { '_id': 1 },
      },
    ]);

    const formattedEarnings = earnings.map((earning) => ({
      month: new Date(0, earning._id - 1).toLocaleString('default', { month: 'short' }),
      earnings: earning.total,
    }));

    res.status(200).json(formattedEarnings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching earnings data' });
  }
}

export default authenticateToken(handler);