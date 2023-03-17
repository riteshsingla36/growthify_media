// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import User from "models/user.model";
import { connectDB } from "setup/connectDb"

export default async function handler(req, res) {
    if(req.method === 'POST'){
        await connectDB();
        console.log(req.body, 'body');
        const user = await User.create(req.body);
        console.log(user, "users");
        return res.status(200).json(user);
    }
    res.status(200).json({ name: 'John Doe' })
  }
  