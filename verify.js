// Copyright 2018 Sourcerer Inc.
// Author: Alexander Surkov (alex@sourcerer.io)

(function() {
  'use strict';

/**
 * Validates librariy files, located in 'libs' directory, and generates
 * technologies.json.
 */

const fs = require('fs');
const path = require('path');

const dir = 'libs';

let techs = new Map();

let files = fs.readdirSync(dir);
for (let filename of files) {
  let ids = new Set();
  let repos = new Map();

  let libFile = path.join(dir, filename);
  let content = fs.readFileSync(libFile, 'utf-8');

  let libs = null;
  try {
    libs = JSON.parse(content);
  }
  catch(e) {
    fail(`${filename} not valid JSON; ${e.toString()}`);
    return;
  }

  for (let lib of libs) {
    if (!Array.isArray(lib.tech) || lib.tech.length == 0) {
      fail(`${filename}: no tech for ${lib.id}`);
    }
    if (!Array.isArray(lib.tags) || lib.tags.length == 0) {
      fail(`${filename}: no tags for ${lib.id}`);
    }

    let id = lib.id.toLowerCase();
    if (ids.has(id)) {
      fail(`${filename} file: '${id}' library id duplication`);
    }
    ids.add(id);

    let repo = lib.repo.toLowerCase();
    if (repo) {
      if (repos.has(repo)) {
        let repo_ids = repos.get(repo);
        repo_ids.push(lib.id);
        fail(
          `${filename} file: '${repo}' repo duplication for ${repo_ids.map(i => `'${i}'`).join(', ')} libraries`
        );
      }
      repos.set(repo, [ lib.id ]);
    }
    else if (!lib.examples || lib.examples.length == 0) {
      fail(`${filename} file: '${lib.id}' lib has neither repo or examples provided`);
    }

    let tech = lib.tech[0];
    if (!techs.has(tech)) {
      techs.set(tech, new Set());
    }
    let tags = techs.get(tech);
    for (let tag of lib.tags) {
      if (!tags.has(tag)) {
        tags.add(tag);
      }
    }
  }

  libs.sort( // Sort libs by tech, id.
    (a, b) => {
      if (a.tech[0] < b.tech[0]) {
        return -1;
      }
      if (a.tech[0] > b.tech[0]) {
        return 1;
      }
      if (a.id < b.id) {
        return -1;
      }
      if (a.id > b.id) {
        return 1;
      }
      return 0;
    }
  );

  content = `[${libs.map(v => ('\n  ' + JSON.stringify(v)))}
]
`;
  fs.writeFileSync(libFile, content, 'utf-8');
}

let techs_json = {};
let tech_names = Array.from(techs.keys()).sort();
for (let tech of tech_names) {
  let tags = techs.get(tech);
  techs_json[tech] = { tags: Array.from(tags).sort() };
}

let output = `${JSON.stringify(techs_json, null, '  ')}
`;

fs.writeFileSync(`technologies.json`, output);
console.log(`\x1b[42mSUCCESS!\x1b[0m technologies.json was updated; libs were sorted`);

function fail(msg)
{
  console.error(`\x1b[41m\x1b[37m!Failed:\x1b[0m ${msg}`);
}

}());
