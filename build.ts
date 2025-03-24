import { glob } from "glob";
import { build } from "bun";

const files = await glob("./src/**/*.ts");

await build({
  entrypoints: files,
  outdir: "./dist",
});

console.log("Build completed!");
