Quick and Dirty Vehicle Service Provider
========================================

Contains a simple implementation of a vehicle server that provides
WebSocket server responding to basic `subscribe`, `unsubscribe`, `get`,
and `set` actions from a client.  Behind the server, it uses the Vinli
Stream Service as a data source.

The real meat of the implementation is in: **[server.js](https://github.com/pkinney/w3cag-simple-server/blob/master/server.js)**

Requirements:

* Docker (https://docs.docker.com/engine/installation/)
* DockerCompoese
* Node.js (>= v4.0)
* NPM
* Vinli CLI (http://blog.vin.li/2016/02/17/vinli-cli/)

### Starting:

```bash
npm install
docker-compose up
```

You will need to have a .vinlirc file or environmental variables specifying Vinli 
credentials.  You can create a `.vinlirc` file using the steps below or you can set
the following environment variables:

```bash
docker-compose run \
  -e VINLI_APP_ID=f6ba0eaf-30ab-40aa-8f86-8fc377e9ab7d \
  -e VINLI_APP_SECRET=VR37byf246gzSd3 \
  -e DEVICE_ID=64c7523f-3f5e-42bd-886b-c7164ffdebd1 \
  server
```

### Set up for Vinli feed:

#### Set up account:

More info: http://blog.vin.li/2016/02/17/vinli-cli/

```bash
npm install -g vinli-cli
vinli dev signup
vinli app create
vinli app set-current --app "<APP NAME>"
```

#### Create a dummy:

More info: http://blog.vin.li/2016/02/05/virtual-vinli/

```bash
vinli dummy create --name "My Fake Vinli"
vinli device set-current --device="<DEVICE ID>"
vinli dummy start --dummy="My Fake Vinli" --route="DFW - Downtown Route 1"
```

Following the above will create the correct `.vinlirc` file needed.

