import gitHub from "octonode";
import { getTags } from "./utils.mjs";
import { getCommits } from "./utils.mjs";
import { getRepos } from "./utils.mjs";

export const getOpenSourceRepos = async () => {
  console.log("Beginning to fetch GitHub repos...");

  const client = gitHub.client(process.env.GITHUB_ACCESS_TOKEN);
  const repoData = await getRepos(client);
  const commitData = await getCommits(repoData, client);
  const tagData = await getTags(repoData, client);

  console.log("Returning repository data...");

  // Must calculate this before the project page filter
  const totalStars = repoData.reduce((total, { stargazers_count }) => {
    total = total + (stargazers_count || 0);

    return total;
  }, 0);

  return (
    {
      totalStars,
      repoData: repoData
        // Only permit those with stars
        .filter((repo) => repo.stargazers_count > 0)

        // Only permit those with commits made in the last two years.
        .filter((repo) => {
          const commit = commitData[repo.name];

          if (!commit) {
            return false;
          }

          const lastCommitDate = commit?.commit?.author?.date;
          const updatedDate = new Date(lastCommitDate);
          const nowDate = new Date();
          const pastTime = nowDate.setMonth(nowDate.getMonth() - 24);

          return updatedDate.getTime() > pastTime;
        })

        // Only those that have a tag/release.
        .filter((repo) => !!tagData[repo.name])

        // Only those that are not archived.
        .filter((repo) => !repo.archived)

        // Sort by number of stars.
        .sort((a, b) => b.stargazers_count - a.stargazers_count)

        // Normalize the data.
        .map((repo) => {
          return {
            html_url: repo.html_url,
            description: repo.description,
            name: repo.name,
            stargazers_count: repo.stargazers_count,
          };
        })
    }
  )
};
