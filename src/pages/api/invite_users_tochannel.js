// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const {channelId, userIds} = req.body;
            const slackToken = process.env.SLACK_TOKEN
            const url = "https://slack.com/api/conversations.invite";
            const options = {
                headers: {
                    "Authorization": "Bearer " + slackToken,
                    "Content-Type": "application/json"
                },
            };

            const data = {
                channel: channelId,
                users: userIds
            }

            const response = await axios.post(url, data, options);
            const responseData = response.data;
            if (responseData.ok) {
                console.debug("User invited to channel");
                return res.status(200).json({message: "Invited Successfull"})
            }
            throw new Error(responseData.error);
        } catch (error) {
            console.error(error.message);
            return res.status(500).json(error.message);
        }
    }
    res.status(400).json({ data: 'Method not allowed' });
}
