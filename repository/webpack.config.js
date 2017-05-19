const webpack = require('webpack');

module.exports = {
  entry: __dirname + "/tweaks/index.js",
  output: {
    path: __dirname + "/dist",
    filename: "repository.js"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ 'css-loader' ]
      },
      {
        test: /\.png$/,
        use: [ 'base64-image-loader' ]
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      }
    ]
  }
};