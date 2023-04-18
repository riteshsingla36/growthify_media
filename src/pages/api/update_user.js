// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import User from 'models/user.model';
import { connectDB } from 'setup/connectDb';

export default async function handler(req, res) {
  if (req.method === 'PATCH') {
    const id = req.query.userId;
    try {
      await connectDB();
      let user;
      let body = req.body;
      if(id) {
        if(body.projects) {
          const projects = body.projects.split(",");
          body.projects = projects;
        }
        user = await User.findOneAndUpdate({_id: id}, body, {runValidators: true});
        return res.status(200).json(user);
      }
      return res.status(200).json({})
    } catch (error) {
      console.log(error.message);
      return res.status(500).json(error.message);
    }
  }
  res.status(400).json({ data: 'Method not allowed' });
};
