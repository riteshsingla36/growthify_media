// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const slackToken = process.env.SLACK_TOKEN;
        const slackChannel = "#" + req.body.channelName;
      const options = {
        headers: {
          "Authorization": "Bearer " + slackToken,
          "Content-Type": "application/json"
        }
        };
    
      const url = `https://slack.com/api/chat.postMessage?channel=${encodeURIComponent(slackChannel)}`;
      const data = {
        text: req.body.message,
        channel: slackChannel
      };
      const response = await axios.post(url, data, options);
      return res.status(200).json({message: "success"});
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }
  res.status(400).json({ data: 'Method not allowed' });
}
