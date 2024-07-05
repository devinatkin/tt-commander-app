// Import express using ES module syntax
import express from 'express';
import cors from 'cors';
import https from 'https';
import fs from 'fs';

import { Storage } from '@google-cloud/storage';
const storage = new Storage({
  projectId: 'atkin-1',
});

const app = express();

app.use(
  cors({
    origin: ['https://localhost:5173', 'https://136.159.102.228:5173'],
    credentials: true,
  }),
);

app.use(express.json());

// Define a simple route to check the server setup
app.get('/', (_req, res) => {
  res.send('Commander App Backend is running');
});

app.post('/store', (req, res) => {
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

// SSL certificate paths
const privateKeyPath = 'key.pem'; // Update this path
const certificatePath = 'cert.pem'; // Update this path

// Reading the SSL certificate and private key
const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
const certificate = fs.readFileSync(certificatePath, 'utf8');

const credentials = { key: privateKey, cert: certificate };

// Creating HTTPS server
const httpsServer = https.createServer(credentials, app);

// Define HTTPS port
const httpsPort = 3000; // You can use another port if 443 is not available

// Start the HTTPS server
httpsServer.listen(httpsPort, () => {
  console.log(`Server is listening at https://localhost:${httpsPort}/`);
});
