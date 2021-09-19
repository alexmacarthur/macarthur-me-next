#!/usr/bin/env node

import dotenv from 'dotenv';

import fs from "fs";
import * as rimraf from "rimraf";
import { getOpenSourceRepos } from "../lib/github.mjs";

dotenv.config();

rimraf.default.sync(`${process.cwd()}/lib/repo-data.json`);

try {
  getOpenSourceRepos().then((repos) => {
    fs.writeFileSync(
      `${process.cwd()}/lib/repo-data.json`,
      JSON.stringify(repos)
    );

    console.log(`Fetched ${repos.length} repos!`);
  });
} catch (e) {
  console.log(e.message);
}
