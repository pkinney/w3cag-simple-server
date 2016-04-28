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

  console.log(`Connection established with client ${clientId}`);

  ws.on('message', (body) => {
    const message = JSON.parse(body);

    switch (message.action) {
      case 'subscribe':
        store.subscribe(clientId, message.path, (path, value) => {
          console.log(`PUB: ${path}=${JSON.stringify(value)}`);
          clients[clientId].send(JSON.stringify({
            path: path,
            value: value
          }));
        });
        break;
      case 'unsubscribe':
        if (message.subscriptionId) {
          store.unsubscribe(clientId, message.subscriptionId);
        } else {
          store.unsubscribeByPath(clientId, message.path);
        }
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

  ws.on('close', () => {
    console.log(`Client ${clientId} disconnected.`);
    store.unsubscribe(clientId);
    delete clients[clientId];
  });
});
