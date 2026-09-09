CREATE DATABASE IF NOT EXISTS prakash_bakery;
USE prakash_bakery;

CREATE TABLE admins (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(30) NULL,
  password VARCHAR(255) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  remember_token VARCHAR(100) NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE categories (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE products (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT NULL,
  price DECIMAL(10,2) NOT NULL,
  unit VARCHAR(100) NOT NULL,
  badge VARCHAR(100) NULL,
  prep_time_minutes INT UNSIGNED NOT NULL DEFAULT 0,
  image_path VARCHAR(255) NULL,
  is_eggless TINYINT(1) NOT NULL DEFAULT 0,
  is_available TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE TABLE customers (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL UNIQUE,
  whatsapp_number VARCHAR(20) NULL,
  email VARCHAR(255) NULL,
  default_address TEXT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE delivery_settings (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  bakery_name VARCHAR(255) NOT NULL DEFAULT 'Prakash Bakery',
  bakery_address TEXT NULL,
  bakery_latitude DECIMAL(10,7) NULL,
  bakery_longitude DECIMAL(10,7) NULL,
  free_delivery_radius_km DECIMAL(5,2) NOT NULL DEFAULT 5.00,
  charge_per_extra_km DECIMAL(10,2) NOT NULL DEFAULT 18.00,
  minimum_prep_notice_hours DECIMAL(5,2) NOT NULL DEFAULT 2.00,
  time_slots JSON NOT NULL,
  whatsapp_template TEXT NOT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_number VARCHAR(20) NOT NULL UNIQUE,
  customer_id BIGINT UNSIGNED NOT NULL,
  delivery_type VARCHAR(20) NOT NULL DEFAULT 'delivery',
  delivery_date DATE NOT NULL,
  delivery_slot VARCHAR(255) NOT NULL,
  distance_km DECIMAL(5,2) NOT NULL DEFAULT 0,
  delivery_address TEXT NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  delivery_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'pending',
  otp_code VARCHAR(6) NULL,
  notes TEXT NULL,
  whatsapp_message TEXT NULL,
  accepted_at TIMESTAMP NULL,
  ready_at TIMESTAMP NULL,
  out_for_delivery_at TIMESTAMP NULL,
  delivered_at TIMESTAMP NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

CREATE TABLE order_items (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT UNSIGNED NOT NULL,
  product_id BIGINT UNSIGNED NULL,
  product_name VARCHAR(255) NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  quantity INT UNSIGNED NOT NULL,
  line_total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

INSERT INTO delivery_settings (
  id,
  bakery_name,
  bakery_address,
  bakery_latitude,
  bakery_longitude,
  free_delivery_radius_km,
  charge_per_extra_km,
  minimum_prep_notice_hours,
  time_slots,
  whatsapp_template
) VALUES (
  1,
  'Prakash Bakery',
  'Civil Lines, Prayagraj, Uttar Pradesh',
  25.4358000,
  81.8463000,
  5.00,
  18.00,
  2.00,
  JSON_ARRAY('08:00 AM - 10:00 AM', '10:00 AM - 12:00 PM', '12:00 PM - 02:00 PM', '04:00 PM - 06:00 PM', '06:00 PM - 08:00 PM'),
  'Hello {{name}}, your order {{orderId}} from Prakash Bakery is accepted. Share OTP {{otp}} with the delivery partner on handover.'
);
