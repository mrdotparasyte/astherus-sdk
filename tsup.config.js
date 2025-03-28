import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  dts: true,
  entry: ["src/index.ts", "src/utils.types.ts", "src/zodios.types.ts"],
  outDir: "dist",
  format: ["cjs", "esm"],
  minify: true,
  treeshake: true,
  tsconfig: "tsconfig.build.json",
  splitting: true,
  sourcemap: false,
});