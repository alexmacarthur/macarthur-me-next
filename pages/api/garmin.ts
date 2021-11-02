require("dotenv").config();
import type { NextApiRequest, NextApiResponse } from 'next'
import GarminService from '../../lib/GarminService';

const garminService = new GarminService();

export default async (req: NextApiRequest, res: NextApiResponse) => {
    res.status(200).json({
        restingHeartRate: await garminService.getRestingHeartRateForWeek()
    });
}
