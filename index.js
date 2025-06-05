const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

function getTimestamp() {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  const hours = String((now.getUTCHours() + 3) % 24).padStart(2, '0');
  const minutes = String(now.getUTCMinutes()).padStart(2, '0');
  const seconds = String(now.getUTCSeconds()).padStart(2, '0');
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

function toBase64(str) {
  return Buffer.from(str).toString('base64');
}

app.post('/generate-password', (req, res) => {
  const { businessShortCode, passKey } = req.body;

  if (!businessShortCode || !passKey) {
    return res.status(400).json({ error: 'Missing businessShortCode or passKey' });
  }

  const timestamp = getTimestamp();
  const password = toBase64(businessShortCode + passKey + timestamp);

  res.json({ timestamp, password });
});

app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});
