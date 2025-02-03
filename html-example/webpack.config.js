// webpack.config.js
const path = require('path');

module.exports = {
  entry: './src/p3dViewer.js',  // Path to your entry file
  output: {
    filename: 'bundle.js',  // The output file name
    path: path.resolve(__dirname, 'dist'),  // The output directory
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],  // For modern JS syntax
          },
        },
      },
    ],
  },
};
