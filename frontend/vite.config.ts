import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { viteStaticCopy } from "vite-plugin-static-copy";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: "assets/images/*",
          dest: "assets/images",
        },
      ],
    }),
    {
      name: "inject-config-js",
      transformIndexHtml(html) {
        return html
          .replace('<script type="module" src="/config.js"></script>', "")
          .replace("</title>", '</title>\n<script type="module" src="/home-cookbook/config.js"></script>');
      },
    },
  ],
  base: "/home-cookbook/",
  resolve: {
    alias: {
      pages: "/src/pages",
      api: "/src/api",
      db: "/src/db",
      components: "/src/components",
      models: "/src/models",
      hooks: "/src/hooks",
      utilities: "/src/utilities",
      mapper: "/src/mapper",
      storage: "/src/storage",
    },
  },
});
