// import toto from '../../dist/bundle.js';
// console.log(toto);

import { actions, buildClient, buildClientBoost } from '../../dist/bundle';

// WARNING CLIENT BOOST AND APOLLO BOTH WORK WITH QUERY/MUTATIONS
const clientA = buildClient();
const clientB = buildClientBoost();
// console.log({ clientA, clientB });
// console.log({ clientA, clientB: Object.keys(clientB) });

const run = async () => {
  const variablesQ = { channel: 'channel-1', name: 'toto' };
  console.log('\n--- query\n');
  console.log(JSON.stringify(variablesQ));

  const variablesH = { channel: 'channel-1', name: 'toto', n: 10, start: 0 };
  console.log('\n--- query histo\n');
  console.log(JSON.stringify(variablesH));

  const variablesM1 = {
    channel: 'channel-1',
    name: 'toto',
    value: 123,
    add_histo: true
  };
  const variablesM2 = {
    channel: 'channel-1',
    name: 'toto',
    value: JSON.stringify({ a: 22, b: 'abc', c: { d: { f: 'def' } } }),
    add_histo: true
  };
  console.log('\n--- mutation\n');
  console.log(JSON.stringify(variablesM1));
  console.log(JSON.stringify(variablesM2));

  const optsQ = { fetchPolicy: 'network-only' };
  const optsM = { fetchPolicy: 'no-cache' };

  const resAQ = await actions.read({
    client: clientA,
    variables: variablesQ,
    raw: false,
    opts: optsQ
  });
  const resBQ = await actions.read({
    client: clientB,
    variables: variablesQ,
    raw: false,
    opts: optsQ
  });

  const resAH = await actions.readHisto({
    client: clientB,
    variables: variablesH,
    raw: false,
    opts: optsQ
  });

  const resAM1 = await actions.write({
    client: clientB,
    variables: variablesM1,
    raw: false,
    opts: optsM
  });
  const resAM2 = await actions.write({
    client: clientB,
    variables: variablesM2,
    raw: false,
    opts: optsM
  });

  console.log('\n--- requests sent\n');
  console.log('*'.repeat(50));

  console.log('\n--- awnswer query for client');
  console.log(resAQ);
  console.log('\n--- awnswer query for client Boost');
  console.log(resBQ);

  console.log('\n--- awnswer query histo');
  console.log(JSON.stringify(resAH, null, 2));

  console.log('\n--- awnswer mutation histo');
  console.log(resAM1);
  console.log(resAM2);

  process.exit();
};

run();
