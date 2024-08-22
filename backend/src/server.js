// Import express using ES module syntax
import express from 'express';
import cors from 'cors';
import https from 'https';
import http from 'http';
import fs from 'fs';
import { Storage } from '@google-cloud/storage';
import { fetchLatestUF2Artifact } from './utils/github.js';

// Initialize Google Cloud Storage
const storage = new Storage({
  projectId: 'atkin-1',
});

const app = express();

app.use(
  cors({
    origin: ['https://localhost:5173'],
    credentials: true,
  }),
);

app.use(express.json());

// Define a simple route to check the server setup
app.get('/api', (_req, res) => {
  res.send('Commander App Backend is running');
});

// Define a POST route to store data in Google Cloud Storage
app.post('/api/store', (req, res) => {
  const data = req.body;
  console.log('POST received from client');

  const bucketName = 'commander-app-bucket';
  const filename = `data_${Date.now()}.json`;

  const file = storage.bucket(bucketName).file(filename);

  file.save(JSON.stringify(data), (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error saving data');
    } else {
      console.log(`Data saved to ${filename}`);
      res.status(200).send('Data saved');
    }
  });
});

// Define a GET route to retrieve the latest UF2 file from Github Artifacts
app.get('/api/latestUF2', async (_req, res) => {
  try {
    const filepath = await fetchLatestUF2Artifact(process.env.FIRMWARE_REPO);
    
    if (filepath) {
      res.setHeader('Content-Disposition', `attachment; filename="latest_firmware.uf2"`);
      res.sendFile(filepath);
    } else {
      res.status(404).send('UF2 File not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).sendFile('error.txt');
  }
});

// SSL certificate paths
const privateKeyPath = 'key.pem'; // Update this path
const certificatePath = 'cert.pem'; // Update this path

let httpsServer;
const httpsPort = 3000;

try {
  // Reading the SSL certificate and private key
  const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
  const certificate = fs.readFileSync(certificatePath, 'utf8');
  const credentials = { key: privateKey, cert: certificate };

  // Creating HTTPS server
  httpsServer = https.createServer(credentials, app);

  // Start the HTTPS server
  httpsServer.listen(httpsPort, () => {
    console.log(`HTTPS Server is listening at https://localhost:${httpsPort}/`);
  });
} catch (error) {
  console.error('SSL certificates not found or could not be read. Falling back to HTTP.');

  // Define HTTP port
  const httpPort = 3000; // Change this port if needed

  // Creating HTTP server
  const httpServer = http.createServer(app);

  // Start the HTTP server
  httpServer.listen(httpPort, () => {
    console.log(`HTTP Server is listening at http://localhost:${httpPort}/`);
  });
}
