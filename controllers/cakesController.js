const { query } = require("../modules/db");

class CakesController {
  async getAllCakes(req, res) {
    try {
      const page = parseInt(req.query.oldal) || 1;
      const limit = 15;
      const offset = (page - 1) * limit;

      // Összes süti lekérdezése a lapozáshoz
      const totalResult = await query(`SELECT COUNT(*) AS count FROM suti`);
      const total = totalResult[0].count;
      const totalPages = Math.ceil(total / limit);

      // 1. Sütik lekérdezése
      const sutik = await query(
        `SELECT * FROM suti ORDER BY id LIMIT ${limit} OFFSET ${offset}`
      );

      for (let suti of sutik) {
        // Tartalmak
        suti.tartalmak = await query(
          `SELECT * FROM tartalom WHERE sutiid = '${suti.id}'`
        );

        // Árak
        suti.arak = await query(
          `SELECT * FROM ar WHERE sutiid = '${suti.id}' ORDER BY ertek`
        );
      }

      res.json({
        sutik: sutik,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalItems: total,
          itemsPerPage: limit,
        },
      });
    } catch (error) {
      res.status(500).json({
        error: "Hiba a sütik lekérdezésekor",
        message: error.message,
      });
    }
  }
}

module.exports = new CakesController();
