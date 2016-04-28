'use strict';

const FS = require('fs');
const _ = require('lodash');
const WebSocket = require('ws');

let vinliConf = {};

if (process.env.VINLI_APP_ID) {
  vinliConf = {
    app: process.env.VINLI_APP_ID,
    secret: process.env.VINLI_APP_SECRET,
    device: process.env.DEVICE_ID
  };
} else {
  vinliConf = JSON.parse(FS.readFileSync('./.vinlirc'));
}

let store;

console.log('Creating WebSocket...');

const vinliStream = new WebSocket('wss://stream.vin.li/api/v1/messages', null, {
  headers: {
    Authorization: `Basic ${new Buffer(`${vinliConf.app}:${vinliConf.secret}`).toString('base64')}`
  }
});

vinliStream.once('open', () => {
  console.log('Socket open');
  vinliStream.send(JSON.stringify({
    type: 'sub',
    subject: {
      type: 'device',
      id: vinliConf.device
    }
  }));
});

vinliStream.on('message', (body) => {
  const message = JSON.parse(body);

  switch (message.type) {
    case 'pub':
      _.each(message.payload.data, (v, k) => {
        store.set(k, v);
      });
      break;
    default:
      // console.log(`unkonwn vinli message type: ${body}`);
  }
});

vinliStream.on('error', (err) => {
  console.log(err);
});

module.exports.setStore = (_store) => {
  store = _store;
};