const CopyPlugin = require('copy-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const merge = require('webpack-merge');
const {config, getStyleLoaders} = require('./webpack.config.common.js');

module.exports = merge(config, {
	stats: {
		chunks: false,
	},
	mode: 'production',
	devtool: false,
	output: {
		jsonpFunction: "_j",
	},
	module: {
		rules: [
			...getStyleLoaders(true)
		]
	},
	plugins: [
		new CopyPlugin([
			{from: 'public', to: './'},
		]),
		new MiniCssExtractPlugin({
			filename: 'css/~app.[name].[hash].css',
			chunkFilename: 'css/~chunk.[name].[hash].css',
		}),
	],
	optimization: {
		minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
	}
});
