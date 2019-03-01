// Copyright 2019 Sourcerer Inc.
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
  'Cargo': {
    langs: [
      'Rust',
    ],
    homepage: 'https://crates.io/',
  },
  'CocoaPods': {
    langs: [
      'Objective-C',
    ],
    homepage: 'http://cocoapods.org/',
  },
  'CPAN': {
    langs: [
      'Perl',
    ],
    homepage: 'https://metacpan.org',
  },
  'Go': {
    langs: [
      'Go',
    ],
    homepage: 'https://go-search.org/',
  },
  'NuGet': {
    langs: [
      'C#',
      'JavaScript',
    ],
    homepage: 'https://www.nuget.org/',
  },
  'NPM': {
    langs: [
      'JavaScript',
    ],
    homepage: 'https://www.npmjs.com',
  },
  'Maven': {
    langs: [
      'Java',
    ],
    homepage: 'http://maven.org',
  },
  'Packagist': {
    langs: [
      'PHP',
    ],
    homepage: 'https://packagist.org',
  },
  'PlatformIO': {
    langs: [
      'C++',
    ],
    homepage: 'http://platformio.org',
  },
  'Pypi': {
    langs: [
      'Python',
    ],
    homepage: 'https://pypi.org/',
  },
  'Rubygems': {
    langs: [
      'Ruby',
    ],
    homepage: 'https://rubygems.org',
  },
  'SwiftPM': {
    langs: [
      'Python',
    ],
    homepage: 'https://developer.apple.com/swift/',
  },
};

const libinfo = {
  'C#': {
    file: 'csharp.json',
    prefix: 'cs',
  },
  'C++': {
    file: 'cpp.json',
    prefix: 'cpp',
  },
  'Go': {
    file: 'go.json',
    prefix: 'go',
  },
  'Java': {
    file: 'java.json',
    prefix: 'java',
  },
  'JavaScript': {
    file: 'javascript.json',
    prefix: 'js',
  },
  'Objective-C': {
    file: 'objectivec.json',
    prefix: 'objc',
  },
  'Perl': {
    file: 'perl.json',
    prefix: 'perl',
  },
  'PHP': {
    file: 'php.json',
    prefix: 'php',
  },
  'Python': {
    file: 'python.json',
    prefix: 'py',
  },
  'Ruby': {
    file: 'ruby.json',
    prefix: 'rb',
  },
  'Rust': {
    file: 'rust.json',
    prefix: 'rust',
  },
  'Swift': {
    file: 'swift.json',
    prefix: 'swift',
  },
};

let key = '';
let platform = '';
let lang = '';
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

    case '-l': case '--lang':
      lang = process.argv[++i];
      break;

    case '-k' : case '--key':
      key = process.argv[++i];
      break;

    case '-c' : case '--cap':
      limit = parseInt(process.argv[++i]);
      break;
  }
}

if (!platform || !key || process.argv.some(a => (a == '-h' || a == '--help'))) {
  console.log(`Exctracts libraries from libraries.io for Sourcerer.`);
  console.log(
`Usage: node librariesio.js [ -k | --key <key> ] [ -p | --platform <platform> ][--debug]
Supported platforms (package managers) and languages:`);
  for (let name in platforms) {
    let p = platforms[name];
    console.log(`  ${name}\t[ ${p.langs.join(', ')} ], ${p.homepage}`);
  }
  return;
}

if (!platforms[platform]) {
  console.log(`'${platform}' platform is not supported. Run |node librariesio.js| for currently supported platforms and languages.`);
  return;
}

if (!lang) {
  lang = platforms[platform].langs[0];
}

if (!platforms[platform].langs.includes(lang)) {
  console.log(`'${lang}' language is not supported. Run |node librariesio.js| for currently supported platforms and languages.`);
  return;
}

const libFile = `${__dirname}/../libs/${libinfo[lang].file}`;
let libContent = fs.readFileSync(libFile, 'utf-8');

let libs = null;
try {
  libs = JSON.parse(libContent);
}
catch(e) {
  throw new Error(`${libFile} is not valid JSON; ${e.toString()}`);
}
let libsByRepos = new Set(libs.map(l => l.repo.toLowerCase()));

let newLibs = [];
const pages = [ 1, 2 ]; // 200 results should be enough for now.
for (let page of pages) {
  const URL =
  `https://libraries.io/api/search?platforms=${platform}&languages=${lang}&page=${page}&per_page=100&api_key=${key}`;

  let projects = await request(URL);
  for (let project of projects) {
    if (newLibs.length >= limit) {
      break;
    }

    // Strip https://github.com/ from repo if any.
    let origRepo = project.repository_url;
    let repo = origRepo.replace(/^.*github\.com\//, '');

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

    log(`  Repo: ${origRepo}`);
    if (!await checkURL(origRepo)) {
      log(`  Skipping: repo not found`);
      continue;
    }

    name = name.replace(/.+[/]/, ''); // Strip path from name.

    // Ignore duplicating repos.
    if (newLibs.find(l => l.repo == repo)) {
      continue;
    }

    newLibs.push({
      id: `${libinfo[lang].prefix}.${name.replace('_', '-')}`,
      imports: [ name ],
      name,
      repo,
      tags,
      tech: [ description, homepage ].filter(v => !!v),
      status: 'awaiting-model',
    });

    if (newLibs.length >= limit) {
      break;
    }
  }
}

if (debugMode) {
  return;
}

if (newLibs.length > 0) {
  // Push new libs into the end.
  Array.prototype.push.apply(libs, newLibs);
}

let content = `[${libs.map(v => ('\n  ' + JSON.stringify(v)))}
]
`;
fs.writeFileSync(libFile, content, 'utf-8');

console.log(`${newLibs.length} libs were added to libs/${libinfo[lang].file} file:`);
for (let lib of newLibs) {
  console.log(`  ${lib.id}`);
}
console.log(`
When libs are adjusted, please make sure to run
  node technologies.js
to update technologies.json and sort the libs`
);

function log(msg)
{
  if (debugMode) {
    console.log(msg);
  }
}

}());
