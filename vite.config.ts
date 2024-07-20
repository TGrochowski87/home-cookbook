import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import basicSsl from "@vitejs/plugin-basic-ssl";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), basicSsl({ name: "vite-dev-basic-ssl" })],
  resolve: {
    alias: {
      pages: "/src/pages",
      assets: "/src/assets",
      api: "/src/api",
      components: "/src/components",
      models: "/src/models",
      hooks: "/src/hooks",
    },
  },
});
