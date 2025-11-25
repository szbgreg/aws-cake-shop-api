const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      error: 'Hozzáférés megtagadva',
      message: 'Token szükséges' 
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        error: 'Érvénytelen token',
        message: 'A token lejárt vagy hibás' 
      });
    }
    req.user = user; // Token adatok elérhetők lesznek req.user-ben
    next();
  });
};

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.isAdmin !== 1) {
    return res.status(403).json({ 
      error: 'Admin jogosultság szükséges',
      message: 'Csak adminok férhetnek hozzá ehhez az erőforráshoz' 
    });
  }
  next();
};

module.exports = { authenticateToken, requireAdmin };