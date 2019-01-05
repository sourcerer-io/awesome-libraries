// Copyright 2019 Sourcerer Inc. All Rights Reserved.
// Author: Alexander Surkov (alex@sourcerer.io)

(async function() {
  'use strict';

const { URL } = require('url');
const fs = require('fs');

const request = (url) => {
  return new Promise((resolve, reject) => {
    let options = new URL(url);
    let protocol = options.protocol.replace(':', '');
    if (protocol != 'http' && protocol != 'https') {
      reject('Unsupported protocol');
      return;
    }

    const req = require(protocol).request(options, (res) => {
      if (res.statusCode != 200) {
        reject(`HTTP error code ${res.statusCode} for ${url}`);
        return;
      }

      let stream = new require('stream').Transform();
      res.on('data', (chunk) => {
        stream.push(chunk);
      });
      res.on('end', () => {
        resolve(JSON.parse(Buffer.from(stream.read()), res));
      });
    });
    req.on('error', (e) => {
      console.error(e);
      reject(`Failed to request ${url}`);
    });
    req.end();
  });
}

module.exports.request = request;

}());
