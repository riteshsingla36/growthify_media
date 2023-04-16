// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import Task from 'models/task.model';
import User from 'models/user.model';
import { connectDB } from 'setup/connectDb';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      await connectDB();
      let tasks;
      if(req.query.assignee) {
        tasks = await Task.find({assignee: req.query.assignee}).populate(['assignee', 'assignor', 'client', 'createdBy']);
      }
      else {
        tasks = await Task.find({}).populate({ path: ['assignee', 'assignor', 'client', 'createdBy'], model: User });
      }
      console.log(tasks, 'tasks')
      return res.status(200).json(tasks);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }
  res.status(400).json({ data: 'Method not allowed' });
}
