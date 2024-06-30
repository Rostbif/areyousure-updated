const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
module.exports = {
  mode: "production",
  entry: {
    eventPage2: path.resolve(__dirname, "..", "src", "eventPage2.ts"),
    options2: path.resolve(__dirname, "..", "src", "options2.ts"),
    content2: path.resolve(__dirname, "..", "src", "content2.ts"),
  },
  output: {
    path: path.join(__dirname, "../dist/src"),
    filename: "[name].js",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: ".", to: "..", context: "public" }],
    }),
  ],
};
