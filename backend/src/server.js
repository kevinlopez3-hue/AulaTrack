import 'dotenv/config';
import app from './app.js';
import { pool } from './config/database.js';

if (!process.env.JWT_SECRET) {
  console.error('Falta JWT_SECRET en el .env');
  process.exit(1);
}
const PORT = process.env.PORT || 3000;

try {
  await pool.query('SELECT 1');
  console.log('Conectado a Supabase (PostgreSQL)');
} catch (e) {
  console.error('No se pudo conectar a la base de datos:', e.message);
  process.exit(1);
}
app.listen(PORT, () => console.log(`API en http://localhost:${PORT}`));