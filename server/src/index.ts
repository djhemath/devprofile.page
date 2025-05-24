import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRouter from './auth/auth.router';
import { connectMongo } from './config/mongo';
import { authNZ } from './middlewares/authnz.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, '../public')));
app.use(cookieParser());

app.use('/oauth', authRouter);

if (process.env.NODE_ENV === 'local') {
  app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
  }));
}

// Ping - basic health check
app.get('/api/ping', (_, res) => {
  res.json({ message: 'pong' });
});

app.get('/api/session', authNZ(['user'], false), (req, res) => {
  res.json({
    user: req.body.payload,
  });
});

// Serve frontend
app.get('/{*splat}', (_, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

connectMongo().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
  });
}).catch(err => {
  console.log('Mongo DB not connected', err);
});
