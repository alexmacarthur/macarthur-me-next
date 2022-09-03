import * as dotenv from 'dotenv'
import AnalyticsService from '../../lib/AnalyticsService';
import type { NextApiRequest, NextApiResponse } from 'next'

dotenv.config();

const analyticsService = new AnalyticsService();

export default async (request: NextApiRequest, response: NextApiResponse) => {
    const { slug } = request.query;
    const views = await analyticsService.getTotalPostViews(slug as string);

    response.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=3600');

    return response
        .status(200)
        .json({ views })
}
