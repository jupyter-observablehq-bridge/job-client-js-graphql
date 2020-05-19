# JOB JavaScript Client

## Overview

See [documentation](https://observablehq.com/@oscar6echo/jupyter-observablehq-bridge).

JavaScript package Node and Browser.  

## Build

```bash
yarn build
```

## Test

```bash
# start random publish
yarn sim

# --- browser
# query mutations subscriptions
yarn test-browser

# --- module
# query mutations
yarn test-module-qm
# subscriptions
yarn test-module-su

# --- bundle
# query mutations
yarn test-bundle-qm
# subscriptions
yarn test-bundle-su
```
