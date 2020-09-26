const webpack = require('webpack')
const autoprefixer = require('autoprefixer')
const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const HtmlWebpackPlugin = require('html-webpack-plugin')

const merge = require('webpack-merge')
const TerserPlugin = require('terser-webpack-plugin')
const common = require('./webpack.common.js')


module.exports = merge(common, {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dev'),
    index: 'index.html'
  },
  output: {
    path: path.resolve(__dirname, 'dev'),
    filename: '[name].[hash].js',
    publicPath: '/',
    chunkFilename: '[name].[hash].js'
  },
  optimization: {
    minimize: false,
    runtimeChunk: false,
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'commons',
          chunks: 'all'
        }
      }
    },
    minimizer: [
      new TerserPlugin({
        sourceMap: true, // Must be set to true if using source-maps in production
        terserOptions: {
          compress: {
            drop_console: true
          }
        }
      })
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
      options: {
        postcss: [
          autoprefixer()
        ]
      }
    }),
    new webpack.optimize.AggressiveMergingPlugin(), // Merge chunks
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: '[name].[hash].css'
    }),
    new CopyPlugin([{
      context: path.resolve(__dirname, 'static'),
      from: '**/*',
      to: path.resolve(__dirname, 'dev')
    }]),
    new ManifestPlugin({ fileName: path.resolve(__dirname, 'dev/manifest.json') }),
    new HtmlWebpackPlugin({
      title: 'cryptoapuestas.com',
      template: 'src/index.html'
      // favicon: path.resolve(__dirname, 'static/favicon.ico')
    })
  ]
})
