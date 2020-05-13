import builder from './builder';

import read from './gql/read.gql';
import readHisto from './gql/readHisto.gql';
import write from './gql/write.gql';
import publish from './gql/publish.gql';
import publishWrite from './gql/publishWrite.gql';
import subscribe from './gql/subscribe.gql';

const actions = builder.actions({
  read,
  readHisto,
  write,
  publish,
  publishWrite,
  subscribe
});

const b = builder.client({ fetch: null, ws: null });
const buildClient = b.buildApolloClient;
const buildClientBoost = b.buildApolloBoost;

export { actions, buildClient, buildClientBoost };
