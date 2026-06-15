const express = require('express');
const path    = require('path');
const cors    = require('cors');
const config  = require('./config');
const { initDatabase } = require('./models/database');

const app = express();

// ─── Middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Dynamic Sitemap for SEO ──────────────────────────────────
app.get('/sitemap.xml', (req, res) => {
  const host = req.headers.host;
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const baseUrl = `${protocol}://${host}`;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

  res.header('Content-Type', 'application/xml');
  res.send(xml);
});

// ─── Serve Static Files ─────────────────────────────────────
app.use(express.static(path.join(__dirname, '..', 'public')));

// ─── API Routes ─────────────────────────────────────────────
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/user',    require('./routes/user'));
app.use('/api/workout', require('./routes/workout'));
app.use('/api/diet',    require('./routes/diet'));
app.use('/api/admin',   require('./routes/admin'));

// ─── Health Check ───────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── SPA Fallback ───────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// ─── Bootstrap ──────────────────────────────────────────────
// Initialise the database before accepting requests.
// Works for both `npm run dev` (persistent process) and Vercel
// serverless (cold-start awaits before the first request is served).
async function bootstrap() {
  await initDatabase();

  // Only bind to a port when running as a regular Node process (not Vercel)
  if (process.env.VERCEL !== '1') {
    app.listen(config.PORT, () => {
      console.log(`
  ╔═══════════════════════════════════════════════════╗
  ║                                                   ║
  ║   🏋️  Fitness Planner Server Running              ║
  ║                                                   ║
  ║   → Local:  http://localhost:${config.PORT}              ║
  ║   → API:    http://localhost:${config.PORT}/api           ║
  ║                                                   ║
  ╚═══════════════════════════════════════════════════╝
      `);
    });
  }
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

module.exports = app;
