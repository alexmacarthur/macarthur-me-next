require("dotenv").config();
import type { NextApiRequest, NextApiResponse } from 'next';
import gitHub from "octonode";
import { getRepos } from '../../lib/github';

export default async (_req: NextApiRequest, res: NextApiResponse) => {
  const client = gitHub.client(process.env.GITHUB_ACCESS_TOKEN);
  const allRepos = await getRepos(client);
  const totalStars = allRepos.reduce((total, { stargazers_count }) => {
    total = total + (stargazers_count || 0);

    return total;
  }, 0);

  res.status(200).json({ totalStars });
}
