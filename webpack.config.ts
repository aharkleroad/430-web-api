const path = require('path');
import webpack from "webpack";
// in case you run into any TypeScript error when configuring `devServer`
import "webpack-dev-server";

const config: webpack.Configuration = {
    entry: "./src/index.ts",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
    },
    mode: 'development',
    watchOptions: {
        aggregateTimeout: 200,
    }
};

export default config;