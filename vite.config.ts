import tailwindcss from "@tailwindcss/vite";
import laravel from "laravel-vite-plugin";
import { resolve } from "node:path";
import { defineConfig } from "vite";
function stripUseClientDirective(): import("vite").Plugin {
  return {
    name: "strip-use-client-directive",
    enforce: "pre" as const,
    transform(code, id) {
      if (
        id.endsWith(".js") ||
        id.endsWith(".ts") ||
        id.endsWith(".tsx") ||
        id.endsWith(".mjs")
      ) {
        if (code.includes("\"use client\"") || code.includes("'use client'")) {
          return code.replace(/['"]use client['"];?\s*/g, "");
        }
      }
    },
  };
}
export default defineConfig({
    plugins: [
        laravel({
            input: ["resources/css/app.css", "resources/css/dark-mode.css", "resources/js/app.tsx"],
            ssr: "resources/js/ssr.tsx",
            refresh: true,
        }),
        stripUseClientDirective(),
        tailwindcss(),
    ],
    server: {
        host: "localhost",
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
            "Access-Control-Allow-Headers": "*",
        },
        watch: {
            ignored: ["**/vendor/**", "**/node_modules/**"]
        }
    },
    esbuild: {
        jsx: "automatic",
        jsxImportSource: "react",
    },
    resolve: {
        alias: {
            "ziggy-js": resolve(__dirname, "vendor/tightenco/ziggy"),
        },
    },
    build: {
        chunkSizeWarningLimit: 500,
        rollupOptions: {
            output: {
                manualChunks: {
                    'vendor-react': ['react', 'react-dom'],
                    'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select', '@radix-ui/react-tabs', '@radix-ui/react-tooltip'],
                    'vendor-charts': ['recharts'],
                    'vendor-utils': ['lodash', 'date-fns', 'clsx'],
                },
            },
        },
    }
});
