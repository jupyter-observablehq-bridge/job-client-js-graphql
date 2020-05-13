# Demo Web Page

Demo how to use job-client-js-graphql in a regular web page.


```bash
# go to job-server-js-graphql folder
yarn sim
# or
yarn sim2
```

### Install

```bash
# copy bridge.js from distB/
cp ../../distB/index.js bridge.js
```

### Run

- Launch [randomPublish.js](https://github.com/jupyter-observablehq-bridge/job-server-js-graphql/blob/master/src/randomPublish.js):

```bash
# go to job-server-js-graphql folder
yarn sim
# or
yarn sim2
```

- Launch server in this directory, e.g. with [VS Code live-server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer).

```bash
# in demo-page/ folder
python -m http.server 8080
```
