ALTER USER 'root' IDENTIFIED WITH mysql_native_password BY 'password';
FLUSH PRIVILEGES;
CREATE DATABASE  IF NOT EXISTS `splitwise` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `splitwise`;
-- MySQL dump 10.13  Distrib 8.0.28, for macos11 (x86_64)
--
-- Host: localhost    Database: splitwise
-- ------------------------------------------------------
-- Server version	8.0.28

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `groupings`
--

DROP TABLE IF EXISTS `groupings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `groupings` (
  `id` varchar(36) NOT NULL,
  `groupname` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `groupings`
--

LOCK TABLES `groupings` WRITE;
/*!40000 ALTER TABLE `groupings` DISABLE KEYS */;
INSERT INTO `groupings` VALUES ('00ff2b79-e765-44a2-97b0-c352a14b356e','group3'),('9bcd0715-bc18-4b16-8641-026e15c81336','group2'),('b708eed7-9d99-42b4-b983-179493d212f3','group1'),('f9a80065-8012-477f-b1c6-a8bdf1f54ec7','group4');
/*!40000 ALTER TABLE `groupings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `operations`
--

DROP TABLE IF EXISTS `operations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `operations` (
  `id` varchar(36) NOT NULL,
  `groupid` varchar(36) NOT NULL,
  `transactionid` varchar(45) NOT NULL,
  `paidby` varchar(36) NOT NULL,
  `paidto` varchar(36) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `operations_paidto_idx` (`paidto`),
  KEY `operations_paidby_idx` (`paidby`),
  KEY `operations_transactionid_idx` (`transactionid`),
  KEY `operations_groupid_idx` (`groupid`),
  CONSTRAINT `operations_groupid` FOREIGN KEY (`groupid`) REFERENCES `groupings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `operations_paidby` FOREIGN KEY (`paidby`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `operations_paidto` FOREIGN KEY (`paidto`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `operations_transactionid` FOREIGN KEY (`transactionid`) REFERENCES `transactions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `operations`
--

LOCK TABLES `operations` WRITE;
/*!40000 ALTER TABLE `operations` DISABLE KEYS */;
INSERT INTO `operations` VALUES ('1335ad5a-cbb8-4e7a-b8fc-6660d41e5eb6','b708eed7-9d99-42b4-b983-179493d212f3','98523735-94e0-4cbc-b0f3-16a5c3bf2073','cb7ef38c-6913-4b86-baf0-be35cd26872e','fcf455e5-1fcc-4c32-bdb0-6231e42eadb3',10.00),('1bddf138-d328-4bc8-bdde-08bcb29aa197','b708eed7-9d99-42b4-b983-179493d212f3','a9105992-f058-4c30-be5f-6f5780381490','fcf455e5-1fcc-4c32-bdb0-6231e42eadb3','d295ccaf-d7cb-4cb6-985b-28726b62e588',20.00),('1f9741da-793e-4603-8406-6855d8e64fc1','b708eed7-9d99-42b4-b983-179493d212f3','a9105992-f058-4c30-be5f-6f5780381490','fcf455e5-1fcc-4c32-bdb0-6231e42eadb3','cb7ef38c-6913-4b86-baf0-be35cd26872e',30.00),('3acdfbd1-3915-41f1-a1c5-4b824d466c4a','b708eed7-9d99-42b4-b983-179493d212f3','9a35c80f-af1a-41a4-bb7a-cb78af579389','cb7ef38c-6913-4b86-baf0-be35cd26872e','fcf455e5-1fcc-4c32-bdb0-6231e42eadb3',30.00),('44f03e3b-5a82-4143-9324-4974974983e6','b708eed7-9d99-42b4-b983-179493d212f3','f719dce2-f995-4d8b-b008-cba1ac4701fd','cb7ef38c-6913-4b86-baf0-be35cd26872e','fcf455e5-1fcc-4c32-bdb0-6231e42eadb3',30.00),('481837f7-5ec5-4f45-9f45-038f19853965','b708eed7-9d99-42b4-b983-179493d212f3','98523735-94e0-4cbc-b0f3-16a5c3bf2073','cb7ef38c-6913-4b86-baf0-be35cd26872e','d295ccaf-d7cb-4cb6-985b-28726b62e588',20.00),('547b2e0d-6aed-43f2-a083-5e95598939c3','b708eed7-9d99-42b4-b983-179493d212f3','882bf0d9-04bd-4407-af86-6f5a292c2ec1','d295ccaf-d7cb-4cb6-985b-28726b62e588','fcf455e5-1fcc-4c32-bdb0-6231e42eadb3',10.00),('a46b9ace-11ca-4748-b102-1da3ffd228b6','b708eed7-9d99-42b4-b983-179493d212f3','882bf0d9-04bd-4407-af86-6f5a292c2ec1','d295ccaf-d7cb-4cb6-985b-28726b62e588','cb7ef38c-6913-4b86-baf0-be35cd26872e',30.00);
/*!40000 ALTER TABLE `operations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `id` varchar(36) NOT NULL,
  `groupid` varchar(36) NOT NULL,
  `detail` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `groupidkey_idx` (`groupid`),
  KEY `transactions_groupid_idx` (`groupid`),
  CONSTRAINT `transactions_groupid` FOREIGN KEY (`groupid`) REFERENCES `groupings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES ('882bf0d9-04bd-4407-af86-6f5a292c2ec1','b708eed7-9d99-42b4-b983-179493d212f3','dinner1'),('98523735-94e0-4cbc-b0f3-16a5c3bf2073','b708eed7-9d99-42b4-b983-179493d212f3','dinner1'),('9a35c80f-af1a-41a4-bb7a-cb78af579389','b708eed7-9d99-42b4-b983-179493d212f3','dinner2'),('a9105992-f058-4c30-be5f-6f5780381490','b708eed7-9d99-42b4-b983-179493d212f3','dinner1'),('f719dce2-f995-4d8b-b008-cba1ac4701fd','b708eed7-9d99-42b4-b983-179493d212f3','dinner1');
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usergroups`
--

DROP TABLE IF EXISTS `usergroups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usergroups` (
  `id` varchar(36) NOT NULL,
  `userid` varchar(36) NOT NULL,
  `groupid` varchar(36) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `usergroups_userid_idx` (`groupid`),
  KEY `usergroups_groupid_idx` (`userid`),
  CONSTRAINT `usergroups_groupid` FOREIGN KEY (`groupid`) REFERENCES `groupings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `usergroups_userid` FOREIGN KEY (`userid`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usergroups`
--

LOCK TABLES `usergroups` WRITE;
/*!40000 ALTER TABLE `usergroups` DISABLE KEYS */;
INSERT INTO `usergroups` VALUES ('15e306e8-71a0-443e-8f06-37da4c7bda22','fcf455e5-1fcc-4c32-bdb0-6231e42eadb3','b708eed7-9d99-42b4-b983-179493d212f3'),('2c0295c5-2095-4516-b54d-0df69f01e76f','d295ccaf-d7cb-4cb6-985b-28726b62e588','b708eed7-9d99-42b4-b983-179493d212f3'),('50d446f3-6d79-4759-ba56-e5c2387074b4','d295ccaf-d7cb-4cb6-985b-28726b62e588','f9a80065-8012-477f-b1c6-a8bdf1f54ec7'),('6306581c-c582-4d0e-94d8-b06931e54ace','cb7ef38c-6913-4b86-baf0-be35cd26872e','b708eed7-9d99-42b4-b983-179493d212f3'),('65edb216-5489-4a00-9009-c2ae69f31c6e','d295ccaf-d7cb-4cb6-985b-28726b62e588','00ff2b79-e765-44a2-97b0-c352a14b356e'),('81a86e25-9fc4-40b0-bc20-440e6f4b0d08','cb7ef38c-6913-4b86-baf0-be35cd26872e','9bcd0715-bc18-4b16-8641-026e15c81336'),('86c6bf67-7faf-459f-88ab-b9f542afda9d','fcf455e5-1fcc-4c32-bdb0-6231e42eadb3','00ff2b79-e765-44a2-97b0-c352a14b356e'),('8a7c2fc4-1a52-4dc3-bc4a-9d4d8dd13201','d295ccaf-d7cb-4cb6-985b-28726b62e588','9bcd0715-bc18-4b16-8641-026e15c81336'),('9d177e58-9cf9-4f5b-8eb3-5e31f319a165','cb7ef38c-6913-4b86-baf0-be35cd26872e','f9a80065-8012-477f-b1c6-a8bdf1f54ec7'),('bda8dd22-c13c-4bf5-b01e-a751fdbcfedf','cb7ef38c-6913-4b86-baf0-be35cd26872e','00ff2b79-e765-44a2-97b0-c352a14b356e'),('caea963b-6952-4fde-88c0-b79e1d85f70c','fcf455e5-1fcc-4c32-bdb0-6231e42eadb3','9bcd0715-bc18-4b16-8641-026e15c81336');
/*!40000 ALTER TABLE `usergroups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `username` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('cb7ef38c-6913-4b86-baf0-be35cd26872e','user1'),('d295ccaf-d7cb-4cb6-985b-28726b62e588','user2'),('fcf455e5-1fcc-4c32-bdb0-6231e42eadb3','user3');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-04-17 22:06:00
