-- ============================================================
-- Fluid Architect — Seed Data
-- Run AFTER schema.sql to populate initial data.
-- ============================================================

USE crud_system_db;

-- ============================================================
-- USERS
-- Passwords are bcrypt hashed. Plaintext for reference:
--   admin@fluidarchitect.com  →  Admin123!
--   alex@fluidarchitect.com   →  User123!
-- These hashes are pre-generated with bcrypt (10 rounds).
-- ============================================================
INSERT INTO users (name, email, password_hash, role) VALUES
  ('Admin User', 'admin@fluidarchitect.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin'),
  ('Alex Rivers', 'alex@fluidarchitect.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'user');

-- ============================================================
-- CATEGORIES
-- Color keys map to TailwindCSS badge variants in the frontend.
-- ============================================================
INSERT INTO categories (name, slug, color) VALUES
  ('Architecture', 'architecture', 'primary'),
  ('Industrial', 'industrial', 'secondary'),
  ('Electronics', 'electronics', 'tertiary'),
  ('Software', 'software', 'primary'),
  ('Services', 'services', 'secondary');

-- ============================================================
-- PRODUCTS
-- 15 sample products across all categories with varied stock levels.
-- ============================================================
INSERT INTO products (name, sku, description, category_id, price, quantity, status, created_by) VALUES
  ('Nexus Flux Core', 'NFX-0012', 'High-performance architectural processing unit for distributed systems.', 1, 2499.99, 24, 'in_stock', 1),
  ('Vanguard Relay', 'VGR-9901', 'Industrial-grade relay module for heavy machinery automation.', 2, 879.50, 2, 'low_stock', 1),
  ('Quantum Interface', 'QNT-4421', 'Next-gen quantum computing interface board with 128-qubit support.', 3, 15750.00, 156, 'in_stock', 1),
  ('Cloud Orchestrator Pro', 'COP-3301', 'Enterprise cloud management and orchestration software suite.', 4, 4999.00, 89, 'in_stock', 1),
  ('DataVault Enterprise', 'DVE-1100', 'Secure data storage solution with AES-256 encryption.', 4, 12500.00, 42, 'in_stock', 1),
  ('Precision Servo Kit', 'PSK-7744', 'High-precision servo motor kit for industrial robotics.', 2, 1250.00, 8, 'low_stock', 1),
  ('Neural Bridge Adapter', 'NBA-5502', 'AI-powered network bridge for legacy system integration.', 3, 3200.00, 0, 'out_of_stock', 1),
  ('FlowState Monitor', 'FSM-2200', 'Real-time infrastructure monitoring and alerting platform.', 4, 799.99, 200, 'in_stock', 2),
  ('Titanium Frame Assembly', 'TFA-8800', 'Aerospace-grade titanium structural framework.', 1, 18500.00, 5, 'low_stock', 1),
  ('HyperLink Module', 'HLM-3360', 'Ultra-fast data transmission module for fiber networks.', 3, 650.00, 340, 'in_stock', 2),
  ('Consulting Package', 'CSP-0001', 'Professional consulting services — 40-hour block.', 5, 8000.00, 15, 'in_stock', 1),
  ('Blueprint Analyzer', 'BPA-4410', 'AI-assisted architectural blueprint analysis tool.', 1, 5600.00, 31, 'in_stock', 1),
  ('Power Distribution Unit', 'PDU-6650', 'Smart power distribution for server rack infrastructure.', 2, 1100.00, 67, 'in_stock', 2),
  ('Managed IT Support', 'MIS-0002', 'Annual managed IT support and maintenance contract.', 5, 24000.00, 10, 'in_stock', 1),
  ('Photon Accelerator', 'PHA-9990', 'Experimental photonic computing accelerator card.', 3, 42000.00, 3, 'low_stock', 1);

-- ============================================================
-- ACTIVITY LOG
-- Sample entries for the dashboard activity feed.
-- ============================================================
INSERT INTO activity_log (user_id, action, entity_type, entity_id, details) VALUES
  (1, 'create', 'product', 1, '{"name": "Nexus Flux Core", "sku": "NFX-0012"}'),
  (1, 'create', 'product', 2, '{"name": "Vanguard Relay", "sku": "VGR-9901"}'),
  (2, 'login', 'user', 2, '{"ip": "192.168.1.50"}'),
  (1, 'update', 'product', 5, '{"field": "price", "old": 10000, "new": 12500}'),
  (1, 'create', 'product', 15, '{"name": "Photon Accelerator", "sku": "PHA-9990"}'),
  (2, 'create', 'product', 8, '{"name": "FlowState Monitor", "sku": "FSM-2200"}'),
  (1, 'delete', 'product', NULL, '{"name": "Deprecated Module", "sku": "DEP-0000"}'),
  (1, 'login', 'user', 1, '{"ip": "192.168.1.1"}');
