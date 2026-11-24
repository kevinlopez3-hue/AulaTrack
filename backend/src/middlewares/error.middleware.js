export function manejarErrores(err, req, res, next) {   // los 4 parámetros son obligatorios
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'El cuerpo no es un JSON válido.' });
  }
  if (err.code === '23505') {                           // violación de UNIQUE
    const campo = err.constraint?.includes('documento') ? 'documento'
                : err.constraint?.includes('correo') ? 'correo' : null;
    return res.status(409).json({
      error: campo ? `Ya existe un estudiante con ese ${campo}.` : 'Registro duplicado.',
      campos: campo ? { [campo]: `Este ${campo} ya está registrado.` } : undefined,
    });
  }
  if (err.code === '23514' || err.code === '23502') {   // CHECK / NOT NULL
    return res.status(400).json({ error: 'Los datos no cumplen las restricciones.' });
  }
  console.error(err);                                    // el detalle va al log, no al cliente
  res.status(500).json({ error: 'Error interno del servidor.' });
}