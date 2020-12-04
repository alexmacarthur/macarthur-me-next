const gitHub = require('octonode');

const getOpenSourceRepos = async () => {
  console.log('Beginning to fetch GitHub repos...');

  const client = gitHub.client(process.env.GITHUB_ACCESS_TOKEN);
  let [, data] = await client.getAsync("/users/alexmacarthur/repos", { per_page: 100, type: 'public' });

  console.log(`Fetched ${data.length} repositories from GitHub...`);

  const commitPromises = data.map(async repo => {
    return await client.getAsync(`/repos/alexmacarthur/${repo.name}/commits`, { per_page: 1 });
  });

  let commitData = await Promise.allSettled(commitPromises);
  console.log('Got commit data...');
  commitData = commitData
    .filter(commit => commit.status === "fulfilled")
    .map(commit => commit.value[1][0])
    .reduce((allCommitData, commit) => {
      const repoName = commit?.commit.url.match(/alexmacarthur\/(.+)\/git/)[1];

      allCommitData[repoName] = commit;

      return allCommitData;
    }, {});


  const tagPromises = data.map(async repo => {
    return await client.getAsync(`/repos/alexmacarthur/${repo.name}/tags`, { per_page: 1 });
  });

  let tagData = await Promise.allSettled(tagPromises);
  console.log('Got tag data...');
  tagData = tagData
    .filter(tag => tag.status === "fulfilled")
    .filter(tag => tag.value[1].length > 0)
    .map(tag => tag.value[1][0])
    .reduce((alltagData, tag) => {
      const repoName = tag.zipball_url.match(/alexmacarthur\/(.+)\/zipball/)[1];
      alltagData[repoName] = tag;

      return alltagData;
    }, {});

  console.log('Returning repository data...');

  return data
    // Only permit those with stars and are NOT forks.
    .filter(repo => {
      const hasStars = repo.stargazers_count > -1;
      const isFork = repo.fork;

      return hasStars && !isFork;
    })

    // Only permit those with recent-ish commits.
    .filter(repo => {
      const commit = commitData[repo.name];

      if (!commit) {
        return false;
      }

      const lastCommitDate = commit?.commit?.author?.date;
      const updatedDate = new Date(lastCommitDate);
      const nowDate = new Date();
      const pastTime = nowDate.setMonth(nowDate.getMonth() - 12);

      return updatedDate.getTime() > pastTime;
    })

    // Only those that have a tag.
    .filter(repo => {
      return !!tagData[repo.name];
    })

    // Sort by number of stars.
    .sort(function (a, b) {
      return b.stargazers_count - a.stargazers_count;
    })

    // Normalize the data.
    .map(repo => {
      return {
        html_url: repo.html_url,
        description: repo.description,
        name: repo.name,
        stargazers_count: repo.stargazers_count
      }
    });
}

module.exports = {
  getOpenSourceRepos
}
