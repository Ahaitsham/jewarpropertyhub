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

const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://jewarpropertyhub.vercel.app',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// CORS
app.use(cors(corsOptions));

// Preflight
app.options('*', cors(corsOptions));

app.use(helmet());

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// General rate limit
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
});

app.use('/api', generalLimiter);

// Login rate limit
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
});

app.use('/api/auth/login', loginLimiter);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyPublicRoutes);
app.use('/api/admin/properties', propertyAdminRoutes);
app.use('/api/admin/owners', ownerRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/property-submissions', submissionRoutes);
app.use('/api/admin/dashboard', dashboardRoutes);
app.use('/api/owner', ownerPortalRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;