const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");

const resolvePath = name => path.resolve(__dirname, '../', name);
exports.config = {
	mode: "development",
	entry: "./src/index.tsx",
	devtool: "inline-source-map",
	output: {
		filename: "js/~app.[name].[hash].js",
		chunkFilename: '~js/chunk.[name].[hash].js',
		path: resolvePath("dist"),
		publicPath: "/"
	},
	module: {
		rules: [
			{
				test: /\.(tsx)|(ts)$/,
				exclude: /node_modules/,
				include: resolvePath('src'),
				loader: 'ts-loader',
			},
			{
				test: /\.(jpg)|(jpeg)|(png)|(bmp)|(svg)$/,
				loader: 'url-loader',
				options: {
					limit: 1024 * 10,
					name: '~[name].[hash].[ext]',
					outputPath: 'static/img/'
				}
			},
		]
	},
	resolve: {
		alias: {
			"@": resolvePath('src'),
		},
		extensions: ['.tsx', '.ts', '.js'],
	},

	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			template: resolvePath('./index.html'),
			filename: 'index.html'
		}),
	]
};
exports.resolvePath = resolvePath;
