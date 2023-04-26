// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import Task from 'models/task.model';
import { connectDB } from 'setup/connectDb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    
    try {
      await connectDB();
      console.log(req.body);
      console.log(JSON.parse(req.body));
    //   let task;
    //   if(taskId) {
    //     task = await Task.findOneAndDelete({_id: taskId});
    //     return res.status(200).json(task);
    //   }
    //   throw new Error('Please provide a taskId to delete the task');
    } catch (error) {
      console.error(error.message);
      return res.status(500).json(error.message);
    }
  }
  res.status(400).json({ data: 'Method not allowed' });
};
