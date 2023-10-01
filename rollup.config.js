import resolve from "@rollup/plugin-node-resolve";
import nodePolyfills from "rollup-plugin-polyfill-node";
import alias from "@rollup/plugin-alias";

import commonjs from "@rollup/plugin-commonjs";
import glslify from "rollup-plugin-glslify";
import { terser } from "rollup-plugin-terser";

import pkg from "./package.json";

const env = process.env.NODE_ENV;
const isDev = env === "development";

const plugins = [
  resolve({
    preferBuiltins: false,
  }),
  nodePolyfills(),
  commonjs(), // so Rollup can convert `ms` to an ES module
  glslify({
    include: ["src/**/*.vert", "src/**/*.frag", "src/**/*.glsl"],
    exclude: "node_modules/**",
    compress: true,
  }),
  alias({
    entries: [
      { find: "alfrid", replacement: "./alfrid" },
      // add more aliases as needed
    ],
  }),
];

if (!isDev) {
  plugins.push(terser());
}

export default [
  {
    input: "src/WebGLAnimation.js",
    output: {
      name: "WebGLAnimation",
      file: pkg.browser,
      format: "umd",
    },
    plugins,
  },
  {
    input: "src/WebGLAnimation.js",
    external: ["ms"],
    output: [{ file: pkg.module, format: "es" }],
    plugins,
  },
];
