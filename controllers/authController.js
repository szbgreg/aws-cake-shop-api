const { query } = require("../modules/db");
const { genPassword } = require("../modules/auth");

class AuthController {
  async login(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          error: "Hiányzó adatok",
          message: "Felhasználónév és jelszó megadása kötelező",
        });
      }

      const sql = `
        SELECT * FROM users
        WHERE username='${username}'
        AND hash='${genPassword(password)}'
      `;

      const users = await query(sql);

      if (users.length === 1) {
        const user = users[0];
        delete user.hash;

        res.json({
          message: "Sikeres bejelentkezés",
          user: user,
        });
      } else {
        res.status(401).json({
          error: "Hibás felhasználónév vagy jelszó!",
        });
      }
    } catch (error) {
      console.error("Bejelentkezési hiba:", error);
      res.status(500).json({
        error: "Hiba történt a bejelentkezés során!",
        message: error.message,
      });
    }
  }

  async register(req, res) {
    try {
      const { username, password, confirmPassword } = req.body;
      const errors = {};

      if (!username || username.trim().length < 3) {
        errors.username = "A felhasználónév legalább 3 karakter kell legyen!";
      }

      if (!password || password.length < 6) {
        errors.password = "A jelszó legalább 6 karakter kell legyen!";
      }

      if (password !== confirmPassword) {
        errors.confirmPassword = "A jelszavak nem egyeznek!";
      }

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({
          error: "Validációs hibák",
          errors: errors,
        });
      }

      const existingUser = await query(
        `SELECT * FROM users WHERE username = '${username}'`
      );

      if (existingUser.length > 0) {
        return res.status(409).json({
          error: "Ez a felhasználónév már foglalt!",
        });
      }

      // Új felhasználó létrehozása
      const sql = `INSERT INTO users (username, hash, isAdmin) 
                   VALUES ('${username}','${genPassword(password)}', 0)`;

      const result = await query(sql);

      res.status(201).json({
        message: "Sikeres regisztráció!",
        userId: result.insertId,
      });
    } catch (error) {
      console.error("Regisztrációs hiba:", error);
      res.status(500).json({
        error: "Hiba történt a regisztráció során!",
        message: error.message,
      });
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await query("SELECT id, username, isAdmin FROM users");

      res.json({
        users: users,
      });
    } catch (error) {
      res.status(500).json({
        error: "Hiba történt a felhasználók lekérése során!",
        message: error.message,
      });
    }
  }

  async updateUser(req, res) {
    try {
      const userId = req.params.id;
      const { isAdmin } = req.body;

      const mysqlQuery = `UPDATE users SET isAdmin = '${isAdmin}' WHERE id = '${userId}'`;
      await query(mysqlQuery);

      res.json({
        message: "A felhasználó sikeresen frissítve lett!",
      });
    } catch (error) {
      res.status(500).json({
        error: "Hiba történt a felhasználó frissítése során!",
        message: error.message,
      });
    }
  }
}

module.exports = new AuthController();
