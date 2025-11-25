var express = require("express");
var router = express.Router();

const cakesController = require("../controllers/cakesController");
const messagesController = require("../controllers/messagesController");

// Health check
router.get("/health", (req, res) => {
  res.json({
    status: "API működik",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// Cakes endpoints
router.get("/cakes", cakesController.getAllCakes);

// Messages endpoints
router.get("/messages", messagesController.getAllMessages);
router.post("/messages", messagesController.createMessage);

module.exports = router;
