import fs from 'fs';
import fetch from 'node-fetch';
import ws from 'ws';
import builder from './builder';

const load = (path) => fs.readFileSync(path).toString('utf-8');

const queryStrings = {
  read: load('./src/gql/read.gql'),
  readHisto: load('./src/gql/readHisto.gql'),
  write: load('./src/gql/write.gql'),
  publish: load('./src/gql/publish.gql'),
  publishWrite: load('./src/gql/publishWrite.gql'),
  subscribe: load('./src/gql/subscribe.gql')
};

const actions = builder.actions(queryStrings);

const b = builder.client({ fetch, ws });
const buildClient = b.buildApolloClient;
const buildClientBoost = b.buildApolloBoost;

export { actions, buildClient, buildClientBoost };
