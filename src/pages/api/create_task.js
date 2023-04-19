// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import Task from 'models/task.model';
import { connectDB } from 'setup/connectDb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await connectDB();
      const task = await Task.create(req.body);
      return res.status(200).json(task);
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({message: error.message});
    }
  }
  res.status(400).json({ data: 'Method not allowed' });
}
