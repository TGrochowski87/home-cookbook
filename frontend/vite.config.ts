import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: "inject-config-js",
      transformIndexHtml(html) {
        return html
          .replace('<script type="module" src="/config.js"></script>', "")
          .replace("</title>", '</title>\n<script type="module" src="/config.js"></script>');
      },
    },
  ],
  resolve: {
    alias: {
      pages: "/src/pages",
      assets: "/src/assets",
      api: "/src/api",
      components: "/src/components",
      models: "/src/models",
      hooks: "/src/hooks",
      utilities: "/src/utilities",
      mapper: "/src/mapper",
      storage: "/src/storage",
    },
  },
});
