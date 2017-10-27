module.exports = {
  entry: './src/app.js',
  output: {
    path: __dirname + '/dist/assets',
    publicPath: '/assets/',
    filename: 'app.bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: [
            ["env", {
              "targets": {
                "browsers": ["last 2 Chrome versions"]
              }
            }],
            'react'
          ]
        }
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.less$/,
        loaders: ['style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'url-loader'
      }
    ]
  },
  devServer: {
    host: '0.0.0.0',
    contentBase: './dist'
  }
};
