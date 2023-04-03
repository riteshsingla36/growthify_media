// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import User from 'models/user.model';
import { connectDB } from 'setup/connectDb';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const userType = req.query.userType;
    try {
      await connectDB();
      let users;
      if(userType) {
        users = await User.find({userType: userType});
      }
      else {
        users = await User.find({});
      }
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }
  res.status(400).json({ data: 'Method not allowed' });
};
