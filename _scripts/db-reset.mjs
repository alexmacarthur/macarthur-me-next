#!/usr/bin/env node

import fs from "fs";

const dir = `${process.cwd()}/json_db`;
fs.rmSync(dir, { recursive: true, force: true });
fs.mkdirSync(dir);

console.log("JSON database reset.");
