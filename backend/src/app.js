const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/authRoutes');
const propertyPublicRoutes = require('./routes/propertyPublicRoutes');
const propertyAdminRoutes = require('./routes/propertyAdminRoutes');
const ownerRoutes = require('./routes/ownerRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const ownerPortalRoutes = require('./routes/ownerPortalRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Generous general rate limit; tighten per-route later if needed (e.g. login)
const generalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 500 });
app.use('/api', generalLimiter);

const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });
app.use('/api/auth/login', loginLimiter);

// Health check — used by an external uptime/ping service to keep the
// Render free-tier instance from sleeping. See RENDER_KEEPALIVE.md.
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyPublicRoutes);
app.use('/api/admin/properties', propertyAdminRoutes);
app.use('/api/admin/owners', ownerRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/property-submissions', submissionRoutes);
app.use('/api/admin/dashboard', dashboardRoutes);
app.use('/api/owner', ownerPortalRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
