import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import UnoCSS from "unocss/vite";
import path from "path";
import inject from "@rollup/plugin-inject";
// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [
    vue(),
    UnoCSS(),
    //引入SVG图标素材文件
    createSvgIconsPlugin({
      iconDirs: [path.resolve(__dirname, "src/icons/svg")],
    }),
    inject({
      "window.Quill": ["@vueup/vue-quill", "Quill"],
      Quill: ["@vueup/vue-quill", "Quill"],
    })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        //自定义的主题文件
        additionalData: `@use "@/style/element/index.scss" as *;`,
      },
    },
  },
  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  // prevent vite from obscuring rust errors
  clearScreen: false,
  // tauri expects a fixed port, fail if that port is not available
  server: {
    host: "0.0.0.0",
    port: 1420,
    strictPort: true,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:7001",
        changeOrigin: true,
      },
    },
  },
  // to make use of `TAURI_DEBUG` and other env variables
  // https://tauri.studio/v1/api/config#buildconfig.beforedevcommand
  envPrefix: ["VITE_", "TAURI_"],
  build: {
    rollupOptions: {
      input: {
        index: "./index.html",
        home: "./pages/home.html",
      },
      output: {
        // 自定义输出目录结构（默认为 dist）
        dir: 'dist'
      }
    },
    // Tauri supports es2021
    target: "esnext",
    // don't minify for debug builds
    minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
    // produce sourcemaps for debug builds
    sourcemap: !!process.env.TAURI_DEBUG,
  },
}));
