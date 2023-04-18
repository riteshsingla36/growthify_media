// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import Task from 'models/task.model';
import { connectDB } from 'setup/connectDb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await connectDB();
      console.log(req.body);
      const task = await Task.create(req.body);
      return res.status(200).json(task);
    } catch (error) {
      console.log(error.message);
      return res.status(500).json(error.message);
    }
  }
  res.status(400).json({ data: 'Method not allowed' });
}
