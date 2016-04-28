Quick and Dirty Vehicle Service Provider
========================================

Contains a simple implementation of a vehicle server that provides
WebSocket server responding to basic `subscribe`, `unsubscribe`, `get`,
and `set` actions from a client.  Behind the server, it uses the Vinli
Stream Service as a data source.

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

