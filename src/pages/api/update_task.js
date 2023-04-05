// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import Task from 'models/task.model';
import { connectDB } from 'setup/connectDb';

export default async function handler(req, res) {
  if (req.method === 'PATCH') {
    const taskId = req.query.taskId;
    try {
      await connectDB();
      let task;
      if(taskId) {
        task = await Task.findOneAndUpdate({_id: taskId}, req.body, {runValidators: true});
        return res.status(200).json(task);
      }
      return res.status(200).json({})
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }
  res.status(400).json({ data: 'Method not allowed' });
};
