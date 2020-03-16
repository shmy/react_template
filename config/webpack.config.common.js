const path = require("path");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const tsImportPluginFactory = require('ts-import-plugin');

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
				options: {
					transpileOnly: true,
					onlyCompileBundledFiles: true,
					getCustomTransformers: () => ({
						before: [tsImportPluginFactory([
							{
								libraryName: 'antd',
								libraryDirectory: 'es',
								style: true
							},
							{
								style: false,
								libraryName: 'lodash',
								libraryDirectory: null,
								camel2DashComponentName: false
							}
						])]
					}),
				},
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
			filename: 'index.html',
			minify: {
				collapseWhitespace: true,
				removeComments: true,
				removeRedundantAttributes: true,
				removeScriptTypeAttributes: true,
				removeStyleLinkTypeAttributes: true,
				useShortDoctype: true
			},
		}),
	]
};
exports.getStyleLoaders = (isProd = false) => {
	const styleLoader = isProd ? MiniCssExtractPlugin.loader : 'style-loader';
	return [
		{
			test: /\.css$/,
			use: [
				styleLoader,
				{loader: 'css-loader', options: {modules: true, sourceMap: true}},
			]
		},
		{
			test: /\.(scss)|(sass)$/,
			use: [
				styleLoader,
				{loader: 'css-loader', options: {modules: true, sourceMap: true}},
				{loader: 'sass-loader', options: {sourceMap: true}}
			],
		},
		{
			test: /\.less$/,
			use: [
				styleLoader,
				{loader: 'css-loader', options: {modules: false, sourceMap: true}},
				{loader: 'less-loader', options: {javascriptEnabled: true, sourceMap: true}}
			],
		},
	];
};
exports.resolvePath = resolvePath;
