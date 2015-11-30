var path = require('path');
var webpack = require('webpack');
var assetsRootDir = __dirname + '/src/assets';

module.exports = {
  entry: [
    'webpack-hot-middleware/client',
    './src/client/client.js',
  ],

  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/assets/',
    filename: 'bundle.js',
    pathinfo: true,
  },

  resolve: {
    extensions: ['', '.js', '.css', '.jade'],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.browser': JSON.stringify(true),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),

    // new webpack.ProvidePlugin({
    //   'es6-promise': 'es6-promise',
    // }),

    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ],

  module: {
    loaders: [
      { test: /\.styl$/, loader: 'style!css!stylus' },
      { test: /\.jade$/, loaders: [
          'html?root=' + assetsRootDir + '&-removeRedundantAttributes',
          'template-html-loader?' + JSON.stringify({
            raw: true,
            pretty:false,
            doctype: 'html',
            engine: 'jade',
          }),
        ],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel',

        query: {
          cacheDirectory: true,
          optional: ['runtime'],
          stage: 0,
        },
      },
    ],
  },
};
