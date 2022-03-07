const HTMLWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const path = require("path");

module.exports = {
    entry: [
        path.resolve(__dirname, "../public/js/index.js")
    ],
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "../build/")
    },
    plugins: [
        new HTMLWebpackPlugin({
            filename: "index.html",
            template: path.resolve(__dirname, "../public/html/index.html")
        }),
        new MiniCssExtractPlugin()
    ],

    module: {
        rules: [
            {
                test: /\.html$/,
                use: [
                    "html-loader"
                ]
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader"
                ]
            },
            {
                test: /\.js/,
                exclude: /node_modules/,
                use: [
                    "babel-loader"
                ]
            },
            {
                test: /\.(frag|vert|glsl)$/,
                use: [
                    {
                        loader: "glsl-shader-loader",
                        options: {
                            root: "../public/shaders"
                        }
                    }
                ]
            }
        ]
    }
}