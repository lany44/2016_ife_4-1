var webpack = require("webpack"),
    path = require("path"),
    rucksack = require("rucksack-css")

module.exports = {
    cache: true,
    devtool: "source-map", //or cheap-module-eval-source-map
    context: path.resolve(__dirname, 'src'),
    entry: {
        jsx: "./index.jsx",
        html: "./index.html"
    },
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "bundle.js",
    },
    module: {
        loaders: [
            {
                test: /\.html$/,
                loader: "file?name=[name].[ext]"
            },
            {
                test: /\.s?css$/,
                exclude: path.resolve(__dirname, "src/styles"),
                loaders: [
                    "style",
                    "css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]",
                    "sass?sourceMap",
                    "postcss"
                ]
            },
            {
                test: /\.s?css$/,
                include: path.resolve(__dirname, "src/styles"),
                loader: "style!css!sass?sourceMap"
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loaders: [
                    "react-hot",
                    "babel"
                ]
            },
        ],
    },
    resolve: {
        extensions: ["", ".js", ".jsx"],
        root: path.resolve(__dirname, "src"),
        modulesDirectories: ["node_modules"]
    },
    postcss: [
        rucksack({
            autoprefixer: true
        })
    ],
    plugins: [
        new webpack.DllReferencePlugin({
            context: path.resolve(__dirname, "src"),
            manifest: require('./build/dll/vendors-manifest.json')
        }),
        new webpack.DefinePlugin({
          "process.env": { NODE_ENV: JSON.stringify(process.env.NODE_ENV || "development") }
        })
    ],
    devServer: {
        contentBase: path.resolve(__dirname, "src"),
        hot: true
    }
}
