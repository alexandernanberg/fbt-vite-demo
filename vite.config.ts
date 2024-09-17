import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fbtEnumManifest from "./.enum_manifest.json";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          [
            "babel-plugin-fbt",
            {
              fbtCommonPath: "./common_strings.json",
              fbtEnumManifest,
              // fbtEnumPath: path.join(__dirname, ".enum_manifest.json"),
            },
          ],
          "babel-plugin-fbt-runtime",
        ],
      },
    }),
  ],
});
