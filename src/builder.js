import gql from 'graphql-tag';
import Observable from 'zen-observable';

import ApolloClientBoost from 'apollo-boost';

import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { onError } from 'apollo-link-error';
import ApolloClient from 'apollo-client';

import defaultConf from './default';

const buildUri = ({ host, port = null, path = null, ssl = false }) => {
  console.log({ host, port, path, ssl });
  let networkPath = host;
  if (port) networkPath += ':' + port;
  if (path) networkPath += path;
  const protocolHttp = ssl ? 'https://' : 'http://';
  const protocolWs = ssl ? 'wss://' : 'ws://';
  return {
    http: protocolHttp + networkPath,
    ws: protocolWs + networkPath
  };
};

const client = ({ fetch, ws }) => {
  const buildApolloBoost = ({
    server = defaultConf.server,
    onErrorAction = defaultConf.onErrorAction
  } = {}) => {
    const uri = buildUri(server).http;

    const apolloClientConf = {
      uri,
      onError: onErrorAction
    };
    if (fetch) apolloClientConf.fetch = fetch;
    const client = new ApolloClientBoost(apolloClientConf);

    return client;
  };

  const buildApolloClient = ({
    server = defaultConf.server,
    onErrorAction = defaultConf.onErrorAction
  } = {}) => {
    const uri = buildUri(server);
    console.log(uri);

    const httpLink = new HttpLink({ uri: uri.http, fetch: fetch });
    console.log('httpLink');
    console.log(httpLink);

    const webSocketLinkConf = {
      uri: uri.ws,
      options: {
        reconnect: true
      },
      webSocketImpl: ws
    };
    if (ws) webSocketLinkConf.ws = ws;
    const wsLink = new WebSocketLink(webSocketLinkConf);
    console.log('wsLink');
    console.log(wsLink);

    const onErrorLink = onError(onErrorAction);
    const link = onErrorLink.concat(
      split(
        ({ query }) => {
          const { kind, operation } = getMainDefinition(query);
          const test =
            kind === 'OperationDefinition' && operation === 'subscription';
          //   console.log({ operation, kind, test });
          return test;
        },
        wsLink,
        httpLink
      )
    );
    // const link = split(() => true, wsLink, httpLink);

    const cache = new InMemoryCache();

    const apolloClientConf = {
      cache,
      link,
      onError: onErrorAction
    };
    if (fetch) apolloClientConf.fetch = fetch;
    const client = new ApolloClient({
      cache,
      link,
      fetch: fetch,
      onError: onErrorAction
    });

    return client;
  };

  return { buildApolloBoost, buildApolloClient };
};

const actions = ({
  read,
  readHisto,
  write,
  publish,
  publishWrite,
  subscribe
}) => {
  const parseValue = (value) => {
    let val;
    try {
      val = JSON.parse(value);
    } catch (e) {
      val = Number(value) ? parseFloat(value) : value;
    }
    return val;
  };

  const _read = async ({
    client,
    variables: { channel, name },
    opts = {},
    raw = false
  }) => {
    const res = await client.query({
      query: gql(read),
      variables: { channel, name },
      ...opts
    });
    if (raw) return res;
    const data = res.data.read;
    if (data) {
      delete data.__typename;
      data.value = parseValue(data.value);
    }
    return data;
  };

  const _readHisto = async ({
    client,
    variables: { channel, name, n, start = 0 },
    opts = {},
    raw = false
  }) => {
    const res = await client.query({
      query: gql(readHisto),
      variables: { channel, name, start, end: start + n },
      ...opts
    });
    if (raw) return res;
    const data = res.data.readHisto;
    if (data) {
      for (const e of data) {
        e.value = parseValue(e.value);
        delete e.__typename;
      }
    }
    return data;
  };

  const _write = async ({
    client,
    variables: { channel, name, value, add_histo = true, expiry = null },
    opts = {},
    raw = false
  }) => {
    let res;
    const value2 = typeof value === 'number' ? String(value) : value;
    try {
      res = await client.query({
        query: gql(write),
        variables: { channel, name, value: value2, add_histo, expiry },
        ...opts
      });
    } catch (e) {
      const error = {
        graphQLErrors: e.graphQLErrors,
        networkError: {
          name: e.networkError.name,
          statusCode: e.networkError.statusCode,
          errors: e.networkError.result.errors.map((f) => f.message)
        }
      };
      return { error };
    }
    if (raw) return res;
    const data = res.data.write;
    delete data.__typename;
    return data;
  };

  const _publish = async ({
    client,
    variables: { channel, name, value },
    opts = {},
    raw = false
  }) => {
    let res;
    const value2 = typeof value === 'number' ? String(value) : value;
    try {
      res = await client.query({
        query: gql(publish),
        variables: { channel, name, value: value2 },
        ...opts
      });
    } catch (e) {
      const error = {
        graphQLErrors: e.graphQLErrors,
        networkError: {
          name: e.networkError.name,
          statusCode: e.networkError.statusCode,
          errors: e.networkError.result.errors.map((f) => f.message)
        }
      };
      return { error };
    }
    if (raw) return res;
    const data = res.data.publish;
    delete data.__typename;
    return data;
  };

  const _publishWrite = async ({
    client,
    variables: { channel, name, value, add_histo = true, expiry = null },
    opts = {},
    raw = false
  }) => {
    let res;
    const value2 = typeof value === 'number' ? String(value) : value;

    try {
      res = await client.query({
        query: gql(publishWrite),
        variables: { channel, name, value: value2, add_histo, expiry },
        ...opts
      });
    } catch (e) {
      const error = {
        graphQLErrors: e.graphQLErrors,
        networkError: {
          name: e.networkError.name,
          statusCode: e.networkError.statusCode,
          errors: e.networkError.result.errors.map((f) => f.message)
        }
      };
      return { error };
    }
    if (raw) return res;
    const data = res.data.publishWrite;
    delete data.__typename;
    return data;
  };

  const _subscribe = ({
    client,
    variables: { channel, pattern = true },
    opts = {},
    raw = false,
    observer: { next, error, complete }
  }) => {
    const obs = client.subscribe({
      query: gql(subscribe),
      variables: { channel, pattern },
      ...opts
    });
    const obs2 = Observable.from(obs).map((e) => {
      if (raw) return e;
      const f = e.data.subscribe;
      if (f) {
        f.value = parseValue(f.value);
        delete f.__typename;
        return f;
      }
    });
    const subscription = obs2.subscribe({
      next,
      error,
      complete
    });
    return subscription;
  };

  const _unsubscribe = (subscription) => subscription.unsubscribe();

  return {
    read: _read,
    readHisto: _readHisto,
    write: _write,
    publishWrite: _publishWrite,
    publish: _publish,
    subscribe: _subscribe,
    unsubscribe: _unsubscribe
  };
};

export default { client, actions };
