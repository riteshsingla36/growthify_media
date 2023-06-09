// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
        const token = process.env.SLACK_TOKEN;
        const apiUrl = "https://slack.com/api/users.lookupByEmail?email=" + encodeURIComponent(req.query.email);

        const headers = {
          "Authorization": "Bearer " + token
        };
        const response = await axios.get(apiUrl, { headers });
        const data = response.data;
        if (data.ok) {
            return res.status(200).json({userId: data.user.id});
        }
        throw new Error(data.error);
    } catch (error) {
      console.error(error.message);
      return res.status(500).json(error.message);
    }

  }
  res.status(400).json({ data: 'Method not allowed' });
}
