import { defineConfig } from "vite";
import rakkas from "rakkasjs/vite-plugin";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig((env) => ({
  plugins: [
    tsconfigPaths(),
    rakkas(),
    // HACK
    // This plugin is a workaround for a Rakkas bug that prevents
    // user entry points. Normally just specifying build.rollupOptions.input
    // would be enough.
    env.ssrBuild && {
      name: "override-build",
      apply: "build",
      enforce: "post",
      config(config, env) {
        env.ssrBuild;
      },
      configResolved(config) {
        // Forcibly add this entry so we can access entry-node by name.
        // otherwise, rollup will give it a hashed name.
        (config.build.rollupOptions.input as any)["entry-node"] =
          "src/entry-node.ts";
      },
    },
  ],
}));
