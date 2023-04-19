// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import User from 'models/user.model';
import { connectDB } from 'setup/connectDb';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const userId = req.query.userId;
    try {
      await connectDB();
      let user;
      if(userId) {
        user = await User.findOne({userId: userId});
        return res.status(200).json(user);
      }
      throw new Error('please provide userId to get user')
    } catch (error) {
      console.error(error.message);
      return res.status(500).json(error.message);
    }
  }
  res.status(400).json({ data: 'Method not allowed' });
};
