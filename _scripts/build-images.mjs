#!/usr/bin/env node

import shell from "shelljs";
import { globbySync } from "globby";
import fs from "fs";
import sizeOf from "image-size";
import rimraf from "rimraf";

const files = globbySync(["./_posts/**/*.{png,jpeg,jpg,svg,gif}"]);

rimraf.sync(`${process.cwd()}/public/post-images`);
rimraf.sync(`${process.cwd()}/lib/image-data.json`);

const imageData = {};

files.forEach((file) => {
  const parts = file.split("/").reverse();
  const rawSlug = parts[1];
  const slug = rawSlug.replace(/\d{4}-\d{2}-\d{2}-/, "");
  const directory = `${process.cwd()}/public/post-images/${slug}`;
  const { width, height } = sizeOf(file);
  const newPath = `${directory}/${parts[0]}`;

  imageData[slug] = imageData[slug] || {};
  imageData[slug][parts[0]] = { width, height };

  if (!fs.existsSync(directory)) {
    shell.mkdir("-p", directory);
  }

  fs.copyFileSync(file, newPath);
});

fs.writeFileSync(
  `${process.cwd()}/lib/image-data.json`,
  JSON.stringify(imageData)
);

console.log(`Copied ${files.length} images!`);
