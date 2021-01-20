/* globals require:true, module: true, __dirname: true */
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
	entry: "./src/index.js",
	devServer: {
		index: path.resolve(__dirname, "server/index.html"),
		contentBase: path.join(__dirname, "server")
	},
	output: {
		path: path.resolve(__dirname, "build"),
		filename: "gdpr-consent.js",
		library: "GDPRConsent",
		libraryTarget: "umd"
	},
	target: "browserslist",
	module: {
		rules: [
			{
				test: /\.(js)$/,
				exclude: /node_modules/,
				use: ["babel-loader"],
			},
			{
				test: /\.scss$/,
				exclude: /node_modules/,
				use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
			}
		],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: "gdpr-consent.css",
		})
	]
};