-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 21, 2025 at 05:19 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `managebook`
--

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

CREATE TABLE `books` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `title` text DEFAULT NULL,
  `author` varchar(255) DEFAULT NULL,
  `price` float NOT NULL,
  `sale` float DEFAULT NULL,
  `promotion` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`id`, `name`, `title`, `author`, `price`, `sale`, `promotion`, `image`) VALUES
(2, 'Harlem Shuffle', 'Harlem Shuffle', 'by Colson Whitehead', 150000, NULL, NULL, 'harlem_shuffle.jpg'),
(3, 'Native Nations', 'Native Nations', 'by Kathleen Duval', 180000, NULL, NULL, 'native_nations.jpg'),
(4, 'This Motherless Land', 'This Motherless Land', 'by Nikki May', 110000, NULL, NULL, 'this_motherless_land.jpg'),
(5, 'The Haunting', 'The Haunting of Hill House', 'by Shirley Jackson', 99000, NULL, NULL, 'haunting.jpg'),
(6, 'It', 'It', 'by Stephen King', 175000, NULL, NULL, 'it.jpg'),
(7, 'Dracula', 'Dracula', 'by Bram Stoker', 130000, NULL, NULL, 'dracula.jpg'),
(8, 'Pet Sematary', 'Pet Sematary', 'by Stephen King', 160000, NULL, NULL, 'pet_sematary.jpg'),
(9, 'The Shining', 'The Shining', 'by Stephen King', 170000, NULL, NULL, 'shining.jpg'),
(10, 'Funny Bones', 'Funny Bones', 'by Janet Tashjian', 85000, NULL, NULL, 'funny_bones.jpg'),
(11, 'The Giggle Game', 'The Giggle Game', 'by Jimmy Fallon', 90000, NULL, NULL, 'giggle_game.jpg'),
(12, 'Ghosts in the Library', 'Ghosts in the Library', 'by R.L. Stine', 105000, NULL, NULL, 'ghosts.jpg'),
(13, 'Erasure', 'Erasure', 'by Percival Everett', 120000, NULL, NULL, 'erasure.jpg'),
(14, 'Harlem Shuffle', 'Harlem Shuffle', 'by Colson Whitehead', 150000, NULL, NULL, 'harlem_shuffle.jpg'),
(15, 'Native Nations', 'Native Nations', 'by Kathleen Duval', 180000, NULL, NULL, 'native_nations.jpg'),
(16, 'This Motherless Land', 'This Motherless Land', 'by Nikki May', 110000, NULL, NULL, 'this_motherless_land.jpg'),
(17, 'The Haunting', 'The Haunting of Hill House', 'by Shirley Jackson', 99000, NULL, NULL, 'haunting.jpg'),
(18, 'It', 'It', 'by Stephen King', 175000, NULL, NULL, 'it.jpg'),
(19, 'Dracula', 'Dracula', 'by Bram Stoker', 130000, NULL, NULL, 'dracula.jpg'),
(20, 'Pet Sematary', 'Pet Sematary', 'by Stephen King', 160000, NULL, NULL, 'pet_sematary.jpg'),
(21, 'The Shining', 'The Shining', 'by Stephen King', 170000, NULL, NULL, 'shining.jpg'),
(22, 'Funny Bones', 'Funny Bones', 'by Janet Tashjian', 85000, NULL, NULL, 'funny_bones.jpg'),
(23, 'The Giggle Game', 'The Giggle Game', 'by Jimmy Fallon', 90000, NULL, NULL, 'giggle_game.jpg'),
(24, 'Ghosts in the Library', 'Ghosts in the Library', 'by R.L. Stine', 105000, NULL, NULL, 'ghosts.jpg'),
(25, 'Erasure', 'Erasure', 'by Percival Everett', 120000, NULL, NULL, 'erasure.jpg'),
(26, 'Harlem Shuffle', 'Harlem Shuffle', 'by Colson Whitehead', 150000, NULL, NULL, 'harlem_shuffle.jpg'),
(27, 'Native Nations', 'Native Nations', 'by Kathleen Duval', 180000, NULL, NULL, 'native_nations.jpg'),
(28, 'This Motherless Land', 'This Motherless Land', 'by Nikki May', 110000, NULL, NULL, 'this_motherless_land.jpg'),
(29, 'The Haunting', 'The Haunting of Hill House', 'by Shirley Jackson', 99000, NULL, NULL, 'haunting.jpg'),
(30, 'It', 'It', 'by Stephen King', 175000, NULL, NULL, 'it.jpg'),
(31, 'Dracula', 'Dracula', 'by Bram Stoker', 130000, NULL, NULL, 'dracula.jpg'),
(32, 'Pet Sematary', 'Pet Sematary', 'by Stephen King', 160000, NULL, NULL, 'pet_sematary.jpg'),
(33, 'The Shining', 'The Shining', 'by Stephen King', 170000, NULL, NULL, 'shining.jpg'),
(34, 'Funny Bones', 'Funny Bones', 'by Janet Tashjian', 85000, NULL, NULL, 'funny_bones.jpg'),
(35, 'The Giggle Game', 'The Giggle Game', 'by Jimmy Fallon', 90000, NULL, NULL, 'giggle_game.jpg'),
(36, 'Ghosts in the Library', 'Ghosts in the Library', 'by R.L. Stine', 105000, NULL, NULL, 'ghosts.jpg'),
(37, 'Erasure', 'Erasure', 'by Percival Everett', 120000, NULL, NULL, 'erasure.jpg'),
(38, 'Harlem Shuffle', 'Harlem Shuffle', 'by Colson Whitehead', 150000, NULL, NULL, 'harlem_shuffle.jpg'),
(39, 'Native Nations', 'Native Nations', 'by Kathleen Duval', 180000, NULL, NULL, 'native_nations.jpg'),
(40, 'This Motherless Land', 'This Motherless Land', 'by Nikki May', 110000, NULL, NULL, 'this_motherless_land.jpg'),
(41, 'The Haunting', 'The Haunting of Hill House', 'by Shirley Jackson', 99000, NULL, NULL, 'haunting.jpg'),
(42, 'It', 'It', 'by Stephen King', 175000, NULL, NULL, 'it.jpg'),
(43, 'Dracula', 'Dracula', 'by Bram Stoker', 130000, NULL, NULL, 'dracula.jpg'),
(44, 'Pet Sematary', 'Pet Sematary', 'by Stephen King', 160000, NULL, NULL, 'pet_sematary.jpg'),
(45, 'The Shining', 'The Shining', 'by Stephen King', 170000, NULL, NULL, 'shining.jpg'),
(46, 'Funny Bones', 'Funny Bones', 'by Janet Tashjian', 85000, NULL, NULL, 'funny_bones.jpg'),
(47, 'The Giggle Game', 'The Giggle Game', 'by Jimmy Fallon', 90000, NULL, NULL, 'giggle_game.jpg'),
(48, 'Ghosts in the Library', 'Ghosts in the Library', 'by R.L. Stine', 105000, NULL, NULL, 'ghosts.jpg'),
(49, 'Erasure', NULL, 'by Percival Everett', 120000, NULL, '', 'erasure.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `book_categories`
--

CREATE TABLE `book_categories` (
  `book_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `book_categories`
--

INSERT INTO `book_categories` (`book_id`, `category_id`) VALUES
(2, 1),
(3, 1),
(4, 1),
(5, 2),
(6, 2),
(6, 3),
(7, 1),
(7, 2),
(8, 2),
(8, 3),
(9, 1),
(9, 2),
(9, 3),
(10, 3),
(11, 3),
(12, 1),
(12, 2),
(12, 3),
(49, 1);

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

CREATE TABLE `carts` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `book_id` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT 1,
  `status` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `carts`
--

INSERT INTO `carts` (`id`, `user_id`, `book_id`, `quantity`, `status`) VALUES
(1, 8, 4, 1, 1),
(2, 8, 2, 2, 1),
(3, 8, 9, 1, 1),
(4, 8, 4, 1, 1),
(5, 9, 4, 3, 1),
(7, 8, 7, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(1, 'Children'),
(2, 'Horror'),
(3, 'Comedy'),
(4, 'Children'),
(5, 'Horror'),
(6, 'Comedy'),
(7, 'Children'),
(8, 'Horror'),
(9, 'Comedy'),
(10, 'Children'),
(11, 'Horror'),
(12, 'Comedy');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `total` float NOT NULL,
  `status` varchar(50) DEFAULT 'Delivered'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `total`, `status`) VALUES
(1, 8, 720000, 'Delivered'),
(2, 8, 440000, 'Delivered');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `book_id` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `price` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `book_id`, `quantity`, `price`) VALUES
(1, 1, 3, 4, 180000),
(2, 2, 2, 1, 150000),
(3, 2, 3, 1, 180000),
(4, 2, 4, 1, 110000);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `login` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `role` enum('user','admin') NOT NULL,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `login`, `password`, `email`, `phone`, `role`, `image`) VALUES
(1, 'Nam Khanh', 'abc123', '123456', 'abcde@gmail.com', '', 'admin', '/images/ai.png'),
(8, 'nguyen bao', '12', '1234567', '12@gmail.com', '0123', 'user', '/images/a2.png'),
(9, 'Quy', 'Wine', '123456', 'ntnq@gmail.com', '0909082005', 'admin', '/images/a3.png');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `book_categories`
--
ALTER TABLE `book_categories`
  ADD PRIMARY KEY (`book_id`,`category_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `book_id` (`book_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `book_id` (`book_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `login` (`login`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `books`
--
ALTER TABLE `books`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `carts`
--
ALTER TABLE `carts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `book_categories`
--
ALTER TABLE `book_categories`
  ADD CONSTRAINT `book_categories_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `book_categories_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `carts_ibfk_2` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
