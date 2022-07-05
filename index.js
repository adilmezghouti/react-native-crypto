'use strict'

import { randomBytes } from 'react-native-randombytes'
import Pbkdf2 from 'react-native-fast-pbkdf2'
import { shim } from 'react-native-quick-base64'
exports.randomBytes = exports.rng = exports.pseudoRandomBytes = exports.prng = randomBytes

shim()
// implement window.getRandomValues(), for packages that rely on it
if (typeof window === 'object') {
  if (!window.crypto) window.crypto = {}
  if (!window.crypto.getRandomValues) {
    window.crypto.getRandomValues = function getRandomValues(arr) {
      let orig = arr
      if (arr.byteLength != arr.length) {
        // Get access to the underlying raw bytes
        arr = new Uint8Array(arr.buffer)
      }
      const bytes = randomBytes(arr.length)
      for (var i = 0; i < bytes.length; i++) {
        arr[i] = bytes[i]
      }

      return orig
    }
  }
}

exports.createHash = exports.Hash = require('create-hash')
exports.createHmac = exports.Hmac = require('create-hmac')

var hashes = ['sha1', 'sha224', 'sha256', 'sha384', 'sha512', 'md5', 'rmd160'].concat(Object.keys(require('browserify-sign/algos')))
exports.getHashes = function () {
  return hashes
}

exports.pbkdf2 = (
  password,
  salt,
  iterations,
  keySize,
  hash) => {
  return Pbkdf2.derive(
    password.toString(),
    salt.toString(),
    iterations,
    keySize,
    hash.toLowerCase().replace('sha', 'sha-')).then(value => global.Buffer.from(atob(value)))
}

exports.pbkdf2Sync = (
  password,
  salt,
  iterations,
  keySize,
  hash) => {
  const value = Pbkdf2.deriveSync(
    password.toString(),
    salt.toString(),
    iterations,
    keySize,
    hash.toLowerCase().replace('sha', 'sha-'))
  return global.Buffer.from(atob(value))
}
var aes = require('browserify-cipher')
  ;[
    'Cipher',
    'createCipher',
    'Cipheriv',
    'createCipheriv',
    'Decipher',
    'createDecipher',
    'Decipheriv',
    'createDecipheriv',
    'getCiphers',
    'listCiphers'
  ].forEach(function (key) {
    exports[key] = aes[key]
  })

var dh = require('diffie-hellman')
  ;[
    'DiffieHellmanGroup',
    'createDiffieHellmanGroup',
    'getDiffieHellman',
    'createDiffieHellman',
    'DiffieHellman'
  ].forEach(function (key) {
    exports[key] = dh[key]
  })

var sign = require('browserify-sign')
  ;[
    'createSign',
    'Sign',
    'createVerify',
    'Verify'
  ].forEach(function (key) {
    exports[key] = sign[key]
  })

exports.createECDH = require('create-ecdh')

var publicEncrypt = require('public-encrypt')

  ;[
    'publicEncrypt',
    'privateEncrypt',
    'publicDecrypt',
    'privateDecrypt'
  ].forEach(function (key) {
    exports[key] = publicEncrypt[key]
  })

var rf = require('randomfill')

exports.randomFill = rf.randomFill
exports.randomFillSync = rf.randomFillSync

  // the least I can do is make error messages for the rest of the node.js/crypto api.
  ;[
    'createCredentials'
  ].forEach(function (name) {
    exports[name] = function () {
      throw new Error([
        'sorry, ' + name + ' is not implemented yet',
        'we accept pull requests',
        'https://github.com/crypto-browserify/crypto-browserify'
      ].join('\n'))
    }
  })
