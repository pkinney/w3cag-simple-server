'use strict';

const uuid = require('node-uuid');

const WebSocketServer = require('ws').Server;
const server = new WebSocketServer({ port: parseInt(process.env.PORT || 3000) });

const store = require('./store');
const vinliClient = require('./vinli');
vinliClient.setStore(store);

const clients = {};

server.on('connection', (ws) => {
  const clientId = uuid();
  clients[clientId] = ws;

  ws.on('message', (body) => {
    const message = JSON.parse(body);

    switch (message.action) {
      case 'subscribe':
        store.subscribe(clientId, message.path);
        break;
      case 'unsubscribe':
        store.unsubscribe(clientId, message.subscriptionId);
        break;
      case 'get':
        clients[clientId].send(JSON.stringify({
          path: message.path,
          value: store.get(message.path)
        }));
        break;
      case 'set':
        store.set(message.path, message.value);
        break;
      default:
        console.log(`unkonwn message action: ${body}`);
    }
  });
});
