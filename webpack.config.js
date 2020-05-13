const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
//   .BundleAnalyzerPlugin;

const mode = process.env.NODE_ENV_WP;

console.log(`--- start building in MODE = ${mode}\n... `);
// const dependencies = Object.keys(require('/package.json').dependencies);

const modules = {
  rules: [
    {
      test: /\.(js)$/,
      exclude: /node_modules/,
      use: 'babel-loader'
    },
    {
      test: /\.(graphql|gql|txt)$/,
      exclude: /node_modules/,
      use: 'raw-loader'
    }
  ]
};

const confSrcNodeModule = {
  name: 'node-module',
  target: 'node',
  entry: './src/index-node.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.es.js'
  },
  module: modules,
  externals: [nodeExternals()],
  mode
};

const confSrcNodeBundle = {
  name: 'node-bundle',
  target: 'node',
  entry: './src/index-node.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    library: 'jupyterBridge',
    libraryTarget: 'umd', // node and browser - see https://webpack.js.org/guides/author-libraries/
    globalObject: 'this' // necessary for node and browser - see https://webpack.js.org/configuration/output/#outputglobalobject
  },
  module: modules,
  externals: {},
  plugins: [new webpack.IgnorePlugin(/utf-8-validate|bufferutil/)],
  mode
};

const confSrc2Browser = {
  name: 'browser-version',
  target: 'web',
  entry: './src/index-browser.js',
  output: {
    path:
      mode === 'development'
        ? path.resolve(__dirname, 'test/browser')
        : path.resolve(__dirname, 'distB'),
    filename: 'index.js',
    library: 'jupyterBridge',
    libraryTarget: 'umd'
  },
  module: modules,
  externals: {},
  plugins: [
    //   new BundleAnalyzerPlugin()
  ],
  mode,
  devServer:
    mode === 'development'
      ? {
          host: '0.0.0.0',
          port: 9001,
          publicPath: '/',
          contentBase: './test/browser',
          watchContentBase: false,
          compress: true,
          open: false
        }
      : {},
  devtool: mode === 'development' ? 'inline-source-map' : ''
  //   optimization: {
  //     splitChunks: {
  //       cacheGroups: {
  //         commons: {
  //           test: /[\\/]node_modules[\\/]/,
  //           filename: 'vendors.js',
  //           name: 'vendors',
  //           chunks: 'all'
  //         }
  //       }
  //     }
  //   }
};

module.exports = [
  // comment to debug
  confSrcNodeModule,
  confSrcNodeBundle,
  confSrc2Browser
];
