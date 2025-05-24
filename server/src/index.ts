import express from 'express';
import path from 'path';
import dotenv from 'dotenv';

import authRouter from './auth/auth.router';
import { connectMongo } from './config/mongo';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, '../public')));

app.use('/oauth', authRouter);

// Ping - basic health check
app.get('/api/ping', (_, res) => {
  res.json({ message: 'pong' });
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
