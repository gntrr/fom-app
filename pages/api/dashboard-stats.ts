// pages/api/dashboard-stats.ts
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

    // For logging, calculate the user's timezone offset in hours and the server's default timezone offset
    const userTimezoneOffsetHours = offsetInMillis / (60 * 60 * 1000);
    const serverTimezoneOffsetHours = new Date().getTimezoneOffset() / -60;

    console.log('Adjusted Current Date:', currentDate.toISOString());
    console.log('User Timezone Offset (hours):', userTimezoneOffsetHours);
    console.log('Server Timezone Offset (hours):', serverTimezoneOffsetHours);

    // Calculate the start and end of the previous month based on the user's timezone
    const startOfPreviousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const endOfPreviousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    endOfPreviousMonth.setHours(23, 59, 59, 999); // Set to end of day

    const totalOrders = await Order.aggregate([
      {
        $match: {
          status: 'done',
        },
      },
      {
        $count: 'total',
      },
    ]);

    // Aggregate earnings for the previous month
    const previousMonthEarnings = await Order.aggregate([
      {
        $match: {
          status: 'done',
          deadline: { $gte: startOfPreviousMonth, $lt: endOfPreviousMonth },
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
          deadline: { $gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1), $lt: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0) },
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

    console.log('Adjusted Current Date:', currentDate, 'Timezone Offset (hours):', offsetInMillis / (60 * 60 * 1000));
    res.status(200).json({
      totalOrders: totalOrders[0]?.total || 0,
      previousMonthEarnings: previousMonthEarnings[0]?.total || 0,
      monthlyEarnings: monthlyEarnings[0]?.total || 0,
      totalServices,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Error fetching dashboard stats' });
  }
};

export default authenticateToken(handler);
