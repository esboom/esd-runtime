import { Options } from "tsup";

export const tsup: Options = {
    target: "esnext",
    entry: ["./src/index.ts"],
    format: ["cjs", "esm"],
    external: ["esbuild", "typescript", "chalk", "tmp", "react"],
    dts: true,
    clean: true,
    sourcemap: true,
    splitting: false,
    loader:{
        ".css":"css"
    },
    esbuildPlugins: [
    ],
};