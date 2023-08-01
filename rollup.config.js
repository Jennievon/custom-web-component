import { terser } from "rollup-plugin-terser";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";

export default {
  input: "index.js",
  output: {
    file: "dist/index.min.js",
    format: "umd",
    name: "TaskScheduler",
    sourcemap: true,
  },
  plugins: [resolve(), commonjs(), terser()],
};
