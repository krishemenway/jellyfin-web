const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = {
	entry: {
		app: ["./App.tsx"],
	},

	output: {
		filename: "[name].js",
		path: __dirname + "/dist"
	},

	resolve: {
		extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
		plugins: [new TsconfigPathsPlugin()]
	},

	module: {
		rules: [
			{ test: /\.(png|jpg|gif)$/, use: [{ loader: "file-loader", options: {} }], },
			{ test: /\.(tsx|ts)?$/, loader: "ts-loader" },
		]
	},

	plugins: [
		new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
		new CopyPlugin({
			patterns: [
				{ from: "./strings/*.json", to: "[name][ext]" },
				{ from: "./app.html", to: "[name][ext]" },
			]
		}),
	],

	watchOptions: {
		aggregateTimeout: 200,
		poll: 3000,
		followSymlinks: true,
	},

	externals: { },
};