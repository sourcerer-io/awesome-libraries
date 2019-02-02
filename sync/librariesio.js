// Copyright 2019 Sourcerer Inc. All Rights Reserved.
// Author: Alexander Surkov (alex@sourcerer.io)

(async function() {
  'use strict';

const { URL } = require('url');
const fs = require('fs');
const {
  checkURL,
  request
} = require('./util.js');

const platforms = {
  'Go': 'go',
};

let key = '';
let platform = '';
let limit = 5;
let debugMode = false;

for (let i = 0; i < process.argv.length; i++) {
  let arg = process.argv[i];
  switch (arg) {
    case '--debug':
      debugMode = true;
      break;

    case '-p': case '--platform':
      platform = process.argv[++i];
      break;

    case '-k' : case '--key':
      key = process.argv[++i];
      break;

    case '-l' : case '--limit':
      limit = parseInt(process.argv[++i]);
      break;
  }
}

if (!platform || !key || process.argv.some(a => (a == '-h' || a == '--help'))) {
  console.log(`Exctracts libraries from libraries.io for Sourcerer.`);
  console.log(
`Usage: node librariesio.js [ -k | --key <key> ] [ -p | --platform <platform> ][--debug]
Supported platforms (package managers):
  Go\t'Go', https://go-search.org/`
  );
  return;
}

const lang = platforms[platform];
if (!lang) {
  console.log(`'${platform}' platform is not supported. Run |node librariesio.js| for currently supported platforms.`);
  return;
}

const libFile = `${__dirname}/../libs/${lang}.json`;
let libContent = fs.readFileSync(libFile, 'utf-8');

let libs = null;
try {
  libs = JSON.parse(libContent);
}
catch(e) {
  throw new Error(`${libFile} is not valid JSON; ${e.toString()}`);
}
let libsByRepos = new Set(libs.map(l => l.repo.toLowerCase()));

let outputCount = 0;
const pages = [ 1, 2 ]; // 200 results should be enough for now
for (let page of pages) {
  const URL =
  `https://libraries.io/api/search?platforms=${platform}&page=${page}&per_page=100&api_key=${key}`;

  let projects = await request(URL);
  for (let project of projects) {
    let repo = project.repository_url;
    if (libsByRepos.has(repo.toLowerCase())) {
      log(`  Skipping known lib: ${repo}`);
      continue;
    }

    let name = project.name;
    let description = project.description;
    let homepage = project.homepage;

    log(`\n${name}`);
    log(`  ${description}`);
    log(`  Homepage: ${homepage}`);

    let tags = project.keywords;
    log(`  Tags: ${JSON.stringify(tags)}`);

    log(`  Repo: ${repo}`);
    if (!await checkURL(repo)) {
      log(`  Skipping: repo not found`);
      continue;
    }

    if (!debugMode) {
      json_output({
        id_prefix: lang,
        name,
        repo,
        tags,
        description,
        homepage
      });
    }

    if (++outputCount >= limit) {
      break;
    }
  }

  if (outputCount >= limit) {
    log(`${limit} fetched`);
    break;
  }
}

function log(msg)
{
  if (debugMode) {
    console.log(msg);
  }
}

function json_output({ id_prefix, name, repo, tags, description, homepage })
{
  name = name.replace(/.+[/]/, ''); // strip path from name
  console.log(`${JSON.stringify({
    id: `${id_prefix}.${name.replace('_', '-')}`,
    imports: [ name ],
    name,
    repo,
    tags,
    tech: [ description, homepage ].filter(v => !!v),
    status: 'awaiting-model'
  })},`);
}

}());
