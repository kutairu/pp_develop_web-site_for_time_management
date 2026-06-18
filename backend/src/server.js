const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const statsRoutes = require('./routes/statsRoutes');

const app = express();

app.use(helmet());
app.use(cors({
  // добавляем ваш GitHub Pages в разрешенные адреса!
  origin: [
    'http://localhost:3000', 
    'https://kutairu.github.io'
  ], 
  credentials: true
}));

app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 500, // ограничение: 500 запросов с одного айпишника за 15 минут
  message: { error: 'Слишком много запросов с вашего IP, пожалуйста, подождите 15 минут.' }
});

app.use('/api', limiter);

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/stats', statsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Бэкенд запущен на порту ${PORT}`));