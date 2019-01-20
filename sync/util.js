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
      reject({
        errcode: 0,
        errmsg: 'Unsupported protocol'
      });
      return;
    }

    const req = require(protocol).request(options, (res) => {
      if (res.statusCode != 200) {
        reject({
          errcode: res.statusCode,
          errmsg: `HTTP error code ${res.statusCode} for ${url}`
        });
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
      reject({
        errcode: 0,
        errmsg: `Failed to request ${url}`
      });
    });
    req.end();
  });
}

const checkURL = url => new Promise(resolve => {
  let options = new URL(url);
  let protocol = options.protocol.replace(':', '');
  if (protocol != 'http' && protocol != 'https') {
    resolve(false);
    return;
  }
  const req = require(protocol).request(
    options, res => resolve(res.statusCode != 404)
  );
  req.on('error', () => resolve(false));
  req.end();
});

module.exports.request = request;
module.exports.checkURL = checkURL;

}());
