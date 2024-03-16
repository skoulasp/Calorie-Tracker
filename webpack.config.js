const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
    entry: "./src/App.js",
    devtool: "source-map",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist"),
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname, "dist"),
        },
        port: 3000,
        open: true,
        hot: true,
        compress: true,
    },

    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: ["style-loader", "css-loader", "sass-loader"],
            },
            {
                test: /\.html$/i,
                loader: "html-loader",
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: "asset/resource",
                generator: {
                    filename: "assets/fonts/[name][ext]",
                },
            },
            {
                test: /\.svg$/i,
                type: "asset/inline",
            },
            // {
            //     test: /\.(png|jpe?g|gif)$/i,
            //     use: [
            //         {
            //             loader: "file-loader",
            //             options: {
            //                 name: "[name].[ext]",
            //                 outputPath: "assets/img/",
            //                 publicPath: "assets/img/",
            //                 esModule: false,
            //             },
            //         },
            //     ],
            // },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
        }),
    ],
};
