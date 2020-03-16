const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const merge = require('webpack-merge');
const {config, resolvePath} = require('./webpack.config.common.js');
const https = false;
const host = '0.0.0.0';
const port = 8080;

module.exports = merge(config, {
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					'style-loader',
					{loader: 'css-loader', options: {modules: true, sourceMap: true}},
				]
			},
			{
				test: /\.(scss)|(sass)$/,
				use: [
					'style-loader',
					{loader: 'css-loader', options: {modules: true, sourceMap: true}},
					{loader: 'sass-loader', options: {sourceMap: true}}
				],
			},
		]
	},
	devServer: {
		contentBase: [
			resolvePath('dist'),
			resolvePath('public'),
		],
		overlay: true,
		hot: true,
		compress: true,
		historyApiFallback: true,
		open: false,
		https,
		host,
		port,
		// proxy: {
		// 	"/api": {
		// 		target: "http://localhost:8082/api",
		// 		changeOrigin: true,
		// 		pathRewrite: {
		// 			"^/api": ""
		// 		}
		// 	}
		// }
	},
	plugins: [
		new FriendlyErrorsWebpackPlugin({
			compilationSuccessInfo: {
				messages: [`Your application is running here: ${https ? 'https' : 'http'}://${host}:${port}`],
			},
			clearConsole: true,
		}),
	]
});
