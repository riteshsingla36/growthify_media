// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import User from 'models/user.model';
import { connectDB } from 'setup/connectDb';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const name = req.query.name;
    try {
      await connectDB();
      let user;
      if(name) {
        user = await User.findOne({name: name});
      }
      else {
        user = await User.findOne({});
      }
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }
  res.status(400).json({ data: 'Method not allowed' });
};
