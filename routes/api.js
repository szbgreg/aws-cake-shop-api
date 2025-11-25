var express = require('express');
var router = express.Router();

const cakesController = require('../controllers/cakesController');
const messagesController = require('../controllers/messagesController');

// Cakes endpoints
router.get('/cakes', cakesController.getAllCakes);

// Messages endpoints  
router.get('/messages', messagesController.getAllMessages);
router.post('/messages', messagesController.createMessage)

/* router.get('/cakes/:id', cakesController.getCakeById);
router.post('/cakes', cakesController.createCake);
router.put('/cakes/:id', cakesController.updateCake);
router.delete('/cakes/:id', cakesController.deleteCake); */

module.exports = router;