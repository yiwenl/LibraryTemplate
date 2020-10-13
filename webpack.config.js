// webpack.config.js
const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const pathOutput = path.resolve(__dirname, "dist");
const pathBuild = path.resolve(__dirname, "lib");
const pathNodeModules = path.resolve(__dirname, "node_modules");
const env = process.env.NODE_ENV;
const isProd = env === "production";

console.log("Environment isProd :", isProd);

const plugins = [new webpack.HotModuleReplacementPlugin()];

if (isProd) {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      compress: {
        drop_debugger: true,
        drop_console: true,
        screw_ie8: true,
      },
      comments: false,
      mangle: false,
    })
  );
  plugins.push(new ExtractTextPlugin("assets/css/main.css"));
}

const entry = isProd
  ? { app: "./src/js/WebGLAnimation.js" }
  : { app: "./src/js/app.js", debug: "./src/js/debug/debug.js" };
const output = isProd
  ? {
      path: pathBuild,
      filename: "./gl.js",
      library: "WebGLAnimation",
      libraryTarget: "umd",
      umdNamedDefine: true,
    }
  : {
      filename: "assets/js/[name].js",
      path: pathOutput,
    };

const devtool = isProd ? "source-map" : "inline-source-map";

const config = {
  entry,
  devtool,
  devServer: {
    host: "0.0.0.0",
    contentBase: "./dist",
    hot: true,
    disableHostCheck: true,
  },
  plugins,
  output,
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        query: {
          presets: ["env"],
        },
        // exclude: /node_modules(?!\/webpack-dev-server)/,
        // exclude: pathNodeModules
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
        exclude: pathNodeModules,
      },
      {
        test: /\.scss$/,
        use: isProd
          ? ExtractTextPlugin.extract({
              fallback: "style-loader",
              use: ["css-loader?url=false", "sass-loader"],
            })
          : ["style-loader", "css-loader?url=false", "sass-loader"],
        exclude: pathNodeModules,
      },
      {
        test: /\.(glsl|vert|frag)$/,
        use: ["raw-loader", "glslify-loader"],
        exclude: pathNodeModules,
      },
    ],
  },
  resolve: {
    alias: {
      js: path.resolve(__dirname, "src/js"),
      views: path.resolve(__dirname, "src/js/views"),
      scenes: path.resolve(__dirname, "src/js/scenes"),
      objects: path.resolve(__dirname, "src/js/objects"),
      libs: path.resolve(__dirname, "src/js/libs"),
      shaders: path.resolve(__dirname, "src/shaders"),
    },
  },
};

module.exports = config;
