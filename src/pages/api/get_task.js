// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import Task from 'models/task.model';
import { connectDB } from 'setup/connectDb';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      await connectDB();
      const tasks = await Task.findOne(red.query.taskId);
      return res.status(200).json(tasks);
    } catch (error) {
      console.error(error.message);
      return res.status(500).json(error.message);
    }
  }
  res.status(400).json({ data: 'Method not allowed' });
}
