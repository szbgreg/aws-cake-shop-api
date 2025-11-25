const { query } = require("../modules/db");

class MessagesController {
  async getAllMessages(req, res) {
    try {
      const page = parseInt(req.query.oldal) || 1;
      const limit = 15;
      const offset = (page - 1) * limit;

      const totalResult = await query(`SELECT COUNT(*) AS count FROM messages`);
      const total = totalResult[0].count;
      const totalPages = Math.ceil(total / limit);

      const messages = await query(
        `SELECT * FROM messages ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`
      );

      res.json({
        messages: messages,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalItems: total,
          itemsPerPage: limit,
        },
      });
    } catch (error) {
      res.status(500).json({
        error: "Hiba az üzenetek lekérdezésekor",
        message: error.message,
      });
    }
  }

  async createMessage(req, res) {
    try {
      const { name, email, message } = req.body;
      const errors = {};

      if (!name || name.trim().length < 2) {
        errors.name = "A név legalább 2 karakter kell legyen!";
      }

      if (!email || !email.includes("@")) {
        errors.email = "Érvényes e-mail címet adj meg!";
      }

      if (!message || message.trim().length < 10) {
        errors.message = "Az üzenet legalább 10 karakter kell legyen!";
      }

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({
          error: "Validációs hibák",
          errors: errors,
        });
      }

      const mysqlQuery = `INSERT INTO messages (sender_name, sender_email, content, created_at, updated_at) VALUES ('${name}', '${email}', '${message}', NOW(), NOW())`;

      const result = await query(mysqlQuery);

      res.status(201).json({
        message: "Köszönjük az üzeneted! Hamarosan válaszolunk.",
        id: result.insertId,
      });
    } catch (error) {
      console.error("Hiba az üzenet mentésekor:", error);
      res.status(500).json({
        error: "Hiba történt az üzenet mentésekor!",
        message: error.message,
      });
    }
  }
}

module.exports = new MessagesController();
