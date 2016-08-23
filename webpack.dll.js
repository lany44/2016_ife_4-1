var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: {
    vendors: [
      "react",
      "react-dom",
      "react-redux",
      "redux",
      "react-router",
      "react-router-redux",
      "recharts"
      // ...其它库
    ]
  },
  output:{
    filename: '[name].dll.js',
    path: path.resolve( __dirname, './build/dll' ),
    library: "[name]"
  },
  plugins:[
    new webpack.DllPlugin({
      path: path.resolve( __dirname, './build/dll/[name]-manifest.json'),
      name: "[name]"
    }),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      output: {comments: false},
    })
  ],
  resolve: {
    root: path.resolve(__dirname, "src"),
    modulesDirectories: ["node_modules"]
  }
};
