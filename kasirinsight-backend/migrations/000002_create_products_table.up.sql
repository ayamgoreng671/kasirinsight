CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    stock INT NOT NULL DEFAULT 0,
    low_stock_threshold INT NOT NULL,
    healthy_stock_threshold INT NOT NULL,
    selling_price DECIMAL(10,2) NOT NULL,
    cogs DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    deleted_at TIMESTAMP NULL DEFAULT NULL
);


INSERT INTO products 
(id, name, category, stock, low_stock_threshold, healthy_stock_threshold, selling_price, cogs)
VALUES
(1, 'Brown Sugar Latte', 'Drink', 55, 5, 500, 260, 123),
(2, 'Hazelnut Coffee', 'Coffee', 40, 5, 500, 280, 120),
(3, 'Cold Brew', 'Coffee', 70, 2, 500, 160, 65),
(4, 'Vietnam Drip', 'Coffee', 65, 10, 500, 150, 75),
(5, 'Espresso', 'Coffee', 120, 20, 300, 180, 60),
(6, 'Cappuccino', 'Coffee', 80, 15, 250, 250, 90),
(7, 'Latte', 'Coffee', 40, 10, 200, 270, 100),
(8, 'Americano', 'Coffee', 300, 30, 400, 200, 70),
(9, 'Croissant', 'Food', 25, 10, 100, 220, 110),
(10, 'Sandwich', 'Food', 60, 15, 120, 300, 150),
(11, 'Matcha Latte', 'Drink', 15, 10, 100, 290, 120),
(12, 'Chocolate Drink', 'Drink', 200, 25, 300, 240, 90),
(13, 'Mineral Water', 'Minuman', 500, 50, 600, 100, 40),
(14, 'Iced Tea', 'Minuman', 10, 15, 200, 120, 50),
(15, 'French Fries', 'Food', 70, 20, 150, 180, 80),
(16, 'Chicken Nuggets', 'Food', 5, 10, 100, 210, 120),
(17, 'Vanilla Milkshake', 'Drink', 90, 20, 200, 260, 110),
(18, 'Caramel Latte', 'Coffee', 35, 10, 180, 300, 130),
(19, 'Mocha', 'Coffee', 18, 10, 160, 290, 125),
(20, 'Green Tea', 'Minuman', 400, 40, 500, 150, 60);