'use strict';

const _ = require('lodash');
const uuid = require('node-uuid');

const db = {};
const subs = [];

const notifySubs = (path, value) => {
  const toNotify = _.filter(subs, (sub) => {
    return sub.path === path;
  });

  _.each(toNotify, (sub) => {
    sub.cb(path, value);
  });
};

module.exports = {
  set: (path, value) => {
    console.log(`STORE: set ${path}=${JSON.stringify(value)}`);

    db[path] = value;

    notifySubs(path, value);
  },

  get: (path) => {
    return db[path];
  },

  subscribe: (clientId, path, cb) => {
    const subId = uuid();
    subs.push({
      id: subId,
      clientId: clientId,
      path: path,
      cb: cb
    });

    return subId;
  },

  unsubscribe: (clientId, subId) => {
    if (subId) {
      _.remove(subs, (sub) => sub.id === subId && sub.clientId === clientId);
    } else {
      _.remove(subs, (sub) => sub.clientId === clientId);
    }
  },

  unsubscribeByPath: (clientId, path) => {
    _.remove(subs, (sub) => sub.path === path && sub.clientId === clientId);
  }
};