module.exports = {
  // other configurations
  module: {
    rules: [
      {
        test: /\.tsx?$/, // This will match both .ts and .tsx files
        use: "ts-loader",
        exclude: /node_modules/,
      },
      // other rules if necessary
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
};
