const webpack = require('webpack');
const path = require('path');
const uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

const config = {
　　entry: './src/index.js',
　　output: {
  　　 path: path.resolve(__dirname, './dist/'),
　 　　filename: "mutag.min.js",
　　},
　　module: {
   　　loaders: [{
      　　test: /\.js$/,
      　　exclude: /node_modules/,
      　　loader: ['babel-loader', 'eslint-loader']
  　　 }],
　　},
    plugins: [
      new uglifyJsPlugin()
    ]
};

module.exports = config; 
  