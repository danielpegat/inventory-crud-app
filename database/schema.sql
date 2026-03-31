-- ============================================================
-- Fluid Architect — Database Schema
-- Database: crud_system_db
-- ============================================================

CREATE DATABASE IF NOT EXISTS crud_system_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE crud_system_db;

-- ============================================================
-- USERS TABLE
-- Stores authentication credentials and role information.
-- Roles: 'admin' can create/edit/delete; 'user' is read-only.
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
  avatar_url VARCHAR(500) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_users_email (email),
  INDEX idx_users_role (role)
) ENGINE=InnoDB;

-- ============================================================
-- CATEGORIES TABLE
-- Product classification. Each product belongs to one category.
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  color VARCHAR(50) NOT NULL DEFAULT 'primary',   -- UI badge color key
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_categories_slug (slug)
) ENGINE=InnoDB;

-- ============================================================
-- PRODUCTS TABLE
-- Core entity for inventory management.
-- status is auto-derived but stored for efficient querying.
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  sku VARCHAR(50) NOT NULL UNIQUE,
  description TEXT DEFAULT NULL,
  category_id INT NOT NULL,
  price DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  quantity INT NOT NULL DEFAULT 0,
  status ENUM('in_stock', 'low_stock', 'out_of_stock') NOT NULL DEFAULT 'in_stock',
  created_by INT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,

  INDEX idx_products_name (name),
  INDEX idx_products_sku (sku),
  INDEX idx_products_category (category_id),
  INDEX idx_products_status (status)
) ENGINE=InnoDB;

-- ============================================================
-- ACTIVITY LOG TABLE
-- Audit trail for all CRUD actions. Enables the "Recent Activity"
-- feed on the dashboard.
-- ============================================================
CREATE TABLE IF NOT EXISTS activity_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT DEFAULT NULL,
  action ENUM('create', 'update', 'delete', 'login') NOT NULL,
  entity_type VARCHAR(50) NOT NULL,       -- e.g. 'product', 'user'
  entity_id INT DEFAULT NULL,
  details TEXT DEFAULT NULL,              -- JSON string with change summary
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,

  INDEX idx_activity_created (created_at DESC),
  INDEX idx_activity_user (user_id)
) ENGINE=InnoDB;
