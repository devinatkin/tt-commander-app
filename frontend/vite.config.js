import suidPlugin from '@suid/vite-plugin';
import path from 'path';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import { execSync } from 'child_process';


let commitHash = 'N/A';
try {
  const gitRoot = path.resolve(__dirname, '..');
  commitHash = execSync('git rev-parse --short HEAD', { cwd: gitRoot }).toString().trim();
} catch (error) {
  console.warn('Not a git repository, using default commit hash.');
}

export default defineConfig({
  plugins: [suidPlugin(), solidPlugin()],
  base: process.env.BASE_URL || '/',

  server: {
    open: false,
    port: process.env.PORT || 5173,
    proxy: {
      '/api': {
        target: 'http://backend:3000',
        changeOrigin: true,
      },
    },
  },

  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
    },
  },

  define: {
    __COMMIT_HASH__: JSON.stringify(commitHash.trim()),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
});
