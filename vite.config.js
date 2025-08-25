import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/ia-logistics-web/",   // 仓库名，左右都要有斜杠
});
