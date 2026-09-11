// Vercel serverless entrypoint. Vercel's Node runtime can invoke an
// exported Express app directly as a request handler — no app.listen()
// needed here (that only happens in src/server.js for local dev).
require('dotenv').config();
const app = require('../src/app');

module.exports = app;
