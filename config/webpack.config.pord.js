const CopyPlugin = require('copy-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const merge = require('webpack-merge');
const {config} = require('./webpack.config.common.js');

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
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					{loader: 'css-loader', options: {modules: true, sourceMap: true}},
				]
			},
			{
				test: /\.(scss)|(sass)$/,
				use: [
					MiniCssExtractPlugin.loader,
					{loader: 'css-loader', options: {modules: true, sourceMap: true}},
					{loader: 'sass-loader', options: {sourceMap: true}}
				],
			},
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
