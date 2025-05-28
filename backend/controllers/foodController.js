// backend/controllers/foodController.js

const db = require('../db');

// -------------------- DONORS ---------------------
exports.getDonors = (req, res) => {
    db.query('SELECT * FROM donors', (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
};

exports.addDonor = (req, res) => {
    const { name, contact } = req.body;
    db.query(
        'INSERT INTO donors (name, contact) VALUES (?, ?)',
        [name, contact],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Donor added!', donorId: result.insertId });
        }
    );
};

// -------------------- FOOD ITEMS ---------------------
exports.getFoodItems = (req, res) => {
    db.query(
        `SELECT food_items.*, donors.name AS donor_name FROM food_items 
        JOIN donors ON food_items.donor_id = donors.id`,
        (err, results) => {
            if (err) return res.status(500).json({ error: err });
            res.json(results);
        }
    );
};

exports.addFoodItem = (req, res) => {
    const { donor_id, food_name, quantity, expiry_date } = req.body;
    db.query(
        'INSERT INTO food_items (donor_id, food_name, quantity, expiry_date) VALUES (?, ?, ?, ?)',
        [donor_id, food_name, quantity, expiry_date],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Food item added!', foodId: result.insertId });
        }
    );
};

// -------------------- PICKUPS ---------------------
exports.getPickups = (req, res) => {
    db.query(
        `SELECT pickups.*, food_items.food_name 
         FROM pickups 
         JOIN food_items ON pickups.food_id = food_items.id`,
        (err, results) => {
            if (err) return res.status(500).json({ error: err });
            res.json(results);
        }
    );
};

exports.addPickup = (req, res) => {
    const { food_id, pickup_person, pickup_time } = req.body;
    db.query(
        'INSERT INTO pickups (food_id, pickup_person, pickup_time) VALUES (?, ?, ?)',
        [food_id, pickup_person, pickup_time],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Pickup recorded!', pickupId: result.insertId });
        }
    );
};
