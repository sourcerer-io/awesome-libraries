// Copyright 2018 Sourcerer Inc.
// Author: Alexander Surkov (alex@sourcerer.io)

(function() {
  'use strict';

/**
 * Generates technologies.json from library files located in 'libs' directory.
 */

const fs = require('fs');
const path = require('path');

const dir = 'libs';

let techs = new Map();

let ids = new Set();
let repos = new Set();

let files = fs.readdirSync(dir);
for (let filename of files) {
  let libFile = path.join(dir, filename);
  let content = fs.readFileSync(libFile, 'utf-8');

  let libs = null;
  try {
    libs = JSON.parse(content);
  }
  catch(e) {
    throw new Error(`${filename} not valid JSON; ${e.toString()}`);
  }

  for (let lib of libs) {
    if (!Array.isArray(lib.tech) || lib.tech.length == 0) {
      throw new Error(`${filename}: no tech for ${lib.id}`);
    }
    if (!Array.isArray(lib.tags) || lib.tags.length == 0) {
      throw new Error(`${filename}: no tags for ${lib.id}`);
    }

    if (ids.has(lib.id.toLowerCase())) {
      console.error(`${filename} file: '${lib.id}' library id duplication`);
    }
    ids.add(lib.id.toLowerCase());
    if (ids.has(lib.repo.toLowerCase())) {
      console.error(`${filename} file: '${lib.repo}' library repo duplication`);
    }
    repos.add(lib.repo.toLowerCase());

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
console.log(`SUCCESS: technologies.json was updated; libs were sorted by tech, id`);

}());
