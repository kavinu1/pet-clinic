const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const { errorHandler, notFoundHandler } = require('./middleware/errors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const petRoutes = require('./routes/petRoutes');

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : true,
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use(authRoutes);
app.use(userRoutes);
app.use(petRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;

