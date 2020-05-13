import { actions, buildClient } from '../../dist/bundle';

// WARNING CLIENT BOOST DOES NOT WORK WITH SUBSCRIPTIONS
const clientA = buildClient();
// console.log({ clientA });

const run = async () => {
  const variablesS = { channel: 'channel-1', pattern: true };
  console.log('\n--- subscription\n');
  console.log(JSON.stringify(variablesS));

  const subscription = actions.subscribe({
    client: clientA,
    variables: variablesS,
    raw: true,
    observer: {
      next: (data) => {
        const sep = '-->';
        console.log(`${sep} data:\n${JSON.stringify(data, null, 2)}`);
      },
      error: (error) => {
        const sep = '*'.repeat(50);
        console.log(`\n${sep}\nsubscription error:\n${error}`);
      },
      complete: () => {
        const sep = '*'.repeat(50);
        console.log(`\n${sep}\nsubscription complete\n`);
      }
    }
  });

  console.log('\n--- subscription done\n');
  console.log('*'.repeat(50));

  global.setTimeout(() => subscription.unsubscribe(), 4000);
  const timer = global.setInterval(() => console.log('--- TIC ---'), 1000);
  global.setTimeout(() => global.clearInterval(timer), 4000);
  global.setTimeout(() => process.exit(), 4500);
};

run();
