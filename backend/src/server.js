// Import express using ES module syntax
import express from 'express';
import cors from 'cors';
import https from 'https';
import http from 'http';
import fs from 'fs';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { fetchLatestUF2Artifact } from './utils/github.js';

// ---- S3 / Garage config from env ----
function requireEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required environment variable: ${name}`);
  return v;
}

const S3_ENDPOINT = requireEnv('S3_ENDPOINT');
const S3_REGION = process.env.S3_REGION || 'us-east-1';
const S3_ACCESS_KEY_ID = requireEnv('S3_ACCESS_KEY_ID');
const S3_SECRET_ACCESS_KEY = requireEnv('S3_SECRET_ACCESS_KEY');
const S3_BUCKET = requireEnv('S3_BUCKET');

const S3_FORCE_PATH_STYLE =
  (process.env.S3_FORCE_PATH_STYLE || 'true').toLowerCase() === 'true';

const S3_PREFIX = (process.env.S3_PREFIX || '').replace(/^\/+|\/+$/g, ''); // trim slashes

const s3 = new S3Client({
  region: S3_REGION,
  endpoint: S3_ENDPOINT,
  forcePathStyle: S3_FORCE_PATH_STYLE, // important for many self-hosted S3 implementations
  credentials: {
    accessKeyId: S3_ACCESS_KEY_ID,
    secretAccessKey: S3_SECRET_ACCESS_KEY,
  },
});

function makeObjectKey(filename) {
  return S3_PREFIX ? `${S3_PREFIX}/${filename}` : filename;
}

// ---- Express app ----
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

// Define a POST route to store data in an S3-compatible bucket (Garage)
app.post('/api/store', async (req, res) => {
  const data = req.body;
  console.log('POST received from client');

  const filename = `data_${Date.now()}.json`;
  const key = makeObjectKey(filename);

  try {
    const body = JSON.stringify(data);

    await s3.send(
      new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
        Body: body,
        ContentType: 'application/json; charset=utf-8',
      }),
    );

    console.log(`Data saved to s3://${S3_BUCKET}/${key}`);
    res.status(200).send('Data saved');
  } catch (err) {
    console.error('Error saving data to bucket:', err);
    res.status(500).send('Error saving data');
  }
});

// Define a GET route to retrieve the latest UF2 file from Github Artifacts
app.get('/api/latestUF2', async (_req, res) => {
  try {
    const filepath = await fetchLatestUF2Artifact(process.env.FIRMWARE_REPO);

    if (filepath) {
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="latest_firmware.uf2"',
      );
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
  console.error(
    'SSL certificates not found or could not be read. Falling back to HTTP.',
  );

  // Define HTTP port
  const httpPort = 3000; // Change this port if needed

  // Creating HTTP server
  const httpServer = http.createServer(app);

  // Start the HTTP server
  httpServer.listen(httpPort, () => {
    console.log(`HTTP Server is listening at http://localhost:${httpPort}/`);
  });
}