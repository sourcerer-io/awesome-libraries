// Copyright 2019 Sourcerer Inc. All Rights Reserved.
// Author: Alexander Surkov (alex@sourcerer.io)

(async function() {
  'use strict';

const { URL } = require('url');
const fs = require('fs');
const { request } = require('./util.js');

if (process.argv.some(a => (a == '-h' || a == '--help'))) {
  console.log(
    `Exctracts PL/pgSQL extensions for Sourcerer awesome-libraries from pgnx.org - PostgreSQL extension network.`
  );
  console.log(`Usage: node pgnx.js [--debug]`);
  return;
}

let debugMode = process.argv.some(a => a =='--debug');

const libFile = `${__dirname}/../libs/plpgsql.json`;
let libContent = fs.readFileSync(libFile, 'utf-8');

let libs = null;
try {
  libs = JSON.parse(libContent);
}
catch(e) {
  throw new Error(`${libFile} is not valid JSON; ${e.toString()}`);
}
libs = new Set(libs.map(l => l.name));

for (let letter of 'abcdefghijklmnopqrstuvwxyz'.split('')) {
  let users = await request(`https://api.pgxn.org/users/${letter}.json`);
  for (let user of users) {
    log(`\n>Processing '${user.user}' user`);
    let user_info = await request(`https://api.pgxn.org/user/${user.user}.json`);
    for (let release in user_info.releases) {
      let ext_info = null;
      try {
        ext_info = await request(`https://api.pgxn.org/extension/${release}.json`);
      }
      catch(e) {
        log(`\n${release}\n  Skipped: no extension info found ${e.message}`);
        continue;
      }

      if (!ext_info.stable) {
        log(`\n${release}\n  Skipped: no stable version found`);
        continue;
      }

      let version = ext_info.stable.version;

      let meta_url = `https://api.pgxn.org/dist/${release}/${version}/META.json`;
      let dist_info = await request(meta_url);

      let resources = dist_info.resources;
      if (!resources || !resources.repository || resources.repository.type != 'git') {
        log(`\n${release} - ${version}\n  Skipped: no git sources found`);
        continue;
      }

      log(`\n${release} - ${version}`);
      log(`  ${dist_info.abstract}`);
      if (dist_info.description) {
        log(`  ${dist_info.description}`);
      }
      log(`  Sources: ${resources.repository.url}`);

      let tags = dist_info.tags;
      if (tags) {
        log(`  Tags: ${JSON.stringify(dist_info.tags)}`);
      }

      let docpath = dist_info.provides[release].docpath;
      log(`  Docs: https://api.pgxn.org/dist/${release}/${version}/${docpath}.html`);

      let knownLib = libs.has(release);
      log(`  Known lib: ${knownLib}`);

      if (!knownLib && !debugMode) {
        json_output({
          name: release,
          repo: resources.repository.url,
          tags,
          abstract: dist_info.abstract,
          description: dist_info.description,
          docpath
        });
      }
    }
  }
}

function log(msg)
{
  if (debugMode) {
    console.log(msg);
  }
}

function json_output({ name, repo, tags, abstract, description, docpath })
{
  console.log(`${JSON.stringify({
    id: `pgnx.${name.replace('_', '-')}`,
    imports: [ name ],
    name,
    repo,
    tags: tags,
    tech: [ abstract, description, docpath ]
  })},`);
}

}());
