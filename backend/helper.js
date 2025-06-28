const urlDatabase = {};

function generateShortCode() {
  return Math.random().toString(36).substring(2, 8);
}

function isValidShortCode(code) {
  return /^[a-zA-Z0-9]{4,10}$/.test(code);
}

function createShortUrl({ url, validity = 30, shortCode }) {
  validity = Math.min(Number(validity) || 30, 30);

  
  if (shortCode && urlDatabase[shortCode]) {
    do {
      shortCode = generateShortCode();
    } while (urlDatabase[shortCode]);
  } else if (!shortCode) {
    do {
      shortCode = generateShortCode();
    } while (urlDatabase[shortCode]);
  }

  const createdAt = Date.now();
  const expiresAt = createdAt + validity * 60 * 1000;

  urlDatabase[shortCode] = {
    url,
    createdAt,
    expiresAt,
    clicks: 0,
    clickDetails: []
  };

  return {
    shortCode,
    shortLink: `http://localhost:3000/${shortCode}`,
    expiry: new Date(expiresAt).toISOString()
  };
}

function getShortUrl(shortCode) {
  return urlDatabase[shortCode];
}

function recordClick(shortCode, req) {
  const entry = urlDatabase[shortCode];
  if (entry) {
    entry.clicks += 1;
    entry.clickDetails.push({
      timestamp: new Date().toISOString(),
      referrer: req.get('referer') || req.get('referrer') || null,
      geo: req.ip
    });
  }
}

function getStats(shortCode) {
  const entry = urlDatabase[shortCode];
  if (!entry) return null;
  return {
    shortCode,
    originalUrl: entry.url,
    createdAt: new Date(entry.createdAt).toISOString(),
    expiry: new Date(entry.expiresAt).toISOString(),
    clicks: entry.clicks,
    clickDetails: entry.clickDetails
  };
}

module.exports = {
  generateShortCode,
  isValidShortCode,
  createShortUrl,
  getShortUrl,
  recordClick,
  getStats
};