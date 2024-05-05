// pages/api/jira.js
import axios from 'axios';

export default async function handler(req, res) {
    const { method } = req;

    switch (method) {
        case 'GET':
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_JIRA_URL}${req.query.id}`, {
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    auth: {
                        username: process.env.NEXT_PUBLIC_JIRA_USER,
                        password: process.env.NEXT_PUBLIC_JIRA_API_KEY,
                    }
                });
                res.status(200).json(response.data);
            } catch (error) {
                res.status(500).json({ error: error.toString() });
            }
            break;
        default:
            res.setHeader('Allow', ['GET']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}