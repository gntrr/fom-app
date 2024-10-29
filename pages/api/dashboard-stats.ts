import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../utils/dbConnect';
import Order from '../../models/Order';
import Service from '../../models/Service';
import { authenticateToken } from '../../utils/authMiddleware';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  const { timezoneOffset } = req.query;
  const offsetInMillis = timezoneOffset ? parseInt(timezoneOffset as string) * 60 * 1000 : 0;

  try {
    // Adjust the current date based on timezone offset
    const currentDate = new Date(Date.now() - offsetInMillis);
    const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999));

    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const totalOrders = await Order.countDocuments();

    const dailyEarnings = await Order.aggregate([
      {
        $match: {
          status: 'done',
          deadline: { $gte: startOfDay, $lt: endOfDay },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$price' },
        },
      },
    ]);

    const monthlyEarnings = await Order.aggregate([
      {
        $match: {
          status: 'done',
          deadline: { $gte: startOfMonth, $lt: endOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$price' },
        },
      },
    ]);

    const totalServices = await Service.countDocuments();

    res.status(200).json({
      totalOrders,
      dailyEarnings: dailyEarnings[0]?.total || 0,
      monthlyEarnings: monthlyEarnings[0]?.total || 0,
      totalServices,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Error fetching dashboard stats' });
  }
};

export default authenticateToken(handler);
