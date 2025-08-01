import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({
  plugins: [
    react({
      // Ensure React is properly imported for production builds
      jsxImportSource: "react",
      babel: {
        // Skip Babel transforms for modern browsers
        parserOpts: {
          sourceType: "module",
          allowAwaitOutsideFunction: true,
        },
        generatorOpts: {
          decoratorsBeforeExport: true,
        },
      },
    }),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    sourcemap: true,
    // Target modern browsers that support ES2022
    target: "es2022",
    // Optimize chunk size
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // More aggressive code splitting
          if (id.includes('node_modules')) {
            if (id.includes('react-dom')) return 'react-dom';
            if (id.includes('react') && !id.includes('react-dom')) return 'react-core';
            if (id.includes('@radix-ui')) return 'radix-ui';
            if (id.includes('framer-motion')) return 'framer-motion';
            if (id.includes('react-hook-form')) return 'react-hook-form';
            if (id.includes('zod')) return 'zod';
            if (id.includes('react-icons')) return 'react-icons';
            if (id.includes('@tanstack')) return 'tanstack';
            if (id.includes('wouter')) return 'router';
            if (id.includes('date-fns')) return 'date-fns';
            if (id.includes('recharts')) return 'recharts';
            if (id.includes('lucide-react')) return 'lucide-icons';
            return 'vendor';
          }
        },
        // Optimize chunk size
        maxParallelFileOps: 5,
        experimentalMinChunkSize: 10000,
      },
    },
    // Minify for modern syntax
    minify: "terser",
    terserOptions: {
      ecma: 2022,
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ["console.log", "console.info"],
        passes: 2,
      },
      format: {
        comments: false,
      },
    },
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
  // Skip polyfills for modern browsers
  optimizeDeps: {
    esbuildOptions: {
      target: "es2022",
    },
  },
});
