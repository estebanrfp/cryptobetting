// const path = require('path')
// const CleanWebpackPlugin = require('clean-webpack-plugin')
// const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OfflinePlugin = require('offline-plugin')

module.exports = {
  entry: {
    app: './lib/index.js',
    commons: [
      'babel-polyfill'
    ]
  },
  // plugins: [
  //   new CleanWebpackPlugin(['dist']),
  //   new HtmlWebpackPlugin({
  //     title: 'Production'
  //   })
  // ],
  // output: {
  //   path: path.resolve(__dirname, 'dist'),
  //   filename: '[name].[hash].js',
  //   publicPath: '/',
  //   chunkFilename: '[name].[hash].js'
  // }
  plugins: [
    new OfflinePlugin({
      publicPath: '/',
      appShell: '/',
      externals: [
        '/'
        // 'https://desarrolloactivo.ams3.cdn.digitaloceanspaces.com/fonts/material-icons/Material-Design-Iconic-Font.woff2?v=2.2.0'
      ],
      ServiceWorker: {
        events: true
      },
      AppCache: {
        events: true
      }
    })
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.styl$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader?importLoaders=true',
          'postcss-loader',
          'stylus-loader'
        ]
      },
      {
        test: /\.html$/,
        use: [{
          loader: 'html-loader',
          options: {
            interpolate: true
          }
        }]
      },
      {
        test: /\.pug$/,
        use: ['pug-loader?pretty=true']
      }
    ]
  }
}
