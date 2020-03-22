const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const merge = require('webpack-merge');
const {config, resolvePath, getStyleLoaders} = require('./webpack.config.common.js');
const https = false;
const host = '0.0.0.0';
const port = 8080;

module.exports = merge(config, {
	module: {
		rules: [
			...getStyleLoaders(false)
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
		proxy: {
			"/api": {
				target: "http://localhost:3000/api",
				changeOrigin: true,
				pathRewrite: {
					"^/api": ""
				}
			},
			"/static": {
				target: "http://localhost:3000/static",
				changeOrigin: true,
				pathRewrite: {
					"^/static": ""
				}
			},
			"/sso": {
				target: "http://localhost:3000/sso",
				changeOrigin: true,
				pathRewrite: {
					"^/sso": ""
				}
			}
			// "/api": {
			// 	target: "https://sso.shmy.tech/api",
			// 	changeOrigin: true,
			// 	pathRewrite: {
			// 		"^/api": ""
			// 	}
			// },
			// "/static": {
			// 	target: "https://sso.shmy.tech/static",
			// 	changeOrigin: true,
			// 	pathRewrite: {
			// 		"^/static": ""
			// 	}
			// },
			// "/sso": {
			// 	target: "https://sso.shmy.tech/sso",
			// 	changeOrigin: true,
			// 	pathRewrite: {
			// 		"^/sso": ""
			// 	}
			// }
		}
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
