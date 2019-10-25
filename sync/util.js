// Copyright 2019 Sourcerer Inc.
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
        try {
          resolve(JSON.parse(Buffer.from(stream.read()), res));
        }
        catch(e) {
          reject(e);
        }
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
  let options = null;
  try { options = new URL(url); }
  catch(e) { resolve(false); }

  let protocol = options.protocol.replace(':', '');
  if (protocol != 'http' && protocol != 'https') {
    resolve(false);
    return;
  }
  const req = require(protocol).request(
    options, res => resolve(res.statusCode == 200)
  );
  req.on('error', () => resolve(false));
  req.end();
});

module.exports.request = request;
module.exports.checkURL = checkURL;

}());
