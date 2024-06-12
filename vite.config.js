import suidPlugin from '@suid/vite-plugin';
import child from 'child_process';
import path from 'path';
import fs from 'fs';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

const commitHash = child.execSync('git rev-parse --short HEAD').toString();

// Paths to Certificate Files
const keyPath = path.resolve(__dirname, 'key.pem');
const certPath = path.resolve(__dirname, 'cert.pem');

// Check if the certificate files exist, if not, set https to false
const httpsOptions = fs.existsSync(keyPath) && fs.existsSync(certPath)
? {
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath)

}
: false;


export default defineConfig({
  plugins: [suidPlugin(), solidPlugin()],

  server: {
    open: true,
    https: httpsOptions,
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
