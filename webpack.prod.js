const common = require('./webpack.common.js');
const { merge } = require('webpack-merge');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
    new WorkboxWebpackPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      runtimeCaching: [
        {
          urlPattern: /\.(?:js|css|html|png|jpg|jpeg|svg|gif)$/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'assets',
          },
        },
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\//,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'google-fonts-stylesheets',
          },
        },
        {
          urlPattern: /^https:\/\/fonts\.gstatic\.com\//,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-webfonts',
            expiration: {
              maxEntries: 30,
              maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
            },
          },
        },
      ],
      navigateFallback: '/index.html',
    }),
  ],
});
