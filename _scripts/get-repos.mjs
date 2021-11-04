#!/usr/bin/env node

import dotenv from "dotenv";

import fs from "fs";
import * as rimraf from "rimraf";
import { getOpenSourceRepos } from "../lib/github/index.mjs";

dotenv.config();

rimraf.default.sync(`${process.cwd()}/lib/repo-data.json`);

try {
  getOpenSourceRepos().then((data) => {
    fs.writeFileSync(
      `${process.cwd()}/lib/repo-data.json`,
      JSON.stringify(data)
    );
  });
} catch (e) {
  console.log(e.message);
}
