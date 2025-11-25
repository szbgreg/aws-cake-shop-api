var createError = require("http-errors");
var express = require("express");
var path = require("path");
var logger = require("morgan");
var cors = require("cors");

require("dotenv").config();

var apiRouter = require("./routes/api");
var authRouter = require("./routes/auth");

var app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));


app.use("/api/v1", apiRouter);
app.use("/api/v1/auth", authRouter);

app.use(function (req, res, next) {
  res.status(404).json({ error: "Endpoint not found" });
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500).json({ 
    error: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

module.exports = app;
