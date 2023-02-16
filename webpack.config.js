/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

/** @type {import('webpack').Configuration} */
module.exports = {
  mode: process.env.NODE_ENV || "development",
  entry: {
    background: path.join(__dirname, "src/background.ts"),
    options: path.join(__dirname, "src/options.ts"),
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [
    new CopyPlugin({ patterns: [{ from: ".", to: ".", context: "static" }] }),
  ],
  devtool: "cheap-module-source-map",
};
