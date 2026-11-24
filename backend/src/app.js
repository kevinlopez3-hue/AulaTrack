import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import estudiantesRoutes from './routes/estudiantes.routes.js';
import { requireAuth } from './middlewares/auth.middleware.js';
import { manejarErrores } from './middlewares/error.middleware.js';

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN }));   // 1º: responde el preflight OPTIONS
app.use(express.json());                              // 2º: convierte el cuerpo JSON en req.body

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));
app.use('/api/auth', authRoutes);                                // pública
app.use('/api/estudiantes', requireAuth, estudiantesRoutes);     // protegida

app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada.' }));
app.use(manejarErrores);                                         // siempre al final

export default app;