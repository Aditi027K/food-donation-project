# Food Donation & Pickup System

A web-based platform designed for efficient management of food donations and pickups. The system is built as a single page application (SPA) using Node.js, Express, and MySQL, with a clear emphasis on relational database design and operations.

---

## 📊 Project Overview

This application streamlines the process of food donation, storage, and distribution. It enables organizations and volunteers to:
- Register donors and their food contributions
- Track available food items with expiry management
- Record pickups, ensuring each food item is picked up only once
- Visually separate available and picked up items for operational clarity
- Display live dashboard statistics for easy monitoring

---

## 🛠️ Tech Stack

- **Frontend:** HTML, CSS, JavaScript (Single Page Application)
- **Backend:** Node.js, Express.js
- **Database:** MySQL

---

## 🗄️ Database Design (MySQL)

**Key Features:**
- All critical entities (Donors, Food Items, Pickups) are modeled as relational tables.
- Primary and Foreign Key constraints ensure data integrity.
- Cascade delete rules prevent orphan records.
- Efficient SQL queries enable real-time dashboard stats and filtering.

**Schema Overview:**

```sql
CREATE DATABASE food_donation_db;
USE food_donation_db;

CREATE TABLE donors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    contact VARCHAR(20) NOT NULL
);

CREATE TABLE food_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    donor_id INT NOT NULL,
    food_name VARCHAR(100) NOT NULL,
    quantity VARCHAR(50),
    expiry_date DATE,
    FOREIGN KEY (donor_id) REFERENCES donors(id) ON DELETE CASCADE
);

CREATE TABLE pickups (
    id INT PRIMARY KEY AUTO_INCREMENT,
    food_id INT NOT NULL,
    pickup_person VARCHAR(100) NOT NULL,
    pickup_time DATETIME,
    FOREIGN KEY (food_id) REFERENCES food_items(id) ON DELETE CASCADE
);
