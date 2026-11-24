import { pool } from '../config/database.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const COLUMNAS = 'id_estudiante, documento, nombres, apellidos, correo, fecha_registro';

function leerId(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1 || id > 2147483647) {
    res.status(400).json({ error: 'El identificador debe ser un entero positivo.' });
    return null;
  }
  return id;
}

function validar(body = {}) {
  const limpio = {
    documento: String(body.documento ?? '').trim(),
    nombres:   String(body.nombres ?? '').trim(),
    apellidos: String(body.apellidos ?? '').trim(),
    correo:    String(body.correo ?? '').trim().toLowerCase(),
  };
  const campos = {};
  for (const [campo, max] of [['documento', 30], ['nombres', 100], ['apellidos', 100], ['correo', 150]]) {
    if (!limpio[campo]) campos[campo] = 'Este campo es obligatorio.';
    else if (limpio[campo].length > max) campos[campo] = `Máximo ${max} caracteres.`;
  }
  if (!campos.correo && !EMAIL_RE.test(limpio.correo)) campos.correo = 'El formato del correo no es válido.';
  return { limpio, campos };
}

export async function listar(req, res) {
  const { rows } = await pool.query(`SELECT ${COLUMNAS} FROM estudiantes ORDER BY apellidos, nombres`);
  res.json(rows);
}

export async function obtener(req, res) {
  const id = leerId(req, res); if (id === null) return;
  const { rows } = await pool.query(`SELECT ${COLUMNAS} FROM estudiantes WHERE id_estudiante = $1`, [id]);
  if (rows.length === 0) return res.status(404).json({ error: 'Estudiante no encontrado.' });
  res.json(rows[0]);
}

export async function crear(req, res) {
  const { limpio, campos } = validar(req.body);
  if (Object.keys(campos).length) return res.status(400).json({ error: 'Datos inválidos.', campos });
  const { rows } = await pool.query(
    `INSERT INTO estudiantes (documento, nombres, apellidos, correo)
     VALUES ($1, $2, $3, $4) RETURNING ${COLUMNAS}`,
    [limpio.documento, limpio.nombres, limpio.apellidos, limpio.correo]
  );
  res.status(201).json(rows[0]);
}

export async function actualizar(req, res) {
  const id = leerId(req, res); if (id === null) return;
  const { limpio, campos } = validar(req.body);
  if (Object.keys(campos).length) return res.status(400).json({ error: 'Datos inválidos.', campos });
  const { rows } = await pool.query(
    `UPDATE estudiantes SET documento = $1, nombres = $2, apellidos = $3, correo = $4
     WHERE id_estudiante = $5 RETURNING ${COLUMNAS}`,
    [limpio.documento, limpio.nombres, limpio.apellidos, limpio.correo, id]
  );
  if (rows.length === 0) return res.status(404).json({ error: 'Estudiante no encontrado.' });
  res.json(rows[0]);
}

export async function eliminar(req, res) {
  const id = leerId(req, res); if (id === null) return;
  const { rowCount } = await pool.query('DELETE FROM estudiantes WHERE id_estudiante = $1', [id]);
  if (rowCount === 0) return res.status(404).json({ error: 'Estudiante no encontrado.' });
  res.status(204).end();
}

