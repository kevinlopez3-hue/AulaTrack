import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { pool } from '../config/database.js';

const [correo, password, nombre = 'Administrador'] = process.argv.slice(2);
if (!correo || !password) {
  console.error('Uso: node src/scripts/crear-usuario.js correo password [nombre]');
  process.exit(1);
}
const hash = await bcrypt.hash(password, 10);
await pool.query(
  'INSERT INTO usuarios (correo, password_hash, nombre) VALUES ($1, $2, $3) ON CONFLICT (correo) DO NOTHING',
  [correo.trim().toLowerCase(), hash, nombre]
);
console.log('Usuario listo:', correo);
await pool.end();