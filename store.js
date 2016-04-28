'use strict';

const _ = require('lodash');
const uuid = require('node-uuid');

const db = {};
const subs = [];

const notifySubs = (path, value) => {
  const toNotify = _.filter(subs, (sub) => {
    return sub.key === path;
  });

  _.each(toNotify, (sub) => {
    sub.cb({ path: path, value: value });
  });
};

module.exports = {
  set: (key, value) => {
    console.log(`STORE: set ${key}=${JSON.stringify(value)}`);

    db[key] = value;

    notifySubs(key, value);
  },

  get: (key) => {
    return db[key];
  },

  subscribe: (clientId, key, cb) => {
    const subId = uuid();
    subs.push({
      id: subId,
      clientId: clientId,
      key: key,
      cb: cb
    });

    return subId;
  },

  unsubscribe: (clientId, subId) => {
    _.remove(subs, (sub) => sub.id === subId && sub.clientId === clientId);
  }
};