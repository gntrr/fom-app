import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../utils/dbConnect';
import Order from '../../models/Order';
import Service from '../../models/Service';
import { authenticateToken } from '../../utils/authMiddleware';

const handler = async (req: NextApiRequest, res: NextApiResponse) =>{
  await dbConnect();

  try {
    const totalOrders = await Order.countDocuments();
    const dailyEarnings = await Order.aggregate([
      {
        $match: {
          deadline: {
            $gte: new Date(new Date().setHours(0, 0, 0, 0)),
            $lt: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);
    const monthlyEarnings = await Order.aggregate([
      {
        $match: {
          deadline: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
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
    res.status(500).json({ message: 'Error fetching dashboard stats' });
  }
}

export default authenticateToken(handler);