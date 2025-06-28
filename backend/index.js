const express = require('express');
const Log = require('./LoggingMiddleware/logger');
const {
  createShortUrl,
  getShortUrl,
  recordClick,
  getStats,
  isValidShortCode
} = require('./helper');

const app = express();
const port = process.env.PORT || 3000;
const HOST = `http://localhost:${port}`;

app.use(express.json());

app.post('/shorturls', async (req, res) => {
  try {
    const { url, validity, shortCode } = req.body;
    if (!url) {
      Log("backend", "error", "handler", "Missing URL in request");
      return res.status(400).json({ error: "Missing URL in request" });
    }

    let code = shortCode;
    if (code && !isValidShortCode(code)) {
      Log("backend", "error", "handler", "Invalid shortcode format");
      return res.status(400).json({ error: "Invalid shortcode format" });
    }

    const result = createShortUrl({ url, validity, shortCode: code });

    Log("backend", "info", "handler", `Short URL created: ${result.shortCode}`);

    res.status(201).json({
      shortLink: result.shortLink,
      expiry: result.expiry
    });
  } catch (err) {
    Log("backend", "error", "handler", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get('/:shortCode', (req, res) => {
  try {
    const { shortCode } = req.params;
    const entry = getShortUrl(shortCode);
    if (!entry) {
      Log("backend", "error", "handler", "Shortcode not found");
      return res.status(404).json({ error: "Shortcode not found" });
    }
    if (Date.now() > entry.expiresAt) {
      Log("backend", "error", "handler", "Shortcode expired");
      return res.status(410).json({ error: "Shortcode expired" });
    }
    recordClick(shortCode, req);
    Log("backend", "info", "handler", `Redirected: ${shortCode}`);
    res.redirect(entry.url);
  } catch (err) {
    Log("backend", "error", "handler", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get('/shorturls/:shortCode', (req, res) => {
  try {
    const { shortCode } = req.params;
    const stats = getStats(shortCode);
    if (!stats) {
      Log("backend", "error", "handler", "Shortcode not found");
      return res.status(404).json({ error: "Short URL not found" });
    }
    Log("backend", "info", "handler", `Stats retrieved: ${shortCode}`);
    res.json(stats);
  } catch (err) {
    Log("backend", "error", "handler", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get('/', (req, res) => {
  res.send('API is working');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});