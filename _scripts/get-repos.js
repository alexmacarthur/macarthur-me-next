#!/usr/bin/env node

require('dotenv').config()

const fs = require('fs');
const rimraf = require("rimraf");
const { getOpenSourceRepos } = require("../lib/github");

rimraf.sync(`${process.cwd()}/lib/repo-data.json`);

try {
  getOpenSourceRepos().then(repos => {
    fs.writeFileSync(`${process.cwd()}/lib/repo-data.json`, JSON.stringify(repos));

    console.log(`Fetched ${repos.length} repos!`);
  });
} catch(e) {
  console.log(e.message);
}
