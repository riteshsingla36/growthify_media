// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import User from "models/user.model";
import { connectDB } from "setup/connectDb"

export default async function handler(req, res) {
    if(req.method === 'GET'){
        await connectDB();
        const users = await User.find({});
        console.log(users, "users");
        return res.status(200).json(users);
    }
    res.status(200).json({ name: 'John Doe' })
  }
  