import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const data = req.body;

    // Insert data into database.

    res.status(200).json({ name: 'John Doe' });
}
