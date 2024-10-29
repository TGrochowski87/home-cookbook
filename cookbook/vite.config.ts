import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
