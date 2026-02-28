const path = require('path');
const postcss = require('postcss-loader');
const tailwindpostcss = require('@tailwindcss/postcss');

module.exports = {
    entry: './client/client.js',
    mode: 'development',
    watchOptions: {
        aggregateTimeout: 200,
    },
    output: {
        path: path.resolve(__dirname, 'hosted'),
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.css$/, // only accept filenames with ends of `.css`
                use: [
                    "style-loader",
                    "css-loader",
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: [
                                    [
                                        "@tailwindcss/postcss",
                                    ],
                                ],
                            },
                        },
                    },
                ],
            },
        ]
    }
}