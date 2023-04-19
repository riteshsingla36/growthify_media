// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const channelName = req.body.channelName;
            const slackToken = process.env.SLACK_TOKEN;
            const apiUrl = "https://slack.com/api/conversations.create";
            const options = {
                headers: {
                    "Authorization": "Bearer " + slackToken,
                    "Content-Type": "application/json"
                },
                
            };

            const databody = {
                name: channelName,
                is_private: false
            }

            const response = await axios.post(apiUrl, databody, options);
            const data = response.data;
            if (data.ok == true) {
                const channelId = data.channel.id;
                return res.status(200).json({channelId: channelId});
            } else {
                const error = data.error;
                throw new Error(error);
            }
        } catch (error) {
            console.error(error.message);
            return res.status(500).json({message: error.message});
        }

    }
    res.status(400).json({ data: 'Method not allowed' });
}
