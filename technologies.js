(function() {
  'use strict';

/**
 * Generates technologies.json from library files located in 'libs' directory.
 */

const fs = require('fs');
const path = require('path');

const dir = 'libs';

let techs = new Map();

let files = fs.readdirSync(dir);
for (let filename of files) {
  let content = fs.readFileSync(path.join(dir, filename), 'utf-8');
  let libs = JSON.parse(content);
  
  for (let lib of libs) {
    if (!Array.isArray(lib.tech) || lib.tech.length == 0) {
      throw new Error(`${filename}: no tech for ${lib.id}`);
    }
    if (!Array.isArray(lib.tags) || lib.tags.length == 0) {
      throw new Error(`${filename}: no tags for ${lib.id}`);
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

}());
