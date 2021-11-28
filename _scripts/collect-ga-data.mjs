#!/usr/bin/env node

import dotenv from "dotenv";
import { writeFileSync } from "fs";
import { google } from 'googleapis';

dotenv.config();

const scopes = 'https://www.googleapis.com/auth/analytics.readonly';
const jwt = new google.auth.JWT(process.env.GA_CLIENT_EMAIL, null, process.env.GA_PRIVATE_KEY, scopes);

const posts = [
    'conditionally-rendering-templates-in-rails',
    'when-a-weakmap-came-in-handy',
    'serverless-wordpress-plugin-update-server',
    'use-case-for-bitwise-operator-in-javascript',
    'quick-dirty-ftp-server-digital-ocean',
    'bullets-cannonballs-web-components',
    'deploy-to-wp-engine-with-github-actions-and-composer',
    'when-dom-updates-appear-to-be-asynchronous',
    'why-i-like-tailwind-css',
    'dont-feel-bad-about-using-xmlhttprequest',
    'as-an-engineer-write',
    'avoid-heavy-babel-transformations-by-sometimes-not-writing-modern-javascript',
    'when-it-makes-sense-to-use-a-utility-function-instead-of-a-polyfill',
    'why-webpacker-wouldnt-compile-assets-in-a-specific-environment',
    'clean-up-your-redux-store-listeners-when-component-state-updates',
    'streamlining-conditional-statements-with-logical-operators',
    'if-democratic-candidates-were-javascript-packages',
    'frozen-three-plot-proposal',
    'use-web-workers-for-your-event-listeners',
    'blog-for-your-own-sake',
    'building-a-shell-function-to-copy-latest-commit-sha',
    'should-we-implement-differential-serving',
    'deploying-code-with-a-git-hook',
    'simpler-unit-testing-for-wordpress',
    'creating-a-map-method-for-objects-strings-sets-and-maps',
    'remember-to-probably-target-an-empty-object-with-object-assign',
    'formatting-my-php-more-efficiently-with-a-bash-function',
    'local-mysql-with-docker',
    'writing-a-regular-expression-to-target-images-without-a-class',
    'best-ish-practices-for-dynamically-prefetching-and-prerendering-with-javascript',
    'why-using-reduce-to-sequentially-resolve-promises-works',
    'introducing-better-resource-hints-wordpress-plugin',
    'using-the-posts-where-filter-in-wordpress',
    'preloading-javascript-in-wordpress',
    'creating-the-simplest-wordpress-plugin',
    'lets-stop-making-it-cool-to-hate-jquery',
    'build-your-own-simple-lazy-loading-functionality-in-wordpress',
    'building-a-lambda-function-with-netlify',
    'removing-usernames-from-password-reset-urls-in-woocommerce',
    'selecting-elements-with-no-class'
];

const postViewCounts = {};

console.log("Fetching views for posts...");
for(const slug of posts) {
    const result = await google.analytics('v3').data.ga.get({
        'auth': jwt,
        'ids': `ga:${process.env.GA_VIEW_ID}`,
        'start-date': "2012-01-01",
        'end-date': 'today',
        'metrics': 'ga:pageviews',
        'dimensions': 'ga:pagePath',
        'filters': `ga:pagePath=@${slug}`
    });

    const total = result.data?.totalsForAllResults?.['ga:pageviews'];

    postViewCounts[slug] = total;
}

console.log("Fetching total site views...");
const { data } = await google.analytics('v3').data.ga.get({
    'auth': jwt,
    'ids': `ga:${process.env.GA_VIEW_ID}`,
    'start-date': "2010-01-01",
    'end-date': 'today',
    'metrics': 'ga:pageviews'
});

const fileContents = {
    totalPageViewsForSite: data.totalsForAllResults['ga:pageviews'], 
    postViewCounts
}

writeFileSync('./_scripts/ga-data.json', JSON.stringify(fileContents));
console.log('Done!');
