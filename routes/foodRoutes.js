// backend/routes/foodRoutes.js

const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');

// Donor APIs
router.get('/donors', foodController.getDonors);
router.post('/donors', foodController.addDonor);

// Food Item APIs
router.get('/food', foodController.getFoodItems);
router.post('/food', foodController.addFoodItem);

// Pickup APIs
router.get('/pickups', foodController.getPickups);
router.post('/pickups', foodController.addPickup);

module.exports = router;
