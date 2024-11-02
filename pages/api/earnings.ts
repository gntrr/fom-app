import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../utils/dbConnect';
import Order from '../../models/Order';
import { authenticateToken } from '../../utils/authMiddleware';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  try {
    const earnings = await Order.aggregate([
      {
        // Match only orders with status "done"
        $match: {
          status: 'done'
        }
      },
      {
        // Extract the month and year from the deadline field
        $project: {
          year: { $year: '$deadline' },
          month: { $month: '$deadline' },
          price: 1
        }
      },
      {
        // Group by both year and month
        $group: {
          _id: { year: '$year', month: '$month' },
          total: { $sum: '$price' }
        }
      },
      {
        // Sort by year and month in ascending order
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Format the result to include month names and years
    const formattedEarnings = earnings.map((earning) => ({
      year: earning._id.year,
      month: new Date(earning._id.year, earning._id.month - 1).toLocaleString('default', { month: 'short' }),
      earnings: earning.total
    }));

    res.status(200).json(formattedEarnings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching earnings data' });
  }
};

export default authenticateToken(handler);
