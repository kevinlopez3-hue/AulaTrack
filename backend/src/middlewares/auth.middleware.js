import jwt from 'jsonwebtoken';

export function requireAuth(req, res, next) {
  const [esquema, token] = (req.headers.authorization || '').split(' ');
  if (esquema !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Se requiere autenticación.' });
  }
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    next();
  } catch (err) {
    const msg = err.name === 'TokenExpiredError' ? 'La sesión expiró.' : 'Token inválido.';
    res.status(401).json({ error: msg });
  }
}