const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OfflinePlugin = require('offline-plugin')

module.exports = {
  entry: {
    app: './lib/index.js',
    commons: [
      'babel-polyfill'
    ]
  },
  plugins: [
    new OfflinePlugin({
      publicPath: '/',
      appShell: '/',
      externals: [
        '/'
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
