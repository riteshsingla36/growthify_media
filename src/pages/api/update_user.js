// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import User from 'models/user.model';
import { connectDB } from 'setup/connectDb';

export default async function handler(req, res) {
  if (req.method === 'PATCH') {
    const id = req.query.id;
    try {
      await connectDB();
      let user;
      if(id) {
        user = await User.findOneAndUpdate({_id: id}, req.body, {runValidators: true});
        return res.status(200).json(user);
      }
      return res.status(200).json({})
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }
  res.status(400).json({ data: 'Method not allowed' });
};
