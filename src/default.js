const server = {
  host: 'localhost',
  port: 4000,
  path: '/graphql',
  ssl: false
};

const onErrorAction = ({ graphQLErrors, networkError, operation }) => {
  const sep = `*`.repeat(10);
  if (graphQLErrors)
    console.log(
      `${sep} graphQLErrors START\n`,
      graphQLErrors,
      `\n${sep} graphQLErrors END\n`
    );
  if (networkError)
    console.log(
      `${sep} networkError START\n`,
      networkError,
      `\n${sep} networkError END\n`
    );
  console.log(
    `${sep} operation START\n`,
    operation,
    `\n${sep} operation END\n`
  );
  //   process.exit();
};

export default { server, onErrorAction };
