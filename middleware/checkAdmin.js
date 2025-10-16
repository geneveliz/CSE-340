function checkAdmin(req, res, next) {
  // Verifica si el usuario está autenticado
  if (!req.account) {
    return res.status(401).redirect('/login'); // O lo que uses para login
  }

  // Verifica si el usuario es admin (ejemplo: account_type === 'admin')
  if (req.account.account_type !== 'admin') {
    return res.status(403).send('Access denied: Admins only');
  }

  // Si todo bien, pasa al siguiente middleware o ruta
  next();
}

module.exports = checkAdmin;
