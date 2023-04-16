// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import User from 'models/user.model';
import { connectDB } from 'setup/connectDb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    let body = req.body;
    try {
      await connectDB();
      const user = await User.findOne({email: body.email});
      if(user.password != body.password) {
        return res.status(502).send("Password is incorrect")
      }
      return res.status(200).json(user);
    } catch (error) {
      console.log(error.message);
      return res.status(500).json(error.message);
    }
  }
  res.status(400).json({ data: 'Method not allowed' });
}
