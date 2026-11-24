
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database.js';

const HASH_FALSO = bcrypt.hashSync('contraseña-inexistente', 10);

export async function login(req, res) {
  const correo = String(req.body?.correo ?? '').trim().toLowerCase();
  const password = String(req.body?.password ?? '');

  if (!correo || !password) {
    return res.status(400).json({ error: 'Correo y contraseña son obligatorios.' });
  }

  const { rows } = await pool.query(
    'SELECT id_usuario, correo, nombre, password_hash FROM usuarios WHERE correo = $1',
    [correo]
  );
  const usuario = rows[0];
  const coincide = await bcrypt.compare(password, usuario ? usuario.password_hash : HASH_FALSO);

  
  if (!usuario || !coincide) {
    return res.status(401).json({ error: 'Credenciales inválidas.' });
  }

  const token = jwt.sign(
    { sub: String(usuario.id_usuario), correo: usuario.correo },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h', algorithm: 'HS256' }
  );
  res.json({ token, usuario: { id_usuario: usuario.id_usuario, correo: usuario.correo, nombre: usuario.nombre } });
}