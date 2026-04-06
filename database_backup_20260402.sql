-- MySQL dump 10.13  Distrib 8.0.45, for Linux (x86_64)
--
-- Host: localhost    Database: whatsstore_db
-- ------------------------------------------------------
-- Server version	8.0.45-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `store_id` bigint unsigned NOT NULL,
  `customer_id` bigint unsigned DEFAULT NULL,
  `session_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `product_id` bigint unsigned NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `variants` json DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cart_items_customer_id_foreign` (`customer_id`),
  KEY `cart_items_product_id_foreign` (`product_id`),
  KEY `cart_items_store_id_customer_id_index` (`store_id`,`customer_id`),
  KEY `cart_items_store_id_session_id_index` (`store_id`,`session_id`),
  CONSTRAINT `cart_items_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_items_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_id` bigint unsigned DEFAULT NULL,
  `store_id` bigint unsigned NOT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `categories_slug_store_id_unique` (`slug`,`store_id`),
  UNIQUE KEY `categories_slug_unique` (`slug`),
  KEY `categories_parent_id_foreign` (`parent_id`),
  KEY `categories_store_id_foreign` (`store_id`),
  CONSTRAINT `categories_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  CONSTRAINT `categories_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Mobile Accessories','mobile-accessories','Phone cases, screen protectors, chargers, and mobile device accessories','/storage/media/1/collection.png',NULL,1,1,1,'2026-04-02 10:31:08','2026-04-02 10:31:08');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cities`
--

DROP TABLE IF EXISTS `cities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cities` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `state_id` bigint unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cities_state_id_foreign` (`state_id`),
  CONSTRAINT `cities_state_id_foreign` FOREIGN KEY (`state_id`) REFERENCES `states` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cities`
--

LOCK TABLES `cities` WRITE;
/*!40000 ALTER TABLE `cities` DISABLE KEYS */;
INSERT INTO `cities` VALUES (1,1,'Los Angeles',1,'2026-04-02 10:31:08','2026-04-02 10:31:08'),(2,1,'San Francisco',1,'2026-04-02 10:31:08','2026-04-02 10:31:08'),(3,2,'Houston',1,'2026-04-02 10:31:08','2026-04-02 10:31:08'),(4,2,'Dallas',1,'2026-04-02 10:31:08','2026-04-02 10:31:08'),(5,3,'Mumbai',1,'2026-04-02 10:31:08','2026-04-02 10:31:08'),(6,3,'Pune',1,'2026-04-02 10:31:08','2026-04-02 10:31:08'),(7,4,'Ahmedabad',1,'2026-04-02 10:31:08','2026-04-02 10:31:08'),(8,4,'Surat',1,'2026-04-02 10:31:08','2026-04-02 10:31:08');
/*!40000 ALTER TABLE `cities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contacts`
--

DROP TABLE IF EXISTS `contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contacts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_landing_page` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contacts`
--

LOCK TABLES `contacts` WRITE;
/*!40000 ALTER TABLE `contacts` DISABLE KEYS */;
/*!40000 ALTER TABLE `contacts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `countries`
--

DROP TABLE IF EXISTS `countries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `countries` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `countries_code_unique` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `countries`
--

LOCK TABLES `countries` WRITE;
/*!40000 ALTER TABLE `countries` DISABLE KEYS */;
INSERT INTO `countries` VALUES (1,'United States','US',1,'2026-04-02 10:31:08','2026-04-02 10:31:08'),(2,'India','IN',1,'2026-04-02 10:31:08','2026-04-02 10:31:08');
/*!40000 ALTER TABLE `countries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coupons`
--

DROP TABLE IF EXISTS `coupons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coupons` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('percentage','flat') COLLATE utf8mb4_unicode_ci NOT NULL,
  `minimum_spend` decimal(10,2) DEFAULT NULL,
  `maximum_spend` decimal(10,2) DEFAULT NULL,
  `discount_amount` decimal(10,2) NOT NULL,
  `use_limit_per_coupon` int DEFAULT NULL,
  `use_limit_per_user` int DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code_type` enum('manual','auto') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'manual',
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `coupons_code_unique` (`code`),
  KEY `coupons_created_by_foreign` (`created_by`),
  CONSTRAINT `coupons_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupons`
--

LOCK TABLES `coupons` WRITE;
/*!40000 ALTER TABLE `coupons` DISABLE KEYS */;
/*!40000 ALTER TABLE `coupons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `currencies`
--

DROP TABLE IF EXISTS `currencies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `currencies` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `symbol` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `is_default` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `currencies_code_unique` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `currencies`
--

LOCK TABLES `currencies` WRITE;
/*!40000 ALTER TABLE `currencies` DISABLE KEYS */;
INSERT INTO `currencies` VALUES (1,'US Dollar','USD','$','United States Dollar',1,'2026-04-02 10:31:08','2026-04-02 10:31:08'),(2,'Euro','EUR','€','Euro',0,'2026-04-02 10:31:08','2026-04-02 10:31:08'),(3,'British Pound','GBP','£','British Pound Sterling',0,'2026-04-02 10:31:08','2026-04-02 10:31:08'),(4,'Japanese Yen','JPY','¥','Japanese Yen',0,'2026-04-02 10:31:08','2026-04-02 10:31:08'),(5,'Canadian Dollar','CAD','C$','Canadian Dollar',0,'2026-04-02 10:31:08','2026-04-02 10:31:08'),(6,'Australian Dollar','AUD','A$','Australian Dollar',0,'2026-04-02 10:31:08','2026-04-02 10:31:08'),(7,'Indian Rupee','INR','₹','Indian Rupee',0,'2026-04-02 10:31:08','2026-04-02 10:31:08'),(8,'Chinese Yuan','CNY','¥','Chinese Yuan',0,'2026-04-02 10:31:08','2026-04-02 10:31:08');
/*!40000 ALTER TABLE `currencies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer_addresses`
--

DROP TABLE IF EXISTS `customer_addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_addresses` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `customer_id` bigint unsigned NOT NULL,
  `type` enum('billing','shipping') COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `state` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `postal_code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `country` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `customer_addresses_customer_id_foreign` (`customer_id`),
  CONSTRAINT `customer_addresses_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_addresses`
--

LOCK TABLES `customer_addresses` WRITE;
/*!40000 ALTER TABLE `customer_addresses` DISABLE KEYS */;
/*!40000 ALTER TABLE `customer_addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `store_id` bigint unsigned NOT NULL,
  `first_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gender` enum('male','female','other','prefer_not_to_say') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `preferred_language` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'en',
  `customer_group` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'regular',
  `email_marketing` tinyint(1) NOT NULL DEFAULT '1',
  `sms_notifications` tinyint(1) NOT NULL DEFAULT '0',
  `order_updates` tinyint(1) NOT NULL DEFAULT '1',
  `total_orders` int NOT NULL DEFAULT '0',
  `total_spent` decimal(10,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `customers_store_id_email_unique` (`store_id`,`email`),
  CONSTRAINT `customers_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `email_template_langs`
--

DROP TABLE IF EXISTS `email_template_langs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `email_template_langs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `parent_id` bigint unsigned NOT NULL,
  `lang` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `email_template_langs_parent_id_foreign` (`parent_id`),
  CONSTRAINT `email_template_langs_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `email_templates` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `email_template_langs`
--

LOCK TABLES `email_template_langs` WRITE;
/*!40000 ALTER TABLE `email_template_langs` DISABLE KEYS */;
INSERT INTO `email_template_langs` VALUES (1,1,'en','Order Complete','<p>Hello,</p><p>Welcome to {app_name}.</p><p>Hi, {order_name}, Thank you for Shopping</p><p>We received your purchase request, we\'ll be in touch shortly!</p><p>Thanks,</p><p>{app_name}</p><p>{order_url}</p>','2026-04-02 10:31:08','2026-04-02 10:31:08'),(2,1,'es','Pedido Completado','<p>Hola,</p><p>Bienvenido a {app_name}.</p><p>Hola, {order_name}, Gracias por comprar</p><p>Recibimos su solicitud de compra, ¡estaremos en contacto en breve!</p><p>Gracias,</p><p>{app_name}</p><p>{order_url}</p>','2026-04-02 10:31:08','2026-04-02 10:31:08'),(3,1,'ar','اكتمال الطلب','<p>مرحبا،</p><p>مرحبا بك في {app_name}.</p><p>مرحبا، {order_name}، شكرا لك على التسوق</p><p>لقد تلقينا طلب الشراء الخاص بك، سنتواصل معك قريبا!</p><p>شكرا،</p><p>{app_name}</p><p>{order_url}</p>','2026-04-02 10:31:08','2026-04-02 10:31:08'),(4,1,'da','Ordre Fuldført','<p>Hej,</p><p>Velkommen til {app_name}.</p><p>Hej, {order_name}, Tak for at handle</p><p>Vi modtog din købsanmodning, vi kontakter dig snart!</p><p>Tak,</p><p>{app_name}</p><p>{order_url}</p>','2026-04-02 10:31:08','2026-04-02 10:31:08'),(5,1,'de','Bestellung Abgeschlossen','<p>Hallo,</p><p>Willkommen bei {app_name}.</p><p>Hallo, {order_name}, Danke fürs Einkaufen</p><p>Wir haben Ihre Kaufanfrage erhalten, wir melden uns bald!</p><p>Danke,</p><p>{app_name}</p><p>{order_url}</p>','2026-04-02 10:31:08','2026-04-02 10:31:08'),(6,1,'fr','Commande Terminée','<p>Bonjour,</p><p>Bienvenue dans {app_name}.</p><p>Salut, {order_name}, Merci pour vos achats</p><p>Nous avons reçu votre demande d\'achat, nous vous contacterons bientôt!</p><p>Merci,</p><p>{app_name}</p><p>{order_url}</p>','2026-04-02 10:31:08','2026-04-02 10:31:08'),(7,1,'he','הזמנה הושלמה','<p>שלום,</p><p>ברוכים הבאים ל-{app_name}.</p><p>שלום, {order_name}, תודה על הקנייה</p><p>קיבלנו את בקשת הרכישה שלך, נחזור אליך בקרוב!</p><p>תודה,</p><p>{app_name}</p><p>{order_url}</p>','2026-04-02 10:31:08','2026-04-02 10:31:08'),(8,1,'it','Ordine Completato','<p>Ciao,</p><p>Benvenuto in {app_name}.</p><p>Ciao, {order_name}, Grazie per aver fatto acquisti</p><p>Abbiamo ricevuto la tua richiesta di acquisto, ti contatteremo presto!</p><p>Grazie,</p><p>{app_name}</p><p>{order_url}</p>','2026-04-02 10:31:08','2026-04-02 10:31:08'),(9,1,'ja','注文完了','<p>こんにちは、</p><p>{app_name}へようこそ。</p><p>こんにちは、{order_name}さん、お買い物ありがとうございます</p><p>ご購入リクエストを受け取りました。すぐにご連絡いたします！</p><p>ありがとうございます、</p><p>{app_name}</p><p>{order_url}</p>','2026-04-02 10:31:08','2026-04-02 10:31:08'),(10,1,'nl','Bestelling Voltooid','<p>Hallo,</p><p>Welkom bij {app_name}.</p><p>Hallo, {order_name}, Bedankt voor het winkelen</p><p>We hebben je aankoopverzoek ontvangen, we nemen binnenkort contact op!</p><p>Bedankt,</p><p>{app_name}</p><p>{order_url}</p>','2026-04-02 10:31:08','2026-04-02 10:31:08'),(11,1,'pl','Zamówienie Zakończone','<p>Cześć,</p><p>Witamy w {app_name}.</p><p>Cześć, {order_name}, Dziękujemy za zakupy</p><p>Otrzymaliśmy Twoje żądanie zakupu, wkrótce się skontaktujemy!</p><p>Dzięki,</p><p>{app_name}</p><p>{order_url}</p>','2026-04-02 10:31:08','2026-04-02 10:31:08'),(12,1,'pt','Pedido Completo','<p>Olá,</p><p>Bem-vindo ao {app_name}.</p><p>Olá, {order_name}, Obrigado por comprar</p><p>Recebemos seu pedido de compra, entraremos em contato em breve!</p><p>Obrigado,</p><p>{app_name}</p><p>{order_url}</p>','2026-04-02 10:31:08','2026-04-02 10:31:08'),(13,1,'pt-BR','Pedido Completo','<p>Olá,</p><p>Bem-vindo ao {app_name}.</p><p>Olá, {order_name}, Obrigado por comprar</p><p>Recebemos sua solicitação de compra, entraremos em contato em breve!</p><p>Obrigado,</p><p>{app_name}</p><p>{order_url}</p>','2026-04-02 10:31:08','2026-04-02 10:31:08'),(14,1,'ru','Заказ Завершен','<p>Привет,</p><p>Добро пожаловать в {app_name}.</p><p>Привет, {order_name}, Спасибо за покупку</p><p>Мы получили ваш запрос на покупку, скоро свяжемся с вами!</p><p>Спасибо,</p><p>{app_name}</p><p>{order_url}</p>','2026-04-02 10:31:08','2026-04-02 10:31:08'),(15,1,'tr','Sipariş Tamamlandı','<p>Merhaba,</p><p>{app_name}\'e hoş geldiniz.</p><p>Merhaba, {order_name}, Alışveriş yaptığınız için teşekkürler</p><p>Satın alma talebinizi aldık, yakında sizinle iletişime geçeceğiz!</p><p>Teşekkürler,</p><p>{app_name}</p><p>{order_url}</p>','2026-04-02 10:31:08','2026-04-02 10:31:08'),(16,1,'zh','订单完成','<p>你好，</p><p>欢迎来到{app_name}。</p><p>你好，{order_name}，感谢您的购买</p><p>我们收到了您的购买请求，我们很快会联系您！</p><p>谢谢，</p><p>{app_name}</p><p>{order_url}</p>','2026-04-02 10:31:08','2026-04-02 10:31:08'),(17,2,'en','Order Detail','<p>Hello,</p><p>Dear {owner_name}.</p><p>This is Confirmation Order {order_id} place on <span style=\"font-size: 1rem;\">{order_date}.</span></p><p>Thanks,</p><p>{order_url}</p>','2026-04-02 10:31:08','2026-04-02 10:31:08'),(18,2,'es','Detalle del Pedido','<p>Hola,</p><p>Estimado {owner_name}.</p><p>Esta es la confirmación del pedido {order_id} realizado el <span style=\"font-size: 1rem;\">{order_date}.</span></p><p>Gracias,</p><p>{order_url}</p>','2026-04-02 10:31:08','2026-04-02 10:31:08'),(19,2,'ar','تفاصيل الطلب','<p>مرحبا،</p><p>عزيزي {owner_name}.</p><p>هذا تأكيد الطلب {order_id} المقدم في <span style=\"font-size: 1rem;\">{order_date}.</span></p><p>شكرا،</p><p>{order_url}</p>','2026-04-02 10:31:08','2026-04-02 10:31:08'),(20,2,'da','Ordre Detaljer','<p>Hej,</p><p>Kære {owner_name}.</p><p>Dette er bekræftelse af ordre {order_id} afgivet den <span style=\"font-size: 1rem;\">{order_date}.</span></p><p>Tak,</p><p>{order_url}</p>','2026-04-02 10:31:08','2026-04-02 10:31:08'),(21,2,'de','Bestelldetails','<p>Hallo,</p><p>Lieber {owner_name}.</p><p>Dies ist die Bestätigung der Bestellung {order_id} vom <span style=\"font-size: 1rem;\">{order_date}.</span></p><p>Danke,</p><p>{order_url}</p>','2026-04-02 10:31:08','2026-04-02 10:31:08'),(22,2,'fr','Détail de la Commande','<p>Bonjour,</p><p>Cher {owner_name}.</p><p>Ceci est la confirmation de commande {order_id} passée le <span style=\"font-size: 1rem;\">{order_date}.</span></p><p>Merci,</p><p>{order_url}</p>','2026-04-02 10:31:08','2026-04-02 10:31:08'),(23,2,'he','פרטי הזמנה','<p>שלום,</p><p>יקר {owner_name}.</p><p>זהו אישור הזמנה {order_id} שהוגשה ב-<span style=\"font-size: 1rem;\">{order_date}.</span></p><p>תודה,</p><p>{order_url}</p>','2026-04-02 10:31:08','2026-04-02 10:31:08'),(24,2,'it','Dettagli Ordine','<p>Ciao,</p><p>Caro {owner_name}.</p><p>Questa è la conferma dell\'ordine {order_id} effettuato il <span style=\"font-size: 1rem;\">{order_date}.</span></p><p>Grazie,</p><p>{order_url}</p>','2026-04-02 10:31:08','2026-04-02 10:31:08'),(25,2,'ja','注文詳細','<p>こんにちは、</p><p>{owner_name}様。</p><p>これは<span style=\"font-size: 1rem;\">{order_date}</span>に行われた注文{order_id}の確認です。</p><p>ありがとうございます、</p><p>{order_url}</p>','2026-04-02 10:31:08','2026-04-02 10:31:08'),(26,2,'nl','Bestelling Details','<p>Hallo,</p><p>Beste {owner_name}.</p><p>Dit is bevestiging van bestelling {order_id} geplaatst op <span style=\"font-size: 1rem;\">{order_date}.</span></p><p>Bedankt,</p><p>{order_url}</p>','2026-04-02 10:31:08','2026-04-02 10:31:08'),(27,2,'pl','Szczegóły Zamówienia','<p>Cześć,</p><p>Drogi {owner_name}.</p><p>To jest potwierdzenie zamówienia {order_id} złożonego <span style=\"font-size: 1rem;\">{order_date}.</span></p><p>Dzięki,</p><p>{order_url}</p>','2026-04-02 10:31:08','2026-04-02 10:31:08'),(28,2,'pt','Detalhes do Pedido','<p>Olá,</p><p>Caro {owner_name}.</p><p>Esta é a confirmação do pedido {order_id} feito em <span style=\"font-size: 1rem;\">{order_date}.</span></p><p>Obrigado,</p><p>{order_url}</p>','2026-04-02 10:31:08','2026-04-02 10:31:08'),(29,2,'pt-BR','Detalhes do Pedido','<p>Olá,</p><p>Caro {owner_name}.</p><p>Esta é a confirmação do pedido {order_id} feito em <span style=\"font-size: 1rem;\">{order_date}.</span></p><p>Obrigado,</p><p>{order_url}</p>','2026-04-02 10:31:08','2026-04-02 10:31:08'),(30,2,'ru','Детали Заказа','<p>Привет,</p><p>Дорогой {owner_name}.</p><p>Это подтверждение заказа {order_id}, размещенного <span style=\"font-size: 1rem;\">{order_date}.</span></p><p>Спасибо,</p><p>{order_url}</p>','2026-04-02 10:31:08','2026-04-02 10:31:08'),(31,2,'tr','Sipariş Detayları','<p>Merhaba,</p><p>Sayın {owner_name}.</p><p>Bu, <span style=\"font-size: 1rem;\">{order_date}</span> tarihinde verilen {order_id} siparişinin onayıdır.</p><p>Teşekkürler,</p><p>{order_url}</p>','2026-04-02 10:31:08','2026-04-02 10:31:08'),(32,2,'zh','订单详情','<p>你好，</p><p>亲爱的{owner_name}。</p><p>这是在<span style=\"font-size: 1rem;\">{order_date}</span>下的订单{order_id}的确认。</p><p>谢谢，</p><p>{order_url}</p>','2026-04-02 10:31:08','2026-04-02 10:31:08'),(33,3,'en','Owner And Store Detail','<p>Hello,<b> {owner_name} </b>!</p><p>Welcome to our app your login detail for <b> {app_name}</b> is <br></p><p><b>Email : </b>{owner_email}</p><p><b>Password : </b>{owner_password}</p><p><b>App url : </b>{app_url}</p><p><b>Store url : </b>{store_url}</p><p>Thank you for connecting with us,</p><p>{app_name}</p>','2026-04-02 10:31:08','2026-04-02 10:31:08'),(34,3,'es','Detalles del Propietario y Tienda','<p>¡Hola,<b> {owner_name} </b>!</p><p>Bienvenido a nuestra aplicación, sus detalles de inicio de sesión para <b> {app_name}</b> son <br></p><p><b>Email : </b>{owner_email}</p><p><b>Contraseña : </b>{owner_password}</p><p><b>URL de la aplicación : </b>{app_url}</p><p><b>URL de la tienda : </b>{store_url}</p><p>Gracias por conectarse con nosotros,</p><p>{app_name}</p>','2026-04-02 10:31:08','2026-04-02 10:31:08'),(35,3,'ar','تفاصيل المالك والمتجر','<p>مرحبا،<b> {owner_name} </b>!</p><p>مرحبا بك في تطبيقنا، تفاصيل تسجيل الدخول الخاصة بك لـ <b> {app_name}</b> هي <br></p><p><b>البريد الإلكتروني : </b>{owner_email}</p><p><b>كلمة المرور : </b>{owner_password}</p><p><b>رابط التطبيق : </b>{app_url}</p><p><b>رابط المتجر : </b>{store_url}</p><p>شكرا لك على التواصل معنا،</p><p>{app_name}</p>','2026-04-02 10:31:08','2026-04-02 10:31:08'),(36,3,'da','Ejer og Butik Detaljer','<p>Hej,<b> {owner_name} </b>!</p><p>Velkommen til vores app, dine login detaljer for <b> {app_name}</b> er <br></p><p><b>Email : </b>{owner_email}</p><p><b>Adgangskode : </b>{owner_password}</p><p><b>App url : </b>{app_url}</p><p><b>Butik url : </b>{store_url}</p><p>Tak for at forbinde med os,</p><p>{app_name}</p>','2026-04-02 10:31:08','2026-04-02 10:31:08'),(37,3,'de','Eigentümer und Shop Details','<p>Hallo,<b> {owner_name} </b>!</p><p>Willkommen in unserer App, Ihre Anmeldedaten für <b> {app_name}</b> sind <br></p><p><b>E-Mail : </b>{owner_email}</p><p><b>Passwort : </b>{owner_password}</p><p><b>App-URL : </b>{app_url}</p><p><b>Shop-URL : </b>{store_url}</p><p>Vielen Dank für die Verbindung mit uns,</p><p>{app_name}</p>','2026-04-02 10:31:08','2026-04-02 10:31:08'),(38,3,'fr','Détails du Propriétaire et du Magasin','<p>Bonjour,<b> {owner_name} </b>!</p><p>Bienvenue dans notre application, vos détails de connexion pour <b> {app_name}</b> sont <br></p><p><b>Email : </b>{owner_email}</p><p><b>Mot de passe : </b>{owner_password}</p><p><b>URL de l\'application : </b>{app_url}</p><p><b>URL du magasin : </b>{store_url}</p><p>Merci de vous connecter avec nous,</p><p>{app_name}</p>','2026-04-02 10:31:08','2026-04-02 10:31:08'),(39,3,'he','פרטי בעלים וחנות','<p>שלום,<b> {owner_name} </b>!</p><p>ברוכים הבאים לאפליקציה שלנו, פרטי ההתחברות שלך ל-<b> {app_name}</b> הם <br></p><p><b>אימייל : </b>{owner_email}</p><p><b>סיסמה : </b>{owner_password}</p><p><b>כתובת האפליקציה : </b>{app_url}</p><p><b>כתובת החנות : </b>{store_url}</p><p>תודה על ההתחברות אלינו,</p><p>{app_name}</p>','2026-04-02 10:31:09','2026-04-02 10:31:09'),(40,3,'it','Dettagli Proprietario e Negozio','<p>Ciao,<b> {owner_name} </b>!</p><p>Benvenuto nella nostra app, i tuoi dettagli di accesso per <b> {app_name}</b> sono <br></p><p><b>Email : </b>{owner_email}</p><p><b>Password : </b>{owner_password}</p><p><b>URL app : </b>{app_url}</p><p><b>URL negozio : </b>{store_url}</p><p>Grazie per esserti connesso con noi,</p><p>{app_name}</p>','2026-04-02 10:31:09','2026-04-02 10:31:09'),(41,3,'ja','オーナーとストアの詳細','<p>こんにちは、<b> {owner_name} </b>さん！</p><p>私たちのアプリへようこそ。<b> {app_name}</b>のログイン詳細は <br></p><p><b>メール : </b>{owner_email}</p><p><b>パスワード : </b>{owner_password}</p><p><b>アプリURL : </b>{app_url}</p><p><b>ストアURL : </b>{store_url}</p><p>私たちとつながっていただき、ありがとうございます。</p><p>{app_name}</p>','2026-04-02 10:31:09','2026-04-02 10:31:09'),(42,3,'nl','Eigenaar en Winkel Details','<p>Hallo,<b> {owner_name} </b>!</p><p>Welkom bij onze app, je inloggegevens voor <b> {app_name}</b> zijn <br></p><p><b>Email : </b>{owner_email}</p><p><b>Wachtwoord : </b>{owner_password}</p><p><b>App url : </b>{app_url}</p><p><b>Winkel url : </b>{store_url}</p><p>Bedankt voor het verbinden met ons,</p><p>{app_name}</p>','2026-04-02 10:31:09','2026-04-02 10:31:09'),(43,3,'pl','Szczegóły Właściciela i Sklepu','<p>Cześć,<b> {owner_name} </b>!</p><p>Witamy w naszej aplikacji, Twoje dane logowania do <b> {app_name}</b> to <br></p><p><b>Email : </b>{owner_email}</p><p><b>Hasło : </b>{owner_password}</p><p><b>URL aplikacji : </b>{app_url}</p><p><b>URL sklepu : </b>{store_url}</p><p>Dziękujemy za połączenie z nami,</p><p>{app_name}</p>','2026-04-02 10:31:09','2026-04-02 10:31:09'),(44,3,'pt','Detalhes do Proprietário e Loja','<p>Olá,<b> {owner_name} </b>!</p><p>Bem-vindo ao nosso app, seus detalhes de login para <b> {app_name}</b> são <br></p><p><b>Email : </b>{owner_email}</p><p><b>Senha : </b>{owner_password}</p><p><b>URL do app : </b>{app_url}</p><p><b>URL da loja : </b>{store_url}</p><p>Obrigado por se conectar conosco,</p><p>{app_name}</p>','2026-04-02 10:31:09','2026-04-02 10:31:09'),(45,3,'pt-BR','Detalhes do Proprietário e Loja','<p>Olá,<b> {owner_name} </b>!</p><p>Bem-vindo ao nosso app, seus detalhes de login para <b> {app_name}</b> são <br></p><p><b>Email : </b>{owner_email}</p><p><b>Senha : </b>{owner_password}</p><p><b>URL do app : </b>{app_url}</p><p><b>URL da loja : </b>{store_url}</p><p>Obrigado por se conectar conosco,</p><p>{app_name}</p>','2026-04-02 10:31:09','2026-04-02 10:31:09'),(46,3,'ru','Детали Владельца и Магазина','<p>Привет,<b> {owner_name} </b>!</p><p>Добро пожаловать в наше приложение, ваши данные для входа в <b> {app_name}</b> <br></p><p><b>Email : </b>{owner_email}</p><p><b>Пароль : </b>{owner_password}</p><p><b>URL приложения : </b>{app_url}</p><p><b>URL магазина : </b>{store_url}</p><p>Спасибо за связь с нами,</p><p>{app_name}</p>','2026-04-02 10:31:09','2026-04-02 10:31:09'),(47,3,'tr','Sahip ve Mağaza Detayları','<p>Merhaba,<b> {owner_name} </b>!</p><p>Uygulamamıza hoş geldiniz, <b> {app_name}</b> için giriş bilgileriniz <br></p><p><b>Email : </b>{owner_email}</p><p><b>Şifre : </b>{owner_password}</p><p><b>Uygulama url : </b>{app_url}</p><p><b>Mağaza url : </b>{store_url}</p><p>Bizimle bağlantı kurduğunuz için teşekkürler,</p><p>{app_name}</p>','2026-04-02 10:31:09','2026-04-02 10:31:09'),(48,3,'zh','店主和商店详情','<p>你好，<b> {owner_name} </b>！</p><p>欢迎使用我们的应用，您的<b> {app_name}</b>登录详情是 <br></p><p><b>邮箱 : </b>{owner_email}</p><p><b>密码 : </b>{owner_password}</p><p><b>应用网址 : </b>{app_url}</p><p><b>商店网址 : </b>{store_url}</p><p>感谢您与我们联系，</p><p>{app_name}</p>','2026-04-02 10:31:09','2026-04-02 10:31:09'),(49,4,'en','Order Status','<p>Hello,</p><p>Welcome to {app_name}.</p><p>Your Order is {order_status}!</p><p>Hi {order_name}, Thank you for Shopping</p><p>Thanks,</p><p>{app_name}</p><p>{order_url}</p>','2026-04-02 10:31:09','2026-04-02 10:31:09'),(50,4,'es','Estado del Pedido','<p>Hola,</p><p>Bienvenido a {app_name}.</p><p>¡Su pedido está {order_status}!</p><p>Hola {order_name}, Gracias por comprar</p><p>Gracias,</p><p>{app_name}</p><p>{order_url}</p>','2026-04-02 10:31:09','2026-04-02 10:31:09'),(51,4,'ar','حالة الطلب','<p>مرحبا،</p><p>مرحبا بك في {app_name}.</p><p>طلبك {order_status}!</p><p>مرحبا {order_name}، شكرا لك على التسوق</p><p>شكرا،</p><p>{app_name}</p><p>{order_url}</p>','2026-04-02 10:31:09','2026-04-02 10:31:09'),(52,4,'da','Ordre Status','<p>Hej,</p><p>Velkommen til {app_name}.</p><p>Din ordre er {order_status}!</p><p>Hej {order_name}, Tak for at handle</p><p>Tak,</p><p>{app_name}</p><p>{order_url}</p>','2026-04-02 10:31:09','2026-04-02 10:31:09'),(53,4,'de','Bestellstatus','<p>Hallo,</p><p>Willkommen bei {app_name}.</p><p>Ihre Bestellung ist {order_status}!</p><p>Hallo {order_name}, Danke fürs Einkaufen</p><p>Danke,</p><p>{app_name}</p><p>{order_url}</p>','2026-04-02 10:31:09','2026-04-02 10:31:09'),(54,4,'fr','Statut de la Commande','<p>Bonjour,</p><p>Bienvenue dans {app_name}.</p><p>Votre commande est {order_status}!</p><p>Salut {order_name}, Merci pour vos achats</p><p>Merci,</p><p>{app_name}</p><p>{order_url}</p>','2026-04-02 10:31:09','2026-04-02 10:31:09'),(55,4,'he','סטטוס הזמנה','<p>שלום,</p><p>ברוכים הבאים ל-{app_name}.</p><p>ההזמנה שלך {order_status}!</p><p>שלום {order_name}, תודה על הקנייה</p><p>תודה,</p><p>{app_name}</p><p>{order_url}</p>','2026-04-02 10:31:09','2026-04-02 10:31:09'),(56,4,'it','Stato Ordine','<p>Ciao,</p><p>Benvenuto in {app_name}.</p><p>Il tuo ordine è {order_status}!</p><p>Ciao {order_name}, Grazie per aver fatto acquisti</p><p>Grazie,</p><p>{app_name}</p><p>{order_url}</p>','2026-04-02 10:31:09','2026-04-02 10:31:09'),(57,4,'ja','注文ステータス','<p>こんにちは、</p><p>{app_name}へようこそ。</p><p>あなたの注文は{order_status}です！</p><p>こんにちは{order_name}さん、お買い物ありがとうございます</p><p>ありがとうございます、</p><p>{app_name}</p><p>{order_url}</p>','2026-04-02 10:31:09','2026-04-02 10:31:09'),(58,4,'nl','Bestelling Status','<p>Hallo,</p><p>Welkom bij {app_name}.</p><p>Je bestelling is {order_status}!</p><p>Hallo {order_name}, Bedankt voor het winkelen</p><p>Bedankt,</p><p>{app_name}</p><p>{order_url}</p>','2026-04-02 10:31:09','2026-04-02 10:31:09'),(59,4,'pl','Status Zamówienia','<p>Cześć,</p><p>Witamy w {app_name}.</p><p>Twoje zamówienie jest {order_status}!</p><p>Cześć {order_name}, Dziękujemy za zakupy</p><p>Dzięki,</p><p>{app_name}</p><p>{order_url}</p>','2026-04-02 10:31:09','2026-04-02 10:31:09'),(60,4,'pt','Status do Pedido','<p>Olá,</p><p>Bem-vindo ao {app_name}.</p><p>Seu pedido está {order_status}!</p><p>Olá {order_name}, Obrigado por comprar</p><p>Obrigado,</p><p>{app_name}</p><p>{order_url}</p>','2026-04-02 10:31:09','2026-04-02 10:31:09'),(61,4,'pt-BR','Status do Pedido','<p>Olá,</p><p>Bem-vindo ao {app_name}.</p><p>Seu pedido está {order_status}!</p><p>Olá {order_name}, Obrigado por comprar</p><p>Obrigado,</p><p>{app_name}</p><p>{order_url}</p>','2026-04-02 10:31:09','2026-04-02 10:31:09'),(62,4,'ru','Статус Заказа','<p>Привет,</p><p>Добро пожаловать в {app_name}.</p><p>Ваш заказ {order_status}!</p><p>Привет {order_name}, Спасибо за покупку</p><p>Спасибо,</p><p>{app_name}</p><p>{order_url}</p>','2026-04-02 10:31:09','2026-04-02 10:31:09'),(63,4,'tr','Sipariş Durumu','<p>Merhaba,</p><p>{app_name}\'e hoş geldiniz.</p><p>Siparişiniz {order_status}!</p><p>Merhaba {order_name}, Alışveriş yaptığınız için teşekkürler</p><p>Teşekkürler,</p><p>{app_name}</p><p>{order_url}</p>','2026-04-02 10:31:09','2026-04-02 10:31:09'),(64,4,'zh','订单状态','<p>你好，</p><p>欢迎来到{app_name}。</p><p>您的订单是{order_status}！</p><p>你好{order_name}，感谢您的购买</p><p>谢谢，</p><p>{app_name}</p><p>{order_url}</p>','2026-04-02 10:31:09','2026-04-02 10:31:09'),(65,5,'en','Welcome to our platform - {user_name}','<p>Hello {user_name},</p><p>Your account has been successfully created.</p><p><strong>Login Details:</strong></p><ul><li>Website: {app_url}</li><li>Email: {user_email}</li><li>Password: {user_password}</li><li>Account Type: {user_type}</li></ul><p>Please keep this information secure.</p><p>Best regards,<br>Support Team</p>','2026-04-02 10:31:09','2026-04-02 10:31:09'),(66,5,'es','Bienvenido a nuestra plataforma - {user_name}','<p>Hola {user_name},</p><p>Su cuenta ha sido creada exitosamente.</p><p><strong>Detalles de acceso:</strong></p><ul><li>Sitio web: {app_url}</li><li>Email: {user_email}</li><li>Contraseña: {user_password}</li><li>Tipo de cuenta: {user_type}</li></ul><p>Por favor mantenga esta información segura.</p><p>Saludos cordiales,<br>Equipo de Soporte</p>','2026-04-02 10:31:09','2026-04-02 10:31:09'),(67,5,'ar','مرحبا بك في منصتنا - {user_name}','<p>مرحبا {user_name}،</p><p>تم إنشاء حسابك بنجاح.</p><p><strong>تفاصيل تسجيل الدخول:</strong></p><ul><li>الموقع: {app_url}</li><li>البريد الإلكتروني: {user_email}</li><li>كلمة المرور: {user_password}</li><li>نوع الحساب: {user_type}</li></ul><p>يرجى الحفاظ على هذه المعلومات آمنة.</p><p>أطيب التحيات،<br>فريق الدعم</p>','2026-04-02 10:31:09','2026-04-02 10:31:09'),(68,5,'da','Velkommen til vores platform - {user_name}','<p>Hej {user_name},</p><p>Din konto er blevet oprettet med succes.</p><p><strong>Login detaljer:</strong></p><ul><li>Hjemmeside: {app_url}</li><li>Email: {user_email}</li><li>Adgangskode: {user_password}</li><li>Kontotype: {user_type}</li></ul><p>Hold venligst disse oplysninger sikre.</p><p>Med venlig hilsen,<br>Support Team</p>','2026-04-02 10:31:09','2026-04-02 10:31:09'),(69,5,'de','Willkommen auf unserer Plattform - {user_name}','<p>Hallo {user_name},</p><p>Ihr Konto wurde erfolgreich erstellt.</p><p><strong>Anmeldedaten:</strong></p><ul><li>Website: {app_url}</li><li>E-Mail: {user_email}</li><li>Passwort: {user_password}</li><li>Kontotyp: {user_type}</li></ul><p>Bitte bewahren Sie diese Informationen sicher auf.</p><p>Mit freundlichen Grüßen,<br>Support-Team</p>','2026-04-02 10:31:09','2026-04-02 10:31:09'),(70,5,'fr','Bienvenue sur notre plateforme - {user_name}','<p>Bonjour {user_name},</p><p>Votre compte a été créé avec succès.</p><p><strong>Détails de connexion:</strong></p><ul><li>Site web: {app_url}</li><li>Email: {user_email}</li><li>Mot de passe: {user_password}</li><li>Type de compte: {user_type}</li></ul><p>Veuillez garder ces informations en sécurité.</p><p>Cordialement,<br>Équipe de support</p>','2026-04-02 10:31:09','2026-04-02 10:31:09'),(71,5,'he','ברוכים הבאים לפלטפורמה שלנו - {user_name}','<p>שלום {user_name},</p><p>החשבון שלך נוצר בהצלחה.</p><p><strong>פרטי התחברות:</strong></p><ul><li>אתר: {app_url}</li><li>אימייל: {user_email}</li><li>סיסמה: {user_password}</li><li>סוג חשבון: {user_type}</li></ul><p>אנא שמרו על המידע הזה בבטחה.</p><p>בברכה,<br>צוות התמיכה</p>','2026-04-02 10:31:09','2026-04-02 10:31:09'),(72,5,'it','Benvenuto sulla nostra piattaforma - {user_name}','<p>Ciao {user_name},</p><p>Il tuo account è stato creato con successo.</p><p><strong>Dettagli di accesso:</strong></p><ul><li>Sito web: {app_url}</li><li>Email: {user_email}</li><li>Password: {user_password}</li><li>Tipo di account: {user_type}</li></ul><p>Si prega di mantenere queste informazioni sicure.</p><p>Cordiali saluti,<br>Team di supporto</p>','2026-04-02 10:31:09','2026-04-02 10:31:09'),(73,5,'ja','私たちのプラットフォームへようこそ - {user_name}','<p>こんにちは {user_name}さん、</p><p>あなたのアカウントが正常に作成されました。</p><p><strong>ログイン詳細:</strong></p><ul><li>ウェブサイト: {app_url}</li><li>メール: {user_email}</li><li>パスワード: {user_password}</li><li>アカウントタイプ: {user_type}</li></ul><p>この情報を安全に保管してください。</p><p>よろしくお願いします、<br>サポートチーム</p>','2026-04-02 10:31:09','2026-04-02 10:31:09'),(74,5,'nl','Welkom op ons platform - {user_name}','<p>Hallo {user_name},</p><p>Je account is succesvol aangemaakt.</p><p><strong>Inloggegevens:</strong></p><ul><li>Website: {app_url}</li><li>Email: {user_email}</li><li>Wachtwoord: {user_password}</li><li>Accounttype: {user_type}</li></ul><p>Houd deze informatie veilig.</p><p>Met vriendelijke groet,<br>Support Team</p>','2026-04-02 10:31:09','2026-04-02 10:31:09'),(75,5,'pl','Witamy na naszej platformie - {user_name}','<p>Cześć {user_name},</p><p>Twoje konto zostało pomyślnie utworzone.</p><p><strong>Szczegóły logowania:</strong></p><ul><li>Strona internetowa: {app_url}</li><li>Email: {user_email}</li><li>Hasło: {user_password}</li><li>Typ konta: {user_type}</li></ul><p>Proszę zachować te informacje w bezpiecznym miejscu.</p><p>Z poważaniem,<br>Zespół wsparcia</p>','2026-04-02 10:31:09','2026-04-02 10:31:09'),(76,5,'pt','Bem-vindo à nossa plataforma - {user_name}','<p>Olá {user_name},</p><p>Sua conta foi criada com sucesso.</p><p><strong>Detalhes de login:</strong></p><ul><li>Site: {app_url}</li><li>Email: {user_email}</li><li>Senha: {user_password}</li><li>Tipo de conta: {user_type}</li></ul><p>Por favor, mantenha essas informações seguras.</p><p>Atenciosamente,<br>Equipe de Suporte</p>','2026-04-02 10:31:09','2026-04-02 10:31:09'),(77,5,'pt-BR','Bem-vindo à nossa plataforma - {user_name}','<p>Olá {user_name},</p><p>Sua conta foi criada com sucesso.</p><p><strong>Detalhes de login:</strong></p><ul><li>Site: {app_url}</li><li>Email: {user_email}</li><li>Senha: {user_password}</li><li>Tipo de conta: {user_type}</li></ul><p>Por favor, mantenha essas informações seguras.</p><p>Atenciosamente,<br>Equipe de Suporte</p>','2026-04-02 10:31:09','2026-04-02 10:31:09'),(78,5,'ru','Добро пожаловать на нашу платформу - {user_name}','<p>Привет {user_name},</p><p>Ваш аккаунт был успешно создан.</p><p><strong>Данные для входа:</strong></p><ul><li>Веб-сайт: {app_url}</li><li>Email: {user_email}</li><li>Пароль: {user_password}</li><li>Тип аккаунта: {user_type}</li></ul><p>Пожалуйста, храните эту информацию в безопасности.</p><p>С уважением,<br>Команда поддержки</p>','2026-04-02 10:31:09','2026-04-02 10:31:09'),(79,5,'tr','Platformumuza hoş geldiniz - {user_name}','<p>Merhaba {user_name},</p><p>Hesabınız başarıyla oluşturuldu.</p><p><strong>Giriş detayları:</strong></p><ul><li>Web sitesi: {app_url}</li><li>Email: {user_email}</li><li>Şifre: {user_password}</li><li>Hesap türü: {user_type}</li></ul><p>Lütfen bu bilgileri güvenli tutun.</p><p>Saygılarımızla,<br>Destek Ekibi</p>','2026-04-02 10:31:09','2026-04-02 10:31:09'),(80,5,'zh','欢迎来到我们的平台 - {user_name}','<p>你好 {user_name}，</p><p>您的账户已成功创建。</p><p><strong>登录详情：</strong></p><ul><li>网站：{app_url}</li><li>邮箱：{user_email}</li><li>密码：{user_password}</li><li>账户类型：{user_type}</li></ul><p>请保护好这些信息。</p><p>此致敬礼，<br>支持团队</p>','2026-04-02 10:31:09','2026-04-02 10:31:09');
/*!40000 ALTER TABLE `email_template_langs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `email_templates`
--

DROP TABLE IF EXISTS `email_templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `email_templates` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `from` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` bigint unsigned NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `email_templates`
--

LOCK TABLES `email_templates` WRITE;
/*!40000 ALTER TABLE `email_templates` DISABLE KEYS */;
INSERT INTO `email_templates` VALUES (1,'Order Created','WhatsStore SaaS',1,'2026-04-02 10:31:08','2026-04-02 10:31:08'),(2,'Order Created For Owner','WhatsStore SaaS',1,'2026-04-02 10:31:08','2026-04-02 10:31:08'),(3,'Owner And Store Created','WhatsStore SaaS',1,'2026-04-02 10:31:08','2026-04-02 10:31:08'),(4,'Status Change','WhatsStore SaaS',1,'2026-04-02 10:31:09','2026-04-02 10:31:09'),(5,'User Created','WhatsStore SaaS',1,'2026-04-02 10:31:09','2026-04-02 10:31:09');
/*!40000 ALTER TABLE `email_templates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `express_checkouts`
--

DROP TABLE IF EXISTS `express_checkouts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `express_checkouts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `store_id` bigint unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `button_text` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Buy Now',
  `button_color` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#000000',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `payment_methods` json DEFAULT NULL,
  `default_payment_method` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `skip_cart` tinyint(1) NOT NULL DEFAULT '1',
  `auto_fill_customer_data` tinyint(1) NOT NULL DEFAULT '1',
  `guest_checkout_allowed` tinyint(1) NOT NULL DEFAULT '0',
  `mobile_optimized` tinyint(1) NOT NULL DEFAULT '1',
  `save_payment_methods` tinyint(1) NOT NULL DEFAULT '0',
  `success_redirect_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cancel_redirect_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `conversions` int NOT NULL DEFAULT '0',
  `revenue` decimal(10,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `express_checkouts_store_id_foreign` (`store_id`),
  CONSTRAINT `express_checkouts_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `express_checkouts`
--

LOCK TABLES `express_checkouts` WRITE;
/*!40000 ALTER TABLE `express_checkouts` DISABLE KEYS */;
/*!40000 ALTER TABLE `express_checkouts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `landing_page_custom_pages`
--

DROP TABLE IF EXISTS `landing_page_custom_pages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `landing_page_custom_pages` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `meta_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meta_description` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `sort_order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `landing_page_custom_pages_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `landing_page_custom_pages`
--

LOCK TABLES `landing_page_custom_pages` WRITE;
/*!40000 ALTER TABLE `landing_page_custom_pages` DISABLE KEYS */;
/*!40000 ALTER TABLE `landing_page_custom_pages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `landing_page_settings`
--

DROP TABLE IF EXISTS `landing_page_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `landing_page_settings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `company_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'WhatsStore',
  `contact_email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'support@whatsstore.com',
  `contact_phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '+1 (555) 123-4567',
  `contact_address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'San Francisco, CA',
  `config_sections` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `landing_page_settings`
--

LOCK TABLES `landing_page_settings` WRITE;
/*!40000 ALTER TABLE `landing_page_settings` DISABLE KEYS */;
INSERT INTO `landing_page_settings` VALUES (1,'WhatsStore','support@whatsstore.com','+1 (555) 123-4567','123 Business Ave, Suite 100, San Francisco, CA 94105','{\"seo\": {\"meta_title\": \"WhatsStore - Multi-Store Management Platform\", \"meta_keywords\": \"multi-store platform, online store management, e-commerce solution, store builder, WhatsStore\", \"meta_description\": \"Create and manage multiple online stores with WhatsStore. Powerful e-commerce platform with beautiful themes and advanced features.\"}, \"theme\": {\"favicon\": \"\", \"logo_dark\": \"\", \"logo_light\": \"\", \"accent_color\": \"#f7f7f7\", \"primary_color\": \"#10b77f\", \"secondary_color\": \"#ffffff\"}, \"sections\": [{\"key\": \"header\", \"text_color\": \"#1f2937\", \"transparent\": false, \"button_style\": \"gradient\", \"background_color\": \"#ffffff\"}, {\"key\": \"hero\", \"image\": \"/images/hero-dashboard.svg\", \"stats\": [{\"label\": \"Active Users\", \"value\": \"10K+\"}, {\"label\": \"Countries\", \"value\": \"50+\"}, {\"label\": \"Satisfaction\", \"value\": \"99%\"}], \"title\": \"Launch Your Online Store in Minutes\", \"height\": 600, \"layout\": \"image-right\", \"subtitle\": \"Create and manage multiple online stores with our powerful e-commerce platform.\", \"text_color\": \"#1f2937\", \"background_color\": \"#f8fafc\", \"announcement_text\": \"🚀 New: Advanced Analytics Dashboard\", \"primary_button_text\": \"Start Free Trial\", \"secondary_button_text\": \"Login\"}, {\"key\": \"features\", \"image\": \"\", \"title\": \"Everything You Need to Build Your Online Empire\", \"layout\": \"grid\", \"columns\": 3, \"show_icons\": true, \"description\": \"Comprehensive multi-store management platform with powerful features designed for modern e-commerce entrepreneurs.\", \"features_list\": [{\"icon\": \"store\", \"title\": \"Multi-Store Management\", \"description\": \"Create and manage unlimited online stores from one centralized dashboard with ease.\"}, {\"icon\": \"palette\", \"title\": \"7+ Professional Themes\", \"description\": \"Choose from beautifully designed themes for different business categories and industries.\"}, {\"icon\": \"credit-card\", \"title\": \"30+ Payment Gateways\", \"description\": \"Accept payments globally with Stripe, PayPal, Razorpay, and 30+ other payment methods.\"}, {\"icon\": \"bar-chart\", \"title\": \"Advanced Analytics\", \"description\": \"Track sales, customers, inventory, and performance with detailed reports and insights.\"}, {\"icon\": \"users\", \"title\": \"Customer Management\", \"description\": \"Manage customer profiles, orders, and communication across all your stores.\"}, {\"icon\": \"package\", \"title\": \"Inventory Management\", \"description\": \"Track stock levels, manage products, and automate inventory across multiple stores.\"}, {\"icon\": \"smartphone\", \"title\": \"Mobile Responsive\", \"description\": \"All stores are fully optimized for mobile devices and tablets for better customer experience.\"}, {\"icon\": \"shield\", \"title\": \"Secure & Reliable\", \"description\": \"Enterprise-grade security with SSL certificates, data encryption, and regular backups.\"}, {\"icon\": \"headphones\", \"title\": \"24/7 Support\", \"description\": \"Get help when you need it with our dedicated support team available around the clock.\"}], \"background_color\": \"#ffffff\"}, {\"key\": \"screenshots\", \"title\": \"See WhatsStore in Action\", \"subtitle\": \"Explore our powerful multi-store management platform and see how easy it is to build your online empire.\", \"screenshots_list\": [{\"alt\": \"WhatsStore Dashboard Overview\", \"src\": \"/storage/placeholder/landing-page/dashboard.png\", \"title\": \"Dashboard Overview\", \"description\": \"Comprehensive dashboard showing all your stores, sales analytics, and key performance metrics in one place.\"}, {\"alt\": \"Store Builder Interface\", \"src\": \"/storage/placeholder/landing-page/stores.png\", \"title\": \"Store Builder\", \"description\": \"Intuitive drag-and-drop store builder with professional themes and customization options.\"}, {\"alt\": \"Product Management System\", \"src\": \"/storage/placeholder/landing-page/products.png\", \"title\": \"Product Management\", \"description\": \"Easily add, edit, and organize products across multiple stores with bulk operations and inventory tracking.\"}, {\"alt\": \"Order Management Dashboard\", \"src\": \"/storage/placeholder/landing-page/orders.png\", \"title\": \"Order Management\", \"description\": \"Track and manage orders from all your stores in one centralized order management system.\"}, {\"alt\": \"Analytics and Reports\", \"src\": \"/storage/placeholder/landing-page/analytics.png\", \"title\": \"Analytics & Reports\", \"description\": \"Detailed analytics and reports showing sales trends, customer behavior, and store performance insights.\"}, {\"alt\": \"Theme Selections\", \"src\": \"/storage/placeholder/landing-page/themes.png\", \"title\": \"Theme Selections\", \"description\": \"Choose from 7+ professional themes for each store\"}]}, {\"key\": \"why_choose_us\", \"stats\": [{\"color\": \"green\", \"label\": \"Active Users\", \"value\": \"15K+\"}, {\"color\": \"green\", \"label\": \"Uptime\", \"value\": \"99.9%\"}, {\"color\": \"green\", \"label\": \"Support\", \"value\": \"24/7\"}], \"title\": \"Why Choose WhatsStore?\", \"reasons\": [{\"icon\": \"stores\", \"title\": \"Multi-Store Architecture\", \"description\": \"Manage unlimited stores from one account with centralized dashboard, inventory, and customer management.\"}, {\"icon\": \"palette\", \"title\": \"Professional Themes\", \"description\": \"Choose from 7+ industry-specific themes designed to maximize conversions and user experience.\"}, {\"icon\": \"chart\", \"title\": \"Advanced Analytics\", \"description\": \"Get detailed insights into sales, customers, and performance across all your stores in real-time.\"}], \"subtitle\": \"The complete multi-store e-commerce solution designed for ambitious entrepreneurs and growing businesses.\", \"cta_title\": \"Ready to Build Your Store Empire?\", \"stats_title\": \"Trusted by Businesses Worldwide\", \"cta_subtitle\": \"Join thousands of successful entrepreneurs using WhatsStore\", \"stats_subtitle\": \"Join thousands of successful entrepreneurs\"}, {\"key\": \"themes\", \"title\": \"Choose Your Perfect Store Theme\", \"subtitle\": \"Select from our collection of professionally designed themes, each crafted for specific business categories to maximize your success.\", \"cta_title\": \"Ready to Launch Your Store Empire?\", \"cta_description\": \"Pick your favorite theme and start building your first store in minutes. Switch themes anytime as your business grows and evolves.\", \"selected_themes\": [\"fashion\", \"home-decor\", \"bakery\", \"supermarket\", \"car-accessories\", \"toy\"], \"primary_button_text\": \"Start Building Now\", \"secondary_button_text\": \"Explore All Themes\"}, {\"key\": \"about\", \"image\": \"/images/about-whatsstore.svg\", \"stats\": [{\"color\": \"green\", \"label\": \"Experience\", \"value\": \"5+ Years\"}, {\"color\": \"green\", \"label\": \"Happy Users\", \"value\": \"15K+\"}, {\"color\": \"green\", \"label\": \"Countries\", \"value\": \"75+\"}], \"title\": \"About WhatsStore\", \"layout\": \"image-right\", \"values\": [{\"icon\": \"target\", \"title\": \"Our Mission\", \"description\": \"To democratize e-commerce by providing powerful, easy-to-use tools that enable anyone to build and manage successful online stores from a single dashboard.\"}, {\"icon\": \"heart\", \"title\": \"Our Values\", \"description\": \"We believe in innovation, scalability, and empowering entrepreneurs to achieve e-commerce success through cutting-edge multi-store technology.\"}, {\"icon\": \"award\", \"title\": \"Our Commitment\", \"description\": \"Delivering exceptional multi-store management experience with enterprise-grade security, 99.9% uptime, and 24/7 dedicated support.\"}, {\"icon\": \"lightbulb\", \"title\": \"Our Vision\", \"description\": \"A world where every entrepreneur can easily create, manage, and scale multiple profitable online stores without technical barriers or limitations.\"}], \"description\": \"We are passionate about empowering entrepreneurs to build and scale successful multi-store e-commerce businesses with cutting-edge technology.\", \"story_title\": \"Revolutionizing Multi-Store E-commerce Since 2020\", \"story_content\": \"Founded by e-commerce experts and technology innovators, WhatsStore was created to solve the complex challenges of managing multiple online stores. Our platform enables entrepreneurs to build, customize, and scale their store empire from a single powerful dashboard.\", \"background_color\": \"#f9fafb\"}, {\"key\": \"team\", \"title\": \"Meet Our WhatsStore Team\", \"members\": [{\"bio\": \"E-commerce visionary with 12+ years building scalable SaaS platforms. Former CTO at leading retail tech companies.\", \"name\": \"Alex Rodriguez\", \"role\": \"CEO & Founder\", \"email\": \"alex@whatsstore.com\", \"image\": \"\", \"twitter\": \"#\", \"linkedin\": \"#\"}, {\"bio\": \"Full-stack architect specializing in multi-tenant SaaS solutions. Expert in cloud infrastructure and scalable systems.\", \"name\": \"Sarah Chen\", \"role\": \"CTO & Co-Founder\", \"email\": \"sarah@whatsstore.com\", \"image\": \"\", \"github\": \"#\", \"linkedin\": \"#\"}, {\"bio\": \"Product strategist with deep e-commerce expertise. Led product teams at major online marketplace platforms.\", \"name\": \"Michael Thompson\", \"role\": \"Head of Product\", \"email\": \"michael@whatsstore.com\", \"image\": \"\", \"twitter\": \"#\", \"linkedin\": \"#\"}, {\"bio\": \"Engineering leader passionate about building robust, scalable multi-store management solutions.\", \"name\": \"Emily Davis\", \"role\": \"VP of Engineering\", \"email\": \"emily@whatsstore.com\", \"image\": \"\", \"github\": \"#\", \"linkedin\": \"#\"}], \"subtitle\": \"Passionate experts dedicated to revolutionizing multi-store e-commerce management.\", \"cta_title\": \"Join Our Growing Team\", \"cta_button_text\": \"View Career Opportunities\", \"cta_description\": \"Help us build the future of multi-store e-commerce platforms.\"}, {\"key\": \"testimonials\", \"title\": \"What Our Store Owners Say\", \"subtitle\": \"Real success stories from WhatsStore merchants worldwide.\", \"trust_stats\": [{\"color\": \"green\", \"label\": \"Customer Rating\", \"value\": \"4.9/5\"}, {\"color\": \"green\", \"label\": \"Active Stores\", \"value\": \"15K+\"}, {\"color\": \"green\", \"label\": \"Uptime\", \"value\": \"99.9%\"}, {\"color\": \"green\", \"label\": \"Support\", \"value\": \"24/7\"}], \"trust_title\": \"Trusted by E-commerce Entrepreneurs\", \"testimonials\": [{\"name\": \"Maria Rodriguez\", \"role\": \"Fashion Store Owner\", \"image\": \"\", \"rating\": 5, \"company\": \"Bella Boutique\", \"content\": \"WhatsStore transformed my business! I now manage 4 fashion stores effortlessly from one dashboard. Sales increased 300% in 6 months.\", \"location\": \"Miami, FL\"}, {\"name\": \"James Chen\", \"role\": \"Electronics Retailer\", \"image\": \"\", \"rating\": 5, \"company\": \"TechHub Pro\", \"content\": \"The multi-store analytics are incredible. I can track performance across all 7 of my electronics stores in real-time. Game changer!\", \"location\": \"San Francisco, CA\"}, {\"name\": \"Sophie Williams\", \"role\": \"Home Decor Entrepreneur\", \"image\": \"\", \"rating\": 5, \"company\": \"Cozy Living Co\", \"content\": \"Started with 1 store, now running 5 successful home decor shops. WhatsStore made scaling so simple and profitable.\", \"location\": \"Austin, TX\"}]}, {\"key\": \"active_campaigns\", \"title\": \"Featured Business Promotions\", \"subtitle\": \"Explore businesses we\'re currently promoting and discover amazing services\", \"max_display\": 6, \"show_view_all\": true, \"background_color\": \"#f8fafc\"}, {\"key\": \"plans\", \"title\": \"Choose Your Plan\", \"faq_text\": \"Have questions about our plans? Contact our sales team\", \"subtitle\": \"Start with our free plan and upgrade as you grow.\"}, {\"key\": \"faq\", \"faqs\": [{\"answer\": \"WhatsStore allows you to create and manage unlimited online stores from a single dashboard. Each store can have different themes, products, and settings while sharing centralized inventory and customer management.\", \"question\": \"How does WhatsStore multi-store management work?\"}, {\"answer\": \"Yes! WhatsStore offers 7+ professional themes. You can assign different themes to each store - fashion theme for clothing stores, electronics theme for gadget stores, etc. Switch themes anytime without losing data.\", \"question\": \"Can I use different themes for each store?\"}, {\"answer\": \"WhatsStore supports 30+ payment gateways including Stripe, PayPal, Razorpay, Square, and many regional providers. You can enable different payment methods for different stores based on your target markets.\", \"question\": \"What payment gateways are supported?\"}, {\"answer\": \"Our centralized inventory system lets you manage stock across all stores. Set different stock levels per store, enable auto-sync, or manage inventory independently. Get low-stock alerts and automated reorder notifications.\", \"question\": \"How does inventory management work across multiple stores?\"}], \"title\": \"Frequently Asked Questions\", \"cta_text\": \"Still have questions?\", \"subtitle\": \"Got questions? We\'ve got answers.\", \"button_text\": \"Contact Support\"}, {\"key\": \"newsletter\", \"title\": \"Stay Updated with WhatsStore\", \"benefits\": [{\"icon\": \"📧\", \"title\": \"Weekly Insights\", \"description\": \"Multi-store management tips and best practices\"}, {\"icon\": \"🚀\", \"title\": \"Feature Updates\", \"description\": \"First access to new WhatsStore features\"}, {\"icon\": \"📊\", \"title\": \"Growth Strategies\", \"description\": \"Proven tactics to scale your store empire\"}], \"subtitle\": \"Get exclusive multi-store e-commerce insights, platform updates, and growth strategies.\", \"privacy_text\": \"No spam, unsubscribe at any time. Your privacy is protected.\"}, {\"key\": \"contact\", \"email\": \"support@whatsstore.com\", \"phone\": \"+1 (555) 123-4567\", \"title\": \"Get in Touch with WhatsStore\", \"layout\": \"split\", \"address\": \"123 Business Ave, Suite 100, San Francisco, CA 94105\", \"subtitle\": \"Ready to build your multi-store empire? Have questions? We\'re here to help you succeed.\", \"timezone\": \"Pacific Standard Time\", \"form_title\": \"Send us a Message\", \"info_title\": \"Contact Information\", \"sales_email\": \"sales@whatsstore.com\", \"contact_faqs\": [{\"answer\": \"You can reach us via email at support@whatsstore.com, phone at +1 (555) 123-4567, or use our live chat feature available 24/7 on our website.\", \"question\": \"How can I contact WhatsStore support?\"}, {\"answer\": \"Our support team is available Monday through Friday, 9:00 AM to 6:00 PM PST. We typically respond to emails within 2 hours during business hours.\", \"question\": \"What are your business hours?\"}, {\"answer\": \"Yes! Call us at +1 (555) 123-4567 during business hours for immediate assistance with your WhatsStore account and technical questions.\", \"question\": \"Do you offer phone support?\"}, {\"answer\": \"Our headquarters is located at 123 Business Ave, Suite 100, San Francisco, CA 94105. You can visit us during business hours or schedule an appointment.\", \"question\": \"Where is WhatsStore located?\"}], \"office_hours\": \"9:00 AM - 6:00 PM PST\", \"contact_title\": \"Contact Information\", \"response_time\": \"We typically respond within 2 hours during business hours\", \"section_title\": \"Contact Information\", \"support_email\": \"support@whatsstore.com\", \"business_hours\": \"Monday - Friday: 9:00 AM - 6:00 PM PST\", \"background_color\": \"#f9fafb\", \"info_description\": \"Our team is ready to help you launch and scale your multi-store business.\", \"contact_description\": \"Our team is ready to help you launch and scale your multi-store business.\", \"section_description\": \"Our team is ready to help you launch and scale your multi-store business.\"}, {\"key\": \"footer\", \"links\": {\"legal\": [{\"href\": \"/privacy-policy\", \"name\": \"Privacy Policy\"}, {\"href\": \"/terms-of-service\", \"name\": \"Terms of Service\"}, {\"href\": \"/cookie-policy\", \"name\": \"Cookie Policy\"}, {\"href\": \"/gdpr\", \"name\": \"GDPR Compliance\"}, {\"href\": \"/refund-policy\", \"name\": \"Refund Policy\"}], \"company\": [{\"href\": \"/#about\", \"name\": \"About Us\"}, {\"href\": \"/#contact\", \"name\": \"Contact\"}, {\"href\": \"/careers\", \"name\": \"Careers\"}, {\"href\": \"/press\", \"name\": \"Press Kit\"}, {\"href\": \"/partners\", \"name\": \"Partners\"}], \"product\": [{\"href\": \"/#features\", \"name\": \"Features\"}, {\"href\": \"/#pricing\", \"name\": \"Pricing\"}, {\"href\": \"/#themes\", \"name\": \"Store Themes\"}, {\"href\": \"/docs\", \"name\": \"Documentation\"}, {\"href\": \"/api-docs\", \"name\": \"API\"}], \"support\": [{\"href\": \"/help\", \"name\": \"Help Center\"}, {\"href\": \"/community\", \"name\": \"Community\"}, {\"href\": \"/support\", \"name\": \"Support Tickets\"}, {\"href\": \"/status\", \"name\": \"System Status\"}, {\"href\": \"/updates\", \"name\": \"Updates\"}]}, \"description\": \"Empowering entrepreneurs with powerful multi-store e-commerce solutions.\", \"social_links\": [{\"href\": \"https://facebook.com/whatsstore\", \"icon\": \"Facebook\", \"name\": \"Facebook\"}, {\"href\": \"https://twitter.com/whatsstore\", \"icon\": \"Twitter\", \"name\": \"Twitter\"}, {\"href\": \"https://linkedin.com/company/whatsstore\", \"icon\": \"LinkedIn\", \"name\": \"LinkedIn\"}, {\"href\": \"https://instagram.com/whatsstore\", \"icon\": \"Instagram\", \"name\": \"Instagram\"}, {\"href\": \"https://youtube.com/whatsstore\", \"icon\": \"YouTube\", \"name\": \"YouTube\"}], \"section_titles\": {\"legal\": \"Legal\", \"company\": \"Company\", \"product\": \"Product\", \"support\": \"Support\"}, \"newsletter_title\": \"Stay Updated\", \"newsletter_subtitle\": \"Join our newsletter for updates\"}], \"custom_js\": \"\", \"custom_css\": \"\", \"section_order\": [\"header\", \"hero\", \"features\", \"screenshots\", \"themes\", \"why_choose_us\", \"about\", \"team\", \"testimonials\", \"active_campaigns\", \"plans\", \"faq\", \"newsletter\", \"contact\", \"footer\"], \"section_visibility\": {\"faq\": true, \"hero\": true, \"team\": true, \"about\": true, \"plans\": true, \"footer\": true, \"header\": true, \"themes\": true, \"contact\": true, \"features\": true, \"newsletter\": true, \"screenshots\": true, \"testimonials\": true, \"why_choose_us\": true, \"active_campaigns\": true}}','2026-04-02 10:39:27','2026-04-02 10:39:27');
/*!40000 ALTER TABLE `landing_page_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `landing_pages`
--

DROP TABLE IF EXISTS `landing_pages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `landing_pages` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Landing Page',
  `layout` json DEFAULT NULL,
  `global_settings` json DEFAULT NULL,
  `is_published` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `landing_pages`
--

LOCK TABLES `landing_pages` WRITE;
/*!40000 ALTER TABLE `landing_pages` DISABLE KEYS */;
/*!40000 ALTER TABLE `landing_pages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `media`
--

DROP TABLE IF EXISTS `media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `media` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `model_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` bigint unsigned NOT NULL,
  `uuid` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `collection_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mime_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `disk` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `conversions_disk` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `size` bigint unsigned NOT NULL,
  `manipulations` json NOT NULL,
  `custom_properties` json NOT NULL,
  `generated_conversions` json NOT NULL,
  `responsive_images` json NOT NULL,
  `order_column` int unsigned DEFAULT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `media_uuid_unique` (`uuid`),
  KEY `media_model_type_model_id_index` (`model_type`,`model_id`),
  KEY `media_user_id_foreign` (`user_id`),
  KEY `media_order_column_index` (`order_column`),
  CONSTRAINT `media_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `media`
--

LOCK TABLES `media` WRITE;
/*!40000 ALTER TABLE `media` DISABLE KEYS */;
/*!40000 ALTER TABLE `media` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `media_items`
--

DROP TABLE IF EXISTS `media_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `media_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `media_items`
--

LOCK TABLES `media_items` WRITE;
/*!40000 ALTER TABLE `media_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `media_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2024_01_01_000001_create_landing_pages_table',1),(5,'2024_07_17_000001_create_stores_table',1),(6,'2025_01_15_000001_create_notifications_table',1),(7,'2025_01_15_000002_create_notification_template_langs_table',1),(8,'2025_01_27_084150_create_landing_page_settings_table',1),(9,'2025_01_28_000001_create_webhooks_table',1),(10,'2025_01_30_083444_create_customers_table',1),(11,'2025_01_31_000001_create_newsletters_table',1),(12,'2025_01_31_000002_create_contacts_table',1),(13,'2025_01_31_020641_create_taxes_table',1),(14,'2025_01_31_041251_create_categories_table',1),(15,'2025_01_31_043555_create_products_table',1),(16,'2025_01_31_062413_create_shippings_table',1),(17,'2025_01_31_083511_create_customer_addresses_table',1),(18,'2025_01_31_120000_create_orders_table',1),(19,'2025_01_31_120001_create_order_items_table',1),(20,'2025_02_01_000000_create_wishlist_items_table',1),(21,'2025_02_02_000001_create_store_settings_table',1),(22,'2025_02_03_000001_create_countries_table',1),(23,'2025_02_03_000002_create_states_table',1),(24,'2025_02_03_000003_create_cities_table',1),(25,'2025_05_25_000000_create_permission_tables',1),(26,'2025_06_18_000001_create_plans_table',1),(27,'2025_06_18_000004_add_plan_id_foreign_key',1),(28,'2025_06_18_105755_create_settings_table',1),(29,'2025_06_19_051735_create_coupons_table',1),(30,'2025_06_19_084856_create_plan_requests_table',1),(31,'2025_06_19_085023_create_plan_orders_table',1),(32,'2025_06_20_044143_create_referral_settings_table',1),(33,'2025_06_20_044158_create_referrals_table',1),(34,'2025_06_20_044206_create_payout_requests_table',1),(35,'2025_06_24_044208_create_currencies_table',1),(36,'2025_06_25_061851_add_created_by_to_roles_table',1),(37,'2025_06_26_000000_fix_roles_unique_constraint',1),(38,'2025_06_26_100501_create_payment_settings_table',1),(39,'2025_06_27_053245_create_media_table',1),(40,'2025_06_27_060535_create_media_items_table',1),(41,'2025_06_27_115807_create_email_templates_table',1),(42,'2025_06_27_115820_create_email_template_langs_table',1),(43,'2025_06_27_115828_create_user_email_templates_table',1),(44,'2025_07_02_094334_create_landing_page_custom_pages_table',1),(45,'2025_07_04_000001_update_plans_table_structure',1),(46,'2025_07_18_071850_create_store_coupons_table',1),(47,'2025_07_21_094201_create_express_checkouts_table',1),(48,'2025_07_25_072209_create_cart_items_table',1),(49,'2025_08_06_104003_create_store_configurations_table',1),(50,'2025_08_20_091433_add_duration_to_plan_requests_table',1),(51,'2025_09_12_124107_add_tax_details_to_order_items_table',1),(52,'2026_03_13_000001_add_plan_duration_to_users_table',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `model_has_permissions`
--

DROP TABLE IF EXISTS `model_has_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `model_has_permissions` (
  `permission_id` bigint unsigned NOT NULL,
  `model_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`permission_id`,`model_id`,`model_type`),
  KEY `model_has_permissions_model_id_model_type_index` (`model_id`,`model_type`),
  CONSTRAINT `model_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `model_has_permissions`
--

LOCK TABLES `model_has_permissions` WRITE;
/*!40000 ALTER TABLE `model_has_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `model_has_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `model_has_roles`
--

DROP TABLE IF EXISTS `model_has_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `model_has_roles` (
  `role_id` bigint unsigned NOT NULL,
  `model_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`role_id`,`model_id`,`model_type`),
  KEY `model_has_roles_model_id_model_type_index` (`model_id`,`model_type`),
  CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `model_has_roles`
--

LOCK TABLES `model_has_roles` WRITE;
/*!40000 ALTER TABLE `model_has_roles` DISABLE KEYS */;
INSERT INTO `model_has_roles` VALUES (1,'App\\Models\\User',1),(2,'App\\Models\\User',2);
/*!40000 ALTER TABLE `model_has_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `newsletters`
--

DROP TABLE IF EXISTS `newsletters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `newsletters` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('active','unsubscribed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `subscribed_at` timestamp NULL DEFAULT NULL,
  `unsubscribed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `newsletters_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `newsletters`
--

LOCK TABLES `newsletters` WRITE;
/*!40000 ALTER TABLE `newsletters` DISABLE KEYS */;
/*!40000 ALTER TABLE `newsletters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification_template_langs`
--

DROP TABLE IF EXISTS `notification_template_langs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification_template_langs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `parent_id` bigint unsigned NOT NULL,
  `lang` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `variables` text COLLATE utf8mb4_unicode_ci,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `notification_template_langs_parent_id_foreign` (`parent_id`),
  CONSTRAINT `notification_template_langs_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `notifications` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification_template_langs`
--

LOCK TABLES `notification_template_langs` WRITE;
/*!40000 ALTER TABLE `notification_template_langs` DISABLE KEYS */;
INSERT INTO `notification_template_langs` VALUES (1,1,'en','{\"company_name\": \"company_name\", \"store_name\": \"store_name\", \"order_number\": \"order_number\", \"customer_name\": \"customer_name\"}','New order #{order_number} created for {customer_name} at {store_name} by {company_name}.','2026-04-02 10:31:09','2026-04-02 10:31:09'),(2,1,'es','{\"company_name\": \"company_name\", \"store_name\": \"store_name\", \"order_number\": \"order_number\", \"customer_name\": \"customer_name\"}','Nueva orden #{order_number} creada para {customer_name} en {store_name} por {company_name}.','2026-04-02 10:31:09','2026-04-02 10:31:09'),(3,1,'ar','{\"company_name\": \"company_name\", \"store_name\": \"store_name\", \"order_number\": \"order_number\", \"customer_name\": \"customer_name\"}','طلب جديد #{order_number} تم إنشاؤه لـ {customer_name} في {store_name} بواسطة {company_name}.','2026-04-02 10:31:09','2026-04-02 10:31:09'),(4,1,'da','{\"company_name\": \"company_name\", \"store_name\": \"store_name\", \"order_number\": \"order_number\", \"customer_name\": \"customer_name\"}','Ny ordre #{order_number} oprettet for {customer_name} hos {store_name} af {company_name}.','2026-04-02 10:31:09','2026-04-02 10:31:09'),(5,1,'de','{\"company_name\": \"company_name\", \"store_name\": \"store_name\", \"order_number\": \"order_number\", \"customer_name\": \"customer_name\"}','Neue Bestellung #{order_number} für {customer_name} bei {store_name} von {company_name} erstellt.','2026-04-02 10:31:09','2026-04-02 10:31:09'),(6,1,'fr','{\"company_name\": \"company_name\", \"store_name\": \"store_name\", \"order_number\": \"order_number\", \"customer_name\": \"customer_name\"}','Nouvelle commande #{order_number} créée pour {customer_name} chez {store_name} par {company_name}.','2026-04-02 10:31:09','2026-04-02 10:31:09'),(7,1,'he','{\"company_name\": \"company_name\", \"store_name\": \"store_name\", \"order_number\": \"order_number\", \"customer_name\": \"customer_name\"}','הזמנה חדשה #{order_number} נוצרה עבור {customer_name} ב-{store_name} על ידי {company_name}.','2026-04-02 10:31:09','2026-04-02 10:31:09'),(8,1,'it','{\"company_name\": \"company_name\", \"store_name\": \"store_name\", \"order_number\": \"order_number\", \"customer_name\": \"customer_name\"}','Nuovo ordine #{order_number} creato per {customer_name} presso {store_name} da {company_name}.','2026-04-02 10:31:09','2026-04-02 10:31:09'),(9,1,'ja','{\"company_name\": \"company_name\", \"store_name\": \"store_name\", \"order_number\": \"order_number\", \"customer_name\": \"customer_name\"}','新しい注文 #{order_number} が {customer_name} のために {store_name} で {company_name} によって作成されました。','2026-04-02 10:31:09','2026-04-02 10:31:09'),(10,1,'nl','{\"company_name\": \"company_name\", \"store_name\": \"store_name\", \"order_number\": \"order_number\", \"customer_name\": \"customer_name\"}','Nieuwe bestelling #{order_number} aangemaakt voor {customer_name} bij {store_name} door {company_name}.','2026-04-02 10:31:09','2026-04-02 10:31:09'),(11,1,'pl','{\"company_name\": \"company_name\", \"store_name\": \"store_name\", \"order_number\": \"order_number\", \"customer_name\": \"customer_name\"}','Nowe zamówienie #{order_number} utworzone dla {customer_name} w {store_name} przez {company_name}.','2026-04-02 10:31:09','2026-04-02 10:31:09'),(12,1,'pt','{\"company_name\": \"company_name\", \"store_name\": \"store_name\", \"order_number\": \"order_number\", \"customer_name\": \"customer_name\"}','Novo pedido #{order_number} criado para {customer_name} em {store_name} por {company_name}.','2026-04-02 10:31:09','2026-04-02 10:31:09'),(13,1,'pt-BR','{\"company_name\": \"company_name\", \"store_name\": \"store_name\", \"order_number\": \"order_number\", \"customer_name\": \"customer_name\"}','Novo pedido #{order_number} criado para {customer_name} em {store_name} por {company_name}.','2026-04-02 10:31:09','2026-04-02 10:31:09'),(14,1,'ru','{\"company_name\": \"company_name\", \"store_name\": \"store_name\", \"order_number\": \"order_number\", \"customer_name\": \"customer_name\"}','Новый заказ #{order_number} создан для {customer_name} в {store_name} компанией {company_name}.','2026-04-02 10:31:09','2026-04-02 10:31:09'),(15,1,'tr','{\"company_name\": \"company_name\", \"store_name\": \"store_name\", \"order_number\": \"order_number\", \"customer_name\": \"customer_name\"}','Yeni sipariş #{order_number}, {customer_name} için {store_name} mağazasında {company_name} tarafından oluşturuldu.','2026-04-02 10:31:09','2026-04-02 10:31:09'),(16,1,'zh','{\"company_name\": \"company_name\", \"store_name\": \"store_name\", \"order_number\": \"order_number\", \"customer_name\": \"customer_name\"}','新订单 #{order_number} 已为 {customer_name} 在 {store_name} 由 {company_name} 创建。','2026-04-02 10:31:09','2026-04-02 10:31:09'),(17,2,'en','{\"company_name\": \"company_name\", \"store_name\": \"store_name\", \"order_number\": \"order_number\", \"status\": \"status\"}','Order #{order_number} status updated to {status} at {store_name} by {company_name}.','2026-04-02 10:31:09','2026-04-02 10:31:09'),(18,2,'es','{\"company_name\": \"company_name\", \"store_name\": \"store_name\", \"order_number\": \"order_number\", \"status\": \"status\"}','Estado de la orden #{order_number} actualizado a {status} en {store_name} por {company_name}.','2026-04-02 10:31:09','2026-04-02 10:31:09'),(19,2,'ar','{\"company_name\": \"company_name\", \"store_name\": \"store_name\", \"order_number\": \"order_number\", \"status\": \"status\"}','تم تحديث حالة الطلب #{order_number} إلى {status} في {store_name} بواسطة {company_name}.','2026-04-02 10:31:09','2026-04-02 10:31:09'),(20,2,'da','{\"company_name\": \"company_name\", \"store_name\": \"store_name\", \"order_number\": \"order_number\", \"status\": \"status\"}','Ordre #{order_number} status opdateret til {status} hos {store_name} af {company_name}.','2026-04-02 10:31:09','2026-04-02 10:31:09'),(21,2,'de','{\"company_name\": \"company_name\", \"store_name\": \"store_name\", \"order_number\": \"order_number\", \"status\": \"status\"}','Bestellstatus #{order_number} auf {status} bei {store_name} von {company_name} aktualisiert.','2026-04-02 10:31:09','2026-04-02 10:31:09'),(22,2,'fr','{\"company_name\": \"company_name\", \"store_name\": \"store_name\", \"order_number\": \"order_number\", \"status\": \"status\"}','Statut de la commande #{order_number} mis à jour vers {status} chez {store_name} par {company_name}.','2026-04-02 10:31:09','2026-04-02 10:31:09'),(23,2,'he','{\"company_name\": \"company_name\", \"store_name\": \"store_name\", \"order_number\": \"order_number\", \"status\": \"status\"}','סטטוס הזמנה #{order_number} עודכן ל-{status} ב-{store_name} על ידי {company_name}.','2026-04-02 10:31:09','2026-04-02 10:31:09'),(24,2,'it','{\"company_name\": \"company_name\", \"store_name\": \"store_name\", \"order_number\": \"order_number\", \"status\": \"status\"}','Stato ordine #{order_number} aggiornato a {status} presso {store_name} da {company_name}.','2026-04-02 10:31:09','2026-04-02 10:31:09'),(25,2,'ja','{\"company_name\": \"company_name\", \"store_name\": \"store_name\", \"order_number\": \"order_number\", \"status\": \"status\"}','注文 #{order_number} のステータスが {store_name} で {company_name} によって {status} に更新されました。','2026-04-02 10:31:09','2026-04-02 10:31:09'),(26,2,'nl','{\"company_name\": \"company_name\", \"store_name\": \"store_name\", \"order_number\": \"order_number\", \"status\": \"status\"}','Bestelstatus #{order_number} bijgewerkt naar {status} bij {store_name} door {company_name}.','2026-04-02 10:31:09','2026-04-02 10:31:09'),(27,2,'pl','{\"company_name\": \"company_name\", \"store_name\": \"store_name\", \"order_number\": \"order_number\", \"status\": \"status\"}','Status zamówienia #{order_number} zaktualizowany do {status} w {store_name} przez {company_name}.','2026-04-02 10:31:09','2026-04-02 10:31:09'),(28,2,'pt','{\"company_name\": \"company_name\", \"store_name\": \"store_name\", \"order_number\": \"order_number\", \"status\": \"status\"}','Status do pedido #{order_number} atualizado para {status} em {store_name} por {company_name}.','2026-04-02 10:31:09','2026-04-02 10:31:09'),(29,2,'pt-BR','{\"company_name\": \"company_name\", \"store_name\": \"store_name\", \"order_number\": \"order_number\", \"status\": \"status\"}','Status do pedido #{order_number} atualizado para {status} em {store_name} por {company_name}.','2026-04-02 10:31:09','2026-04-02 10:31:09'),(30,2,'ru','{\"company_name\": \"company_name\", \"store_name\": \"store_name\", \"order_number\": \"order_number\", \"status\": \"status\"}','Статус заказа #{order_number} обновлен на {status} в {store_name} компанией {company_name}.','2026-04-02 10:31:09','2026-04-02 10:31:09'),(31,2,'tr','{\"company_name\": \"company_name\", \"store_name\": \"store_name\", \"order_number\": \"order_number\", \"status\": \"status\"}','Sipariş #{order_number} durumu {store_name} mağazasında {company_name} tarafından {status} olarak güncellendi.','2026-04-02 10:31:09','2026-04-02 10:31:09'),(32,2,'zh','{\"company_name\": \"company_name\", \"store_name\": \"store_name\", \"order_number\": \"order_number\", \"status\": \"status\"}','订单 #{order_number} 状态已在 {store_name} 由 {company_name} 更新为 {status}。','2026-04-02 10:31:09','2026-04-02 10:31:09'),(33,3,'en','{\"company_name\": \"company_name\", \"store_name\": \"store_name\", \"customer_name\": \"customer_name\"}','Welcome {customer_name}! You have successfully registered at {store_name} by {company_name}.','2026-04-02 10:31:09','2026-04-02 10:31:09'),(34,3,'es','{\"company_name\": \"company_name\", \"store_name\": \"store_name\", \"customer_name\": \"customer_name\"}','¡Bienvenido {customer_name}! Te has registrado exitosamente en {store_name} por {company_name}.','2026-04-02 10:31:09','2026-04-02 10:31:09'),(35,3,'ar','{\"company_name\": \"company_name\", \"store_name\": \"store_name\", \"customer_name\": \"customer_name\"}','مرحباً {customer_name}! لقد تم تسجيلك بنجاح في {store_name} بواسطة {company_name}.','2026-04-02 10:31:09','2026-04-02 10:31:09'),(36,3,'da','{\"company_name\": \"company_name\", \"store_name\": \"store_name\", \"customer_name\": \"customer_name\"}','Velkommen {customer_name}! Du har registreret dig hos {store_name} af {company_name}.','2026-04-02 10:31:09','2026-04-02 10:31:09'),(37,3,'de','{\"company_name\": \"company_name\", \"store_name\": \"store_name\", \"customer_name\": \"customer_name\"}','Willkommen {customer_name}! Sie haben sich erfolgreich bei {store_name} von {company_name} registriert.','2026-04-02 10:31:09','2026-04-02 10:31:09'),(38,3,'fr','{\"company_name\": \"company_name\", \"store_name\": \"store_name\", \"customer_name\": \"customer_name\"}','Bienvenue {customer_name}! Vous vous êtes inscrit avec succès chez {store_name} par {company_name}.','2026-04-02 10:31:09','2026-04-02 10:31:09'),(39,3,'he','{\"company_name\": \"company_name\", \"store_name\": \"store_name\", \"customer_name\": \"customer_name\"}','ברוכים הבאים {customer_name}! נרשמת בהצלחה ב-{store_name} על ידי {company_name}.','2026-04-02 10:31:09','2026-04-02 10:31:09'),(40,3,'it','{\"company_name\": \"company_name\", \"store_name\": \"store_name\", \"customer_name\": \"customer_name\"}','Benvenuto {customer_name}! Ti sei registrato con successo presso {store_name} da {company_name}.','2026-04-02 10:31:09','2026-04-02 10:31:09'),(41,3,'ja','{\"company_name\": \"company_name\", \"store_name\": \"store_name\", \"customer_name\": \"customer_name\"}','ようこそ {customer_name}! {company_name} の {store_name} に正常に登録されました。','2026-04-02 10:31:09','2026-04-02 10:31:09'),(42,3,'nl','{\"company_name\": \"company_name\", \"store_name\": \"store_name\", \"customer_name\": \"customer_name\"}','Welkom {customer_name}! Je hebt je succesvol geregistreerd bij {store_name} door {company_name}.','2026-04-02 10:31:09','2026-04-02 10:31:09'),(43,3,'pl','{\"company_name\": \"company_name\", \"store_name\": \"store_name\", \"customer_name\": \"customer_name\"}','Witamy {customer_name}! Pomyślnie zarejestrowaliś się w {store_name} przez {company_name}.','2026-04-02 10:31:09','2026-04-02 10:31:09'),(44,3,'pt','{\"company_name\": \"company_name\", \"store_name\": \"store_name\", \"customer_name\": \"customer_name\"}','Bem-vindo {customer_name}! Você se registrou com sucesso em {store_name} por {company_name}.','2026-04-02 10:31:09','2026-04-02 10:31:09'),(45,3,'pt-BR','{\"company_name\": \"company_name\", \"store_name\": \"store_name\", \"customer_name\": \"customer_name\"}','Bem-vindo {customer_name}! Você se registrou com sucesso em {store_name} por {company_name}.','2026-04-02 10:31:09','2026-04-02 10:31:09'),(46,3,'ru','{\"company_name\": \"company_name\", \"store_name\": \"store_name\", \"customer_name\": \"customer_name\"}','Добро пожаловать {customer_name}! Вы успешно зарегистрировались в {store_name} компанией {company_name}.','2026-04-02 10:31:09','2026-04-02 10:31:09'),(47,3,'tr','{\"company_name\": \"company_name\", \"store_name\": \"store_name\", \"customer_name\": \"customer_name\"}','Hoş geldiniz {customer_name}! {company_name} tarafından {store_name} mağazasına başarıyla kayıt oldunuz.','2026-04-02 10:31:09','2026-04-02 10:31:09'),(48,3,'zh','{\"company_name\": \"company_name\", \"store_name\": \"store_name\", \"customer_name\": \"customer_name\"}','欢迎 {customer_name}! 您已成功在 {company_name} 的 {store_name} 注册。','2026-04-02 10:31:09','2026-04-02 10:31:09');
/*!40000 ALTER TABLE `notification_template_langs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `action` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('on','off') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'on',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,'SMS','Order Created','on','2026-04-02 10:31:09','2026-04-02 10:31:09'),(2,'SMS','Order Status Updated','on','2026-04-02 10:31:09','2026-04-02 10:31:09'),(3,'SMS','New Customer','on','2026-04-02 10:31:09','2026-04-02 10:31:09');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned NOT NULL,
  `product_id` bigint unsigned NOT NULL,
  `product_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_sku` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `product_price` decimal(10,2) NOT NULL,
  `quantity` int NOT NULL,
  `product_variants` json DEFAULT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `tax_details` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_items_order_id_index` (`order_id`),
  KEY `order_items_product_id_index` (`product_id`),
  CONSTRAINT `order_items_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `store_id` bigint unsigned NOT NULL,
  `customer_id` bigint unsigned DEFAULT NULL,
  `session_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('pending','confirmed','processing','shipped','delivered','cancelled','refunded') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `payment_status` enum('pending','paid','failed','refunded','partially_refunded') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `customer_email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `customer_first_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_last_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `shipping_address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `shipping_city` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `shipping_state` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `shipping_postal_code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `shipping_country` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `billing_address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `billing_city` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `billing_state` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `billing_postal_code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `billing_country` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `tax_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `shipping_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `discount_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `total_amount` decimal(10,2) NOT NULL,
  `payment_method` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `whatsapp_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_transaction_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_details` json DEFAULT NULL,
  `bank_transfer_receipt` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shipping_method_id` bigint unsigned DEFAULT NULL,
  `tracking_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shipped_at` timestamp NULL DEFAULT NULL,
  `delivered_at` timestamp NULL DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `coupon_code` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `coupon_discount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `orders_order_number_unique` (`order_number`),
  KEY `orders_shipping_method_id_foreign` (`shipping_method_id`),
  KEY `orders_store_id_status_index` (`store_id`,`status`),
  KEY `orders_customer_id_index` (`customer_id`),
  KEY `orders_order_number_index` (`order_number`),
  CONSTRAINT `orders_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL,
  CONSTRAINT `orders_shipping_method_id_foreign` FOREIGN KEY (`shipping_method_id`) REFERENCES `shippings` (`id`) ON DELETE SET NULL,
  CONSTRAINT `orders_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_settings`
--

DROP TABLE IF EXISTS `payment_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_settings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `store_id` bigint unsigned DEFAULT NULL,
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `payment_settings_user_id_key_store_id_unique` (`user_id`,`key`,`store_id`),
  KEY `payment_settings_store_id_foreign` (`store_id`),
  KEY `payment_settings_user_id_key_index` (`user_id`,`key`),
  CONSTRAINT `payment_settings_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE,
  CONSTRAINT `payment_settings_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_settings`
--

LOCK TABLES `payment_settings` WRITE;
/*!40000 ALTER TABLE `payment_settings` DISABLE KEYS */;
INSERT INTO `payment_settings` VALUES (1,2,1,'is_whatsapp_enabled','0','2026-04-02 10:31:08','2026-04-02 10:31:08'),(2,2,1,'whatsapp_phone_number','','2026-04-02 10:31:08','2026-04-02 10:31:08'),(3,2,1,'is_telegram_enabled','0','2026-04-02 10:31:08','2026-04-02 10:31:08'),(4,2,1,'telegram_bot_token','','2026-04-02 10:31:08','2026-04-02 10:31:08'),(5,2,1,'telegram_chat_id','','2026-04-02 10:31:08','2026-04-02 10:31:08'),(6,2,1,'messaging_message_template','Your order #{order_no} from {store_name} 🛍️\\n\\nHi {customer_name}!\\n\\nYour order has been confirmed!\\n\\n📦 Items ({qty_total} items):\\n{item_variable}\\n\\n💰 Order Summary:\\nSubtotal: {sub_total}\\nDiscount: {discount_amount}\\nShipping: {shipping_amount}\\nTax: {total_tax}\\nTotal: {final_total}\\n\\n🚚 Shipping Address:\\n{shipping_address}\\n{shipping_city}, {shipping_country} - {shipping_postalcode}\\n\\nThank you for shopping with us!','2026-04-02 10:31:08','2026-04-02 10:31:08'),(7,2,1,'messaging_item_template','• {product_name} ({variant_name})\\n  Qty: {quantity}\\n  Price: {item_total} (Tax: {item_tax})\\n  SKU: {sku}','2026-04-02 10:31:08','2026-04-02 10:31:08'),(8,2,1,'messaging_order_variables','[\"store_name\",\"order_no\",\"customer_name\",\"shipping_address\",\"shipping_country\",\"shipping_city\",\"shipping_postalcode\",\"item_variable\",\"qty_total\",\"sub_total\",\"discount_amount\",\"shipping_amount\",\"total_tax\",\"final_total\"]','2026-04-02 10:31:08','2026-04-02 10:31:08'),(9,2,1,'messaging_item_variables','[\"sku\",\"quantity\",\"product_name\",\"variant_name\",\"item_tax\",\"item_total\"]','2026-04-02 10:31:08','2026-04-02 10:31:08');
/*!40000 ALTER TABLE `payment_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payout_requests`
--

DROP TABLE IF EXISTS `payout_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payout_requests` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `company_id` bigint unsigned NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('pending','approved','rejected') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `payout_requests_company_id_foreign` (`company_id`),
  CONSTRAINT `payout_requests_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payout_requests`
--

LOCK TABLES `payout_requests` WRITE;
/*!40000 ALTER TABLE `payout_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `payout_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `module` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guard_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `label` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `permissions_name_guard_name_unique` (`name`,`guard_name`)
) ENGINE=InnoDB AUTO_INCREMENT=163 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` VALUES (1,'dashboard','manage-dashboard','web','Manage Dashboard','Can access dashboard','2026-04-02 10:31:05','2026-04-02 10:31:05'),(2,'dashboard','export-dashboard','web','Export Dashboard','Can export dashboard data','2026-04-02 10:31:05','2026-04-02 10:31:05'),(3,'analytics','manage-analytics','web','Manage Analytics','Can manage analytics and reporting','2026-04-02 10:31:05','2026-04-02 10:31:05'),(4,'analytics','export-analytics','web','Export Analytics','Can export analytics data','2026-04-02 10:31:05','2026-04-02 10:31:05'),(5,'users','manage-users','web','Manage Users','Can manage users','2026-04-02 10:31:05','2026-04-02 10:31:05'),(6,'users','manage-any-users','web','Manage All Users','Manage Any Users','2026-04-02 10:31:05','2026-04-02 10:31:05'),(7,'users','manage-own-users','web','Manage Own Users','Manage Limited Users that is created by own','2026-04-02 10:31:05','2026-04-02 10:31:05'),(8,'users','view-users','web','View Users','View Users','2026-04-02 10:31:05','2026-04-02 10:31:05'),(9,'users','create-users','web','Create Users','Can create users','2026-04-02 10:31:05','2026-04-02 10:31:05'),(10,'users','edit-users','web','Edit Users','Can edit users','2026-04-02 10:31:05','2026-04-02 10:31:05'),(11,'users','delete-users','web','Delete Users','Can delete users','2026-04-02 10:31:05','2026-04-02 10:31:05'),(12,'users','reset-password-users','web','Reset Password Users','Can reset password users','2026-04-02 10:31:05','2026-04-02 10:31:05'),(13,'users','toggle-status-users','web','Change Status Users','Can change status users','2026-04-02 10:31:05','2026-04-02 10:31:05'),(14,'roles','manage-roles','web','Manage Roles','Can manage roles','2026-04-02 10:31:05','2026-04-02 10:31:05'),(15,'roles','manage-any-roles','web','Manage All Roles','Manage Any Roles','2026-04-02 10:31:05','2026-04-02 10:31:05'),(16,'roles','manage-own-roles','web','Manage Own Roles','Manage Limited Roles that is created by own','2026-04-02 10:31:05','2026-04-02 10:31:05'),(17,'roles','view-roles','web','View Roles','View Roles','2026-04-02 10:31:05','2026-04-02 10:31:05'),(18,'roles','create-roles','web','Create Roles','Can create roles','2026-04-02 10:31:05','2026-04-02 10:31:05'),(19,'roles','edit-roles','web','Edit Roles','Can edit roles','2026-04-02 10:31:05','2026-04-02 10:31:05'),(20,'roles','delete-roles','web','Delete Roles','Can delete roles','2026-04-02 10:31:05','2026-04-02 10:31:05'),(21,'permissions','manage-permissions','web','Manage Permissions','Can manage permissions','2026-04-02 10:31:05','2026-04-02 10:31:05'),(22,'permissions','manage-any-permissions','web','Manage All Permissions','Manage Any Permissions','2026-04-02 10:31:05','2026-04-02 10:31:05'),(23,'permissions','manage-own-permissions','web','Manage Own Permissions','Manage Limited Permissions that is created by own','2026-04-02 10:31:05','2026-04-02 10:31:05'),(24,'permissions','view-permissions','web','View Permissions','View Permissions','2026-04-02 10:31:05','2026-04-02 10:31:05'),(25,'permissions','create-permissions','web','Create Permissions','Can create permissions','2026-04-02 10:31:05','2026-04-02 10:31:05'),(26,'permissions','edit-permissions','web','Edit Permissions','Can edit permissions','2026-04-02 10:31:06','2026-04-02 10:31:06'),(27,'permissions','delete-permissions','web','Delete Permissions','Can delete permissions','2026-04-02 10:31:06','2026-04-02 10:31:06'),(28,'companies','manage-companies','web','Manage Companies','Can manage Companies','2026-04-02 10:31:06','2026-04-02 10:31:06'),(29,'companies','manage-any-companies','web','Manage All Companies','Manage Any Companies','2026-04-02 10:31:06','2026-04-02 10:31:06'),(30,'companies','manage-own-companies','web','Manage Own Companies','Manage Limited Companies that is created by own','2026-04-02 10:31:06','2026-04-02 10:31:06'),(31,'companies','view-companies','web','View Companies','View Companies','2026-04-02 10:31:06','2026-04-02 10:31:06'),(32,'companies','create-companies','web','Create Companies','Can create Companies','2026-04-02 10:31:06','2026-04-02 10:31:06'),(33,'companies','edit-companies','web','Edit Companies','Can edit Companies','2026-04-02 10:31:06','2026-04-02 10:31:06'),(34,'companies','delete-companies','web','Delete Companies','Can delete Companies','2026-04-02 10:31:06','2026-04-02 10:31:06'),(35,'companies','reset-password-companies','web','Reset Password Companies','Can reset password Companies','2026-04-02 10:31:06','2026-04-02 10:31:06'),(36,'companies','toggle-status-companies','web','Change Status Companies','Can change status companies','2026-04-02 10:31:06','2026-04-02 10:31:06'),(37,'companies','manage-plans-companies','web','Manage Plan Companies','Can manage plans companies','2026-04-02 10:31:06','2026-04-02 10:31:06'),(38,'companies','upgrade-plan-companies','web','Upgrade Plan Companies','Can upgrade plan of companies','2026-04-02 10:31:06','2026-04-02 10:31:06'),(39,'plans','manage-plans','web','Manage Plans','Can manage subscription plans','2026-04-02 10:31:06','2026-04-02 10:31:06'),(40,'plans','manage-any-plans','web','Manage All Plans','Manage Any Plans','2026-04-02 10:31:06','2026-04-02 10:31:06'),(41,'plans','manage-own-plans','web','Manage Own Plans','Manage Limited Plans that is created by own','2026-04-02 10:31:06','2026-04-02 10:31:06'),(42,'plans','view-plans','web','View Plans','View Plans','2026-04-02 10:31:06','2026-04-02 10:31:06'),(43,'plans','create-plans','web','Create Plans','Can create subscription plans','2026-04-02 10:31:06','2026-04-02 10:31:06'),(44,'plans','edit-plans','web','Edit Plans','Can edit subscription plans','2026-04-02 10:31:06','2026-04-02 10:31:06'),(45,'plans','delete-plans','web','Delete Plans','Can delete subscription plans','2026-04-02 10:31:06','2026-04-02 10:31:06'),(46,'plans','request-plans','web','Request Plans','Can request subscription plans','2026-04-02 10:31:06','2026-04-02 10:31:06'),(47,'plans','trial-plans','web','Trial Plans','Can start trial for subscription plans','2026-04-02 10:31:06','2026-04-02 10:31:06'),(48,'plans','subscribe-plans','web','Subscribe Plans','Can subscribe to subscription plans','2026-04-02 10:31:06','2026-04-02 10:31:06'),(49,'coupons','manage-coupons','web','Manage Coupons','Can manage subscription Coupons','2026-04-02 10:31:06','2026-04-02 10:31:06'),(50,'coupons','manage-any-coupons','web','Manage All Coupons','Manage Any Coupons','2026-04-02 10:31:06','2026-04-02 10:31:06'),(51,'coupons','manage-own-coupons','web','Manage Own Coupons','Manage Limited Coupons that is created by own','2026-04-02 10:31:06','2026-04-02 10:31:06'),(52,'coupons','view-coupons','web','View Coupons','View Coupons','2026-04-02 10:31:06','2026-04-02 10:31:06'),(53,'coupons','create-coupons','web','Create Coupons','Can create subscription Coupons','2026-04-02 10:31:06','2026-04-02 10:31:06'),(54,'coupons','edit-coupons','web','Edit Coupons','Can edit subscription Coupons','2026-04-02 10:31:06','2026-04-02 10:31:06'),(55,'coupons','delete-coupons','web','Delete Coupons','Can delete subscription Coupons','2026-04-02 10:31:06','2026-04-02 10:31:06'),(56,'coupons','toggle-status-coupons','web','Change Status Coupons','Can change status Coupons','2026-04-02 10:31:06','2026-04-02 10:31:06'),(57,'plan_requests','manage-plan-requests','web','Manage Plan Requests','Can manage plan requests','2026-04-02 10:31:06','2026-04-02 10:31:06'),(58,'plan_requests','approve-plan-requests','web','Approve plan requests','Can approve plan requests','2026-04-02 10:31:06','2026-04-02 10:31:06'),(59,'plan_requests','reject-plan-requests','web','Reject plan requests','Can reject plan requests','2026-04-02 10:31:06','2026-04-02 10:31:06'),(60,'plan_orders','manage-plan-orders','web','Manage Plan Orders','Can manage plan orders','2026-04-02 10:31:06','2026-04-02 10:31:06'),(61,'plan_orders','approve-plan-orders','web','Approve Plan Orders','Can approve plan orders','2026-04-02 10:31:06','2026-04-02 10:31:06'),(62,'plan_orders','reject-plan-orders','web','Reject Plan Orders','Can reject plan orders','2026-04-02 10:31:06','2026-04-02 10:31:06'),(63,'settings','manage-settings','web','Manage Settings','Can manage All settings','2026-04-02 10:31:06','2026-04-02 10:31:06'),(64,'settings','manage-system-settings','web','Manage System Settings','Can manage system settings','2026-04-02 10:31:06','2026-04-02 10:31:06'),(65,'settings','manage-email-settings','web','Manage Email Settings','Can manage email settings','2026-04-02 10:31:06','2026-04-02 10:31:06'),(66,'settings','manage-brand-settings','web','Manage Brand Settings','Can manage brand settings','2026-04-02 10:31:06','2026-04-02 10:31:06'),(67,'settings','manage-company-settings','web','Manage Company Settings','Can manage Company settings','2026-04-02 10:31:06','2026-04-02 10:31:06'),(68,'settings','manage-storage-settings','web','Manage Storage Settings','Can manage storage settings','2026-04-02 10:31:06','2026-04-02 10:31:06'),(69,'settings','manage-payment-settings','web','Manage Payment Settings','Can manage payment settings','2026-04-02 10:31:06','2026-04-02 10:31:06'),(70,'settings','manage-currency-settings','web','Manage Currency Settings','Can manage currency settings','2026-04-02 10:31:06','2026-04-02 10:31:06'),(71,'settings','manage-recaptcha-settings','web','Manage ReCaptch Settings','Can manage recaptcha settings','2026-04-02 10:31:06','2026-04-02 10:31:06'),(72,'settings','manage-chatgpt-settings','web','Manage ChatGpt Settings','Can manage chatgpt settings','2026-04-02 10:31:06','2026-04-02 10:31:06'),(73,'settings','manage-cookie-settings','web','Manage Cookie(GDPR) Settings','Can manage cookie settings','2026-04-02 10:31:06','2026-04-02 10:31:06'),(74,'settings','manage-seo-settings','web','Manage Seo Settings','Can manage seo settings','2026-04-02 10:31:06','2026-04-02 10:31:06'),(75,'settings','manage-cache-settings','web','Manage Cache Settings','Can manage cache settings','2026-04-02 10:31:06','2026-04-02 10:31:06'),(76,'settings','manage-account-settings','web','Manage Account Settings','Can manage account settings','2026-04-02 10:31:06','2026-04-02 10:31:06'),(77,'businesses','manage-businesses','web','Manage Businesses','Can manage businesses','2026-04-02 10:31:06','2026-04-02 10:31:06'),(78,'businesses','manage-any-businesses','web','Manage All businesses','Manage Any businesses','2026-04-02 10:31:06','2026-04-02 10:31:06'),(79,'businesses','manage-own-businesses','web','Manage Own businesses','Manage Limited businesses that is created by own','2026-04-02 10:31:06','2026-04-02 10:31:06'),(80,'businesses','view-businesses','web','View Businesses','View Businesses','2026-04-02 10:31:06','2026-04-02 10:31:06'),(81,'businesses','create-businesses','web','Create Businesses','Can create businesses','2026-04-02 10:31:06','2026-04-02 10:31:06'),(82,'businesses','edit-businesses','web','Edit Businesses','Can edit businesses','2026-04-02 10:31:06','2026-04-02 10:31:06'),(83,'businesses','delete-businesses','web','Delete Businesses','Can delete businesses','2026-04-02 10:31:06','2026-04-02 10:31:06'),(84,'currencies','manage-currencies','web','Manage Currencies','Can manage currencies','2026-04-02 10:31:06','2026-04-02 10:31:06'),(85,'currencies','manage-any-currencies','web','Manage All currencies','Manage Any currencies','2026-04-02 10:31:06','2026-04-02 10:31:06'),(86,'currencies','manage-own-currencies','web','Manage Own currencies','Manage Limited currencies that is created by own','2026-04-02 10:31:06','2026-04-02 10:31:06'),(87,'currencies','view-currencies','web','View Currencies','View Currencies','2026-04-02 10:31:06','2026-04-02 10:31:06'),(88,'currencies','create-currencies','web','Create Currencies','Can create currencies','2026-04-02 10:31:06','2026-04-02 10:31:06'),(89,'currencies','edit-currencies','web','Edit Currencies','Can edit currencies','2026-04-02 10:31:06','2026-04-02 10:31:06'),(90,'currencies','delete-currencies','web','Delete Currencies','Can delete currencies','2026-04-02 10:31:06','2026-04-02 10:31:06'),(91,'referral','manage-referral','web','Manage Referral','Can manage referral program','2026-04-02 10:31:06','2026-04-02 10:31:06'),(92,'referral','manage-setting-referral','web','Manage Referral Setting','Can manage Referral Setting','2026-04-02 10:31:06','2026-04-02 10:31:06'),(93,'referral','manage-payout-referral','web','Manage Referral Payout','Can manage Referral Payout program','2026-04-02 10:31:06','2026-04-02 10:31:06'),(94,'referral','approve-payout-referral','web','Approve Referral Payout','Can approve payout request','2026-04-02 10:31:06','2026-04-02 10:31:06'),(95,'referral','reject-payout-referral','web','Reject Referral Payout','Can reject payout request','2026-04-02 10:31:06','2026-04-02 10:31:06'),(96,'language','manage-language','web','Manage Language','Can manage language','2026-04-02 10:31:06','2026-04-02 10:31:06'),(97,'language','edit-language','web','Edit Language','Edit Language','2026-04-02 10:31:06','2026-04-02 10:31:06'),(98,'language','view-language','web','View Language','View Language','2026-04-02 10:31:06','2026-04-02 10:31:06'),(99,'media','manage-media','web','Manage Media','Can access media library','2026-04-02 10:31:06','2026-04-02 10:31:06'),(100,'media','manage-any-media','web','Manage All Media','Manage any user media (superadmin only)','2026-04-02 10:31:06','2026-04-02 10:31:06'),(101,'media','upload-media','web','Upload Media','Can upload media files','2026-04-02 10:31:06','2026-04-02 10:31:06'),(102,'media','delete-media','web','Delete Media','Can delete media files','2026-04-02 10:31:06','2026-04-02 10:31:06'),(103,'media','download-media','web','Download Media','Can download media files','2026-04-02 10:31:06','2026-04-02 10:31:06'),(104,'settings','manage-webhook-settings','web','Manage Webhook Settings','Can manage webhook settings','2026-04-02 10:31:06','2026-04-02 10:31:06'),(105,'landing_page','manage-landing-page','web','Manage Landing Page','Can manage landing page','2026-04-02 10:31:06','2026-04-02 10:31:06'),(106,'landing_page','view-landing-page','web','View Landing Page','View landing page','2026-04-02 10:31:06','2026-04-02 10:31:06'),(107,'landing_page','edit-landing-page','web','Edit Landing Page','Edit landing page','2026-04-02 10:31:06','2026-04-02 10:31:06'),(108,'stores','manage-stores','web','Manage Stores','Can manage stores','2026-04-02 10:31:06','2026-04-02 10:31:06'),(109,'stores','view-stores','web','View Stores','View stores','2026-04-02 10:31:06','2026-04-02 10:31:06'),(110,'stores','create-stores','web','Create Stores','Can create stores','2026-04-02 10:31:06','2026-04-02 10:31:06'),(111,'stores','edit-stores','web','Edit Stores','Can edit stores','2026-04-02 10:31:06','2026-04-02 10:31:06'),(112,'stores','delete-stores','web','Delete Stores','Can delete stores','2026-04-02 10:31:06','2026-04-02 10:31:06'),(113,'stores','export-stores','web','Export Stores','Can export stores data','2026-04-02 10:31:06','2026-04-02 10:31:06'),(114,'stores','settings-stores','web','Store Settings','Can manage store settings','2026-04-02 10:31:06','2026-04-02 10:31:06'),(115,'products','manage-products','web','Manage Products','Can manage products','2026-04-02 10:31:06','2026-04-02 10:31:06'),(116,'products','view-products','web','View Products','View products','2026-04-02 10:31:06','2026-04-02 10:31:06'),(117,'products','create-products','web','Create Products','Can create products','2026-04-02 10:31:06','2026-04-02 10:31:06'),(118,'products','edit-products','web','Edit Products','Can edit products','2026-04-02 10:31:06','2026-04-02 10:31:06'),(119,'products','delete-products','web','Delete Products','Can delete products','2026-04-02 10:31:06','2026-04-02 10:31:06'),(120,'products','export-products','web','Export Products','Can export products data','2026-04-02 10:31:06','2026-04-02 10:31:06'),(121,'categories','manage-categories','web','Manage Categories','Can manage categories','2026-04-02 10:31:06','2026-04-02 10:31:06'),(122,'categories','view-categories','web','View Categories','View categories','2026-04-02 10:31:06','2026-04-02 10:31:06'),(123,'categories','create-categories','web','Create Categories','Can create categories','2026-04-02 10:31:06','2026-04-02 10:31:06'),(124,'categories','edit-categories','web','Edit Categories','Can edit categories','2026-04-02 10:31:06','2026-04-02 10:31:06'),(125,'categories','delete-categories','web','Delete Categories','Can delete categories','2026-04-02 10:31:06','2026-04-02 10:31:06'),(126,'categories','export-categories','web','Export Categories','Can export categories data','2026-04-02 10:31:06','2026-04-02 10:31:06'),(127,'tax','manage-tax','web','Manage Tax','Can manage tax rules','2026-04-02 10:31:06','2026-04-02 10:31:06'),(128,'tax','view-tax','web','View Tax','View tax rules','2026-04-02 10:31:06','2026-04-02 10:31:06'),(129,'tax','create-tax','web','Create Tax','Can create tax rules','2026-04-02 10:31:06','2026-04-02 10:31:06'),(130,'tax','edit-tax','web','Edit Tax','Can edit tax rules','2026-04-02 10:31:06','2026-04-02 10:31:06'),(131,'tax','delete-tax','web','Delete Tax','Can delete tax rules','2026-04-02 10:31:06','2026-04-02 10:31:06'),(132,'tax','export-tax','web','Export Tax','Can export tax data','2026-04-02 10:31:06','2026-04-02 10:31:06'),(133,'orders','manage-orders','web','Manage Orders','Can manage orders','2026-04-02 10:31:06','2026-04-02 10:31:06'),(134,'orders','view-orders','web','View Orders','View orders','2026-04-02 10:31:06','2026-04-02 10:31:06'),(135,'orders','edit-orders','web','Edit Orders','Can edit orders','2026-04-02 10:31:06','2026-04-02 10:31:06'),(136,'orders','delete-orders','web','Delete Orders','Can delete orders','2026-04-02 10:31:06','2026-04-02 10:31:06'),(137,'orders','export-orders','web','Export Orders','Can export orders data','2026-04-02 10:31:06','2026-04-02 10:31:06'),(138,'customers','manage-customers','web','Manage Customers','Can manage customers','2026-04-02 10:31:06','2026-04-02 10:31:06'),(139,'customers','view-customers','web','View Customers','View customers','2026-04-02 10:31:06','2026-04-02 10:31:06'),(140,'customers','create-customers','web','Create Customers','Can create customers','2026-04-02 10:31:06','2026-04-02 10:31:06'),(141,'customers','edit-customers','web','Edit Customers','Can edit customers','2026-04-02 10:31:06','2026-04-02 10:31:06'),(142,'customers','delete-customers','web','Delete Customers','Can delete customers','2026-04-02 10:31:06','2026-04-02 10:31:06'),(143,'customers','export-customers','web','Export Customers','Can export customers data','2026-04-02 10:31:06','2026-04-02 10:31:06'),(144,'coupon_system','manage-coupon-system','web','Manage Coupon System','Can manage store coupons','2026-04-02 10:31:06','2026-04-02 10:31:06'),(145,'coupon_system','view-coupon-system','web','View Coupon System','View store coupons','2026-04-02 10:31:06','2026-04-02 10:31:06'),(146,'coupon_system','create-coupon-system','web','Create Coupon System','Can create store coupons','2026-04-02 10:31:06','2026-04-02 10:31:06'),(147,'coupon_system','edit-coupon-system','web','Edit Coupon System','Can edit store coupons','2026-04-02 10:31:06','2026-04-02 10:31:06'),(148,'coupon_system','delete-coupon-system','web','Delete Coupon System','Can delete store coupons','2026-04-02 10:31:06','2026-04-02 10:31:06'),(149,'coupon_system','export-coupon-system','web','Export Coupon System','Can export coupon system data','2026-04-02 10:31:06','2026-04-02 10:31:06'),(150,'coupon_system','toggle-status-coupon-system','web','Toggle Status Coupon System','Can toggle store coupon status','2026-04-02 10:31:06','2026-04-02 10:31:06'),(151,'shipping','manage-shipping','web','Manage Shipping','Can manage shipping methods','2026-04-02 10:31:06','2026-04-02 10:31:06'),(152,'shipping','view-shipping','web','View Shipping','View shipping methods','2026-04-02 10:31:06','2026-04-02 10:31:06'),(153,'shipping','create-shipping','web','Create Shipping','Can create shipping methods','2026-04-02 10:31:06','2026-04-02 10:31:06'),(154,'shipping','edit-shipping','web','Edit Shipping','Can edit shipping methods','2026-04-02 10:31:06','2026-04-02 10:31:06'),(155,'shipping','delete-shipping','web','Delete Shipping','Can delete shipping methods','2026-04-02 10:31:06','2026-04-02 10:31:06'),(156,'shipping','export-shipping','web','Export Shipping','Can export shipping data','2026-04-02 10:31:06','2026-04-02 10:31:06'),(157,'express_checkout','manage-express-checkout','web','Manage Express Checkout','Can manage express checkout','2026-04-02 10:31:06','2026-04-02 10:31:06'),(158,'express_checkout','view-express-checkout','web','View Express Checkout','View express checkout','2026-04-02 10:31:06','2026-04-02 10:31:06'),(159,'express_checkout','create-express-checkout','web','Create Express Checkout','Can create express checkout','2026-04-02 10:31:06','2026-04-02 10:31:06'),(160,'express_checkout','edit-express-checkout','web','Edit Express Checkout','Can edit express checkout','2026-04-02 10:31:06','2026-04-02 10:31:06'),(161,'express_checkout','delete-express-checkout','web','Delete Express Checkout','Can delete express checkout','2026-04-02 10:31:07','2026-04-02 10:31:07'),(162,'express_checkout','settings-express-checkout','web','Express Checkout Settings','Can manage express checkout settings','2026-04-02 10:31:07','2026-04-02 10:31:07');
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plan_orders`
--

DROP TABLE IF EXISTS `plan_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plan_orders` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `plan_id` bigint unsigned NOT NULL,
  `coupon_id` bigint unsigned DEFAULT NULL,
  `billing_cycle` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `order_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `original_price` decimal(10,2) NOT NULL,
  `discount_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `final_price` decimal(10,2) NOT NULL,
  `coupon_code` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_method` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_id` text COLLATE utf8mb4_unicode_ci,
  `status` enum('pending','approved','rejected','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `ordered_at` timestamp NOT NULL,
  `processed_at` timestamp NULL DEFAULT NULL,
  `processed_by` bigint unsigned DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `plan_orders_order_number_unique` (`order_number`),
  KEY `plan_orders_user_id_foreign` (`user_id`),
  KEY `plan_orders_plan_id_foreign` (`plan_id`),
  KEY `plan_orders_coupon_id_foreign` (`coupon_id`),
  KEY `plan_orders_processed_by_foreign` (`processed_by`),
  CONSTRAINT `plan_orders_coupon_id_foreign` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`id`) ON DELETE SET NULL,
  CONSTRAINT `plan_orders_plan_id_foreign` FOREIGN KEY (`plan_id`) REFERENCES `plans` (`id`) ON DELETE CASCADE,
  CONSTRAINT `plan_orders_processed_by_foreign` FOREIGN KEY (`processed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `plan_orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plan_orders`
--

LOCK TABLES `plan_orders` WRITE;
/*!40000 ALTER TABLE `plan_orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `plan_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plan_requests`
--

DROP TABLE IF EXISTS `plan_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plan_requests` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `plan_id` bigint unsigned NOT NULL,
  `duration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'monthly',
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `message` text COLLATE utf8mb4_unicode_ci,
  `approved_at` timestamp NULL DEFAULT NULL,
  `rejected_at` timestamp NULL DEFAULT NULL,
  `approved_by` bigint unsigned DEFAULT NULL,
  `rejected_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plan_requests_user_id_foreign` (`user_id`),
  KEY `plan_requests_plan_id_foreign` (`plan_id`),
  KEY `plan_requests_approved_by_foreign` (`approved_by`),
  KEY `plan_requests_rejected_by_foreign` (`rejected_by`),
  CONSTRAINT `plan_requests_approved_by_foreign` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `plan_requests_plan_id_foreign` FOREIGN KEY (`plan_id`) REFERENCES `plans` (`id`) ON DELETE CASCADE,
  CONSTRAINT `plan_requests_rejected_by_foreign` FOREIGN KEY (`rejected_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `plan_requests_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plan_requests`
--

LOCK TABLES `plan_requests` WRITE;
/*!40000 ALTER TABLE `plan_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `plan_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plans`
--

DROP TABLE IF EXISTS `plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plans` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` double NOT NULL DEFAULT '0',
  `yearly_price` double DEFAULT NULL,
  `duration` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `themes` text COLLATE utf8mb4_unicode_ci,
  `max_stores` int NOT NULL DEFAULT '0',
  `max_users_per_store` int NOT NULL DEFAULT '0',
  `max_products_per_store` int NOT NULL DEFAULT '0',
  `description` text COLLATE utf8mb4_unicode_ci,
  `enable_custdomain` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'off',
  `enable_custsubdomain` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'off',
  `enable_branding` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'on',
  `pwa_business` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'off',
  `enable_chatgpt` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'on',
  `enable_shipping_method` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'off',
  `storage_limit` float NOT NULL DEFAULT '0',
  `is_trial` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `trial_day` int NOT NULL DEFAULT '0',
  `is_plan_enable` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'on',
  `is_default` tinyint(1) NOT NULL DEFAULT '0',
  `module` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `plans_name_unique` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plans`
--

LOCK TABLES `plans` WRITE;
/*!40000 ALTER TABLE `plans` DISABLE KEYS */;
INSERT INTO `plans` VALUES (1,'Free',0,0,'monthly','[\"gadgets\",\"fashion\",\"home-decor\",\"bakery\",\"supermarket\",\"car-accessories\",\"toy\"]',5,25,100,'Basic plan for small businesses just getting started.','on','on','on','on','on','on',5,NULL,0,'on',1,NULL,'2026-04-02 10:31:07','2026-04-02 10:31:07'),(2,'Pro',49.99,479.9,'monthly','[\"gadgets\",\"fashion\",\"home-decor\",\"bakery\",\"supermarket\",\"car-accessories\"]',50,100,5000,'Ideal for growing businesses with multiple stores and advanced needs.','off','on','off','on','off','on',100,'on',14,'on',0,NULL,'2026-04-02 10:31:07','2026-04-02 10:31:07'),(3,'Enterprise',99.99,959.9,'monthly','[\"gadgets\",\"fashion\",\"home-decor\",\"bakery\",\"supermarket\",\"car-accessories\",\"toy\"]',200,500,10000,'Complete solution for large businesses with unlimited resources and premium support.','on','on','on','on','on','on',1000,'on',30,'on',0,NULL,'2026-04-02 10:31:07','2026-04-02 10:31:07');
/*!40000 ALTER TABLE `plans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sku` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `specifications` text COLLATE utf8mb4_unicode_ci,
  `details` text COLLATE utf8mb4_unicode_ci,
  `price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `sale_price` decimal(10,2) DEFAULT NULL,
  `stock` int NOT NULL DEFAULT '0',
  `cover_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `images` text COLLATE utf8mb4_unicode_ci,
  `variants` text COLLATE utf8mb4_unicode_ci,
  `custom_fields` text COLLATE utf8mb4_unicode_ci,
  `category_id` bigint unsigned DEFAULT NULL,
  `tax_id` bigint unsigned DEFAULT NULL,
  `store_id` bigint unsigned NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `is_downloadable` tinyint(1) NOT NULL DEFAULT '0',
  `downloadable_file` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `products_category_id_foreign` (`category_id`),
  KEY `products_tax_id_foreign` (`tax_id`),
  KEY `products_store_id_foreign` (`store_id`),
  CONSTRAINT `products_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  CONSTRAINT `products_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE,
  CONSTRAINT `products_tax_id_foreign` FOREIGN KEY (`tax_id`) REFERENCES `taxes` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'iPhone 14 Plus mobile cover','TV1C1P1042','Premium protective case for iPhone 14 Plus with shock absorption and precise cutouts.','<ul><li>Shock-absorbing TPU material</li><li>Precise camera cutouts</li><li>Wireless charging compatible</li><li>Raised edges for screen protection</li><li>Easy installation</li></ul>','<p>Protect your iPhone 14 Plus with this premium mobile cover featuring advanced shock absorption technology and precise cutouts for all ports and cameras.</p>',24.99,NULL,130,'/storage/media/6/collection.png','/storage/media/11/1.png,/storage/media/10/2.png,/storage/media/9/3.png,/storage/media/8/4.png,/storage/media/7/5.png',NULL,NULL,1,3,1,1,0,NULL,'2026-04-02 10:31:08','2026-04-02 10:31:08'),(2,'iPhone 14 - Sheath Screen Protector with Applicator Tray','TV1C1P5633','Tempered glass screen protector with easy installation tray for bubble-free application.','<ul><li>9H tempered glass</li><li>Bubble-free installation</li><li>Applicator tray included</li><li>99% transparency</li><li>Oleophobic coating</li></ul>','<p>Premium tempered glass screen protector with innovative applicator tray for perfect, bubble-free installation every time.</p>',19.99,NULL,97,'/storage/media/12/collection.png','/storage/media/17/1.png,/storage/media/16/2.png,/storage/media/15/3.png,/storage/media/14/4.png,/storage/media/13/5.png',NULL,NULL,1,2,1,1,0,NULL,'2026-04-02 10:31:08','2026-04-02 10:31:08'),(3,'Luxcell B12 10,000mAh 12W Power Bank','TV1C1P1456','High-capacity portable power bank with fast charging and multiple device support.','<ul><li>10,000mAh capacity</li><li>12W fast charging</li><li>Dual USB outputs</li><li>LED power indicator</li><li>Compact design</li></ul>','<p>Keep your devices powered with this high-capacity power bank featuring fast charging technology and support for multiple devices simultaneously.</p>',39.99,34.99,34,'/storage/media/18/collection.png','/storage/media/23/1.png,/storage/media/22/2.png,/storage/media/21/3.png,/storage/media/20/4.png,/storage/media/19/5.png',NULL,NULL,1,NULL,1,1,0,NULL,'2026-04-02 10:31:08','2026-04-02 10:31:08'),(4,'Adjustable & Foldable Desktop Phone Holder Stand','TV1C1P4957','Ergonomic phone stand with adjustable angles for comfortable viewing and video calls.','<ul><li>Adjustable viewing angles</li><li>Foldable design</li><li>Non-slip base</li><li>Universal compatibility</li><li>Aluminum construction</li></ul>','<p>Ergonomic phone stand designed for comfortable viewing, video calls, and hands-free use with adjustable angles and stable aluminum construction.</p>',16.99,NULL,81,'/storage/media/24/collection.png','/storage/media/29/1.png,/storage/media/28/2.png,/storage/media/27/3.png,/storage/media/26/4.png,/storage/media/25/5.png',NULL,NULL,1,1,1,1,0,NULL,'2026-04-02 10:31:08','2026-04-02 10:31:08');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `referral_settings`
--

DROP TABLE IF EXISTS `referral_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `referral_settings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `is_enabled` tinyint(1) NOT NULL DEFAULT '1',
  `commission_percentage` decimal(5,2) NOT NULL DEFAULT '10.00',
  `threshold_amount` decimal(10,2) NOT NULL DEFAULT '50.00',
  `guidelines` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `referral_settings`
--

LOCK TABLES `referral_settings` WRITE;
/*!40000 ALTER TABLE `referral_settings` DISABLE KEYS */;
INSERT INTO `referral_settings` VALUES (1,1,10.00,50.00,'Welcome to our referral program! Earn commission when users sign up using your referral link and purchase a plan. \n\nProgram Details:\n• Earn 10% commission on successful referrals\n• Minimum payout threshold: $50\n• Commission calculated on plan purchase price\n• Payouts processed monthly\n\nHow to participate:\n1. Share your unique referral link\n2. Track referrals in your dashboard\n3. Earn commission when referred users purchase plans\n4. Request payout once threshold is reached\n\nCommission is calculated based on the plan price and will be available for payout once you reach the minimum threshold.','2026-04-02 10:31:08','2026-04-02 10:31:08');
/*!40000 ALTER TABLE `referral_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `referrals`
--

DROP TABLE IF EXISTS `referrals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `referrals` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `company_id` bigint unsigned NOT NULL,
  `commission_percentage` decimal(5,2) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `plan_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `referrals_user_id_foreign` (`user_id`),
  KEY `referrals_company_id_foreign` (`company_id`),
  KEY `referrals_plan_id_foreign` (`plan_id`),
  CONSTRAINT `referrals_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `referrals_plan_id_foreign` FOREIGN KEY (`plan_id`) REFERENCES `plans` (`id`) ON DELETE SET NULL,
  CONSTRAINT `referrals_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `referrals`
--

LOCK TABLES `referrals` WRITE;
/*!40000 ALTER TABLE `referrals` DISABLE KEYS */;
/*!40000 ALTER TABLE `referrals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_has_permissions`
--

DROP TABLE IF EXISTS `role_has_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_has_permissions` (
  `permission_id` bigint unsigned NOT NULL,
  `role_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`permission_id`,`role_id`),
  KEY `role_has_permissions_role_id_foreign` (`role_id`),
  CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_has_permissions`
--

LOCK TABLES `role_has_permissions` WRITE;
/*!40000 ALTER TABLE `role_has_permissions` DISABLE KEYS */;
INSERT INTO `role_has_permissions` VALUES (1,1),(2,1),(3,1),(4,1),(5,1),(6,1),(7,1),(8,1),(9,1),(10,1),(11,1),(12,1),(13,1),(14,1),(15,1),(16,1),(17,1),(18,1),(19,1),(20,1),(21,1),(22,1),(23,1),(24,1),(25,1),(26,1),(27,1),(28,1),(29,1),(30,1),(31,1),(32,1),(33,1),(34,1),(35,1),(36,1),(37,1),(38,1),(39,1),(40,1),(41,1),(42,1),(43,1),(44,1),(45,1),(46,1),(47,1),(48,1),(49,1),(50,1),(51,1),(52,1),(53,1),(54,1),(55,1),(56,1),(57,1),(58,1),(59,1),(60,1),(61,1),(62,1),(63,1),(64,1),(65,1),(66,1),(67,1),(68,1),(69,1),(70,1),(71,1),(72,1),(73,1),(74,1),(75,1),(76,1),(77,1),(78,1),(79,1),(80,1),(81,1),(82,1),(83,1),(84,1),(85,1),(86,1),(87,1),(88,1),(89,1),(90,1),(91,1),(92,1),(93,1),(94,1),(95,1),(96,1),(97,1),(98,1),(99,1),(100,1),(101,1),(102,1),(103,1),(104,1),(105,1),(106,1),(107,1),(108,1),(109,1),(110,1),(111,1),(112,1),(113,1),(114,1),(115,1),(116,1),(117,1),(118,1),(119,1),(120,1),(121,1),(122,1),(123,1),(124,1),(125,1),(126,1),(127,1),(128,1),(129,1),(130,1),(131,1),(132,1),(133,1),(134,1),(135,1),(136,1),(137,1),(138,1),(139,1),(140,1),(141,1),(142,1),(143,1),(144,1),(145,1),(146,1),(147,1),(148,1),(149,1),(150,1),(151,1),(152,1),(153,1),(154,1),(155,1),(156,1),(157,1),(158,1),(159,1),(160,1),(161,1),(162,1),(1,2),(2,2),(3,2),(4,2),(5,2),(8,2),(9,2),(10,2),(11,2),(12,2),(13,2),(14,2),(17,2),(18,2),(19,2),(20,2),(24,2),(39,2),(46,2),(47,2),(48,2),(57,2),(60,2),(63,2),(69,2),(77,2),(79,2),(80,2),(81,2),(82,2),(83,2),(91,2),(93,2),(96,2),(97,2),(98,2),(99,2),(101,2),(102,2),(103,2),(104,2),(106,2),(108,2),(109,2),(110,2),(111,2),(112,2),(113,2),(114,2),(115,2),(116,2),(117,2),(118,2),(119,2),(120,2),(121,2),(122,2),(123,2),(124,2),(125,2),(126,2),(127,2),(128,2),(129,2),(130,2),(131,2),(132,2),(133,2),(134,2),(135,2),(136,2),(137,2),(138,2),(139,2),(140,2),(141,2),(142,2),(143,2),(144,2),(145,2),(146,2),(147,2),(148,2),(149,2),(150,2),(151,2),(152,2),(153,2),(154,2),(155,2),(156,2),(157,2),(158,2),(159,2),(160,2),(161,2),(162,2);
/*!40000 ALTER TABLE `role_has_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guard_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `label` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_name_guard_name_unique` (`name`,`guard_name`),
  KEY `roles_created_by_foreign` (`created_by`),
  CONSTRAINT `roles_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'superadmin','web','Super Admin','Super Admin has full access to all features',NULL,'2026-04-02 10:31:07','2026-04-02 10:31:07'),(2,'company','web','Company','Company has access to manage buissness',NULL,'2026-04-02 10:31:07','2026-04-02 10:31:07');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `settings`
--

DROP TABLE IF EXISTS `settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `settings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `store_id` bigint unsigned DEFAULT NULL,
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `settings_user_id_store_id_key_unique` (`user_id`,`store_id`,`key`),
  KEY `settings_store_id_foreign` (`store_id`),
  CONSTRAINT `settings_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE,
  CONSTRAINT `settings_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=90 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `settings`
--

LOCK TABLES `settings` WRITE;
/*!40000 ALTER TABLE `settings` DISABLE KEYS */;
INSERT INTO `settings` VALUES (1,1,NULL,'defaultLanguage','en','2026-04-02 10:31:07','2026-04-02 10:31:07'),(2,1,NULL,'dateFormat','Y-m-d','2026-04-02 10:31:07','2026-04-02 10:31:07'),(3,1,NULL,'timeFormat','H:i','2026-04-02 10:31:07','2026-04-02 10:31:07'),(4,1,NULL,'calendarStartDay','sunday','2026-04-02 10:31:07','2026-04-02 10:31:07'),(5,1,NULL,'defaultTimezone','UTC','2026-04-02 10:31:07','2026-04-02 10:31:07'),(6,1,NULL,'emailVerification','0','2026-04-02 10:31:07','2026-04-02 10:31:07'),(7,1,NULL,'landingPageEnabled','1','2026-04-02 10:31:07','2026-04-02 10:31:07'),(8,1,NULL,'registrationEnabled','1','2026-04-02 10:31:07','2026-04-02 10:31:07'),(9,1,NULL,'logoDark','/images/logos/logo-dark.png','2026-04-02 10:31:07','2026-04-02 10:31:07'),(10,1,NULL,'logoLight','/images/logos/logo-light.png','2026-04-02 10:31:07','2026-04-02 10:31:07'),(11,1,NULL,'favicon','/images/logos/favicon.png','2026-04-02 10:31:07','2026-04-02 10:31:07'),(12,1,NULL,'titleText','WhatsStore','2026-04-02 10:31:07','2026-04-02 10:31:07'),(13,1,NULL,'footerText','© 2026 WhatsStore. All rights reserved.','2026-04-02 10:31:07','2026-04-02 10:31:07'),(14,1,NULL,'themeColor','green','2026-04-02 10:31:07','2026-04-02 10:31:07'),(15,1,NULL,'customColor','#10b77f','2026-04-02 10:31:07','2026-04-02 10:31:07'),(16,1,NULL,'sidebarVariant','inset','2026-04-02 10:31:07','2026-04-02 10:31:07'),(17,1,NULL,'sidebarStyle','plain','2026-04-02 10:31:07','2026-04-02 10:31:07'),(18,1,NULL,'layoutDirection','left','2026-04-02 10:31:07','2026-04-02 10:31:07'),(19,1,NULL,'themeMode','light','2026-04-02 10:31:07','2026-04-02 10:31:07'),(20,1,NULL,'storage_type','local','2026-04-02 10:31:07','2026-04-02 10:31:07'),(21,1,NULL,'storage_file_types','jpg,png,webp,gif,pdf,doc,docx,txt,csv','2026-04-02 10:31:07','2026-04-02 10:31:07'),(22,1,NULL,'storage_max_upload_size','2048','2026-04-02 10:31:07','2026-04-02 10:31:07'),(23,1,NULL,'aws_access_key_id','','2026-04-02 10:31:07','2026-04-02 10:31:07'),(24,1,NULL,'aws_secret_access_key','','2026-04-02 10:31:07','2026-04-02 10:31:07'),(25,1,NULL,'aws_default_region','us-east-1','2026-04-02 10:31:07','2026-04-02 10:31:07'),(26,1,NULL,'aws_bucket','','2026-04-02 10:31:07','2026-04-02 10:31:07'),(27,1,NULL,'aws_url','','2026-04-02 10:31:07','2026-04-02 10:31:07'),(28,1,NULL,'aws_endpoint','','2026-04-02 10:31:07','2026-04-02 10:31:07'),(29,1,NULL,'wasabi_access_key','','2026-04-02 10:31:07','2026-04-02 10:31:07'),(30,1,NULL,'wasabi_secret_key','','2026-04-02 10:31:07','2026-04-02 10:31:07'),(31,1,NULL,'wasabi_region','us-east-1','2026-04-02 10:31:07','2026-04-02 10:31:07'),(32,1,NULL,'wasabi_bucket','','2026-04-02 10:31:07','2026-04-02 10:31:07'),(33,1,NULL,'wasabi_url','','2026-04-02 10:31:07','2026-04-02 10:31:07'),(34,1,NULL,'wasabi_root','','2026-04-02 10:31:07','2026-04-02 10:31:07'),(35,1,NULL,'decimalFormat','2','2026-04-02 10:31:07','2026-04-02 10:31:07'),(36,1,NULL,'defaultCurrency','USD','2026-04-02 10:31:07','2026-04-02 10:31:07'),(37,1,NULL,'decimalSeparator','.','2026-04-02 10:31:07','2026-04-02 10:31:07'),(38,1,NULL,'thousandsSeparator',',','2026-04-02 10:31:07','2026-04-02 10:31:07'),(39,1,NULL,'floatNumber','1','2026-04-02 10:31:07','2026-04-02 10:31:07'),(40,1,NULL,'currencySymbolSpace','0','2026-04-02 10:31:07','2026-04-02 10:31:07'),(41,1,NULL,'currencySymbolPosition','before','2026-04-02 10:31:07','2026-04-02 10:31:07'),(42,1,NULL,'enableLogging','0','2026-04-02 10:31:07','2026-04-02 10:31:07'),(43,1,NULL,'strictlyNecessaryCookies','1','2026-04-02 10:31:07','2026-04-02 10:31:07'),(44,1,NULL,'cookieTitle','Cookie Consent','2026-04-02 10:31:07','2026-04-02 10:31:07'),(45,1,NULL,'strictlyCookieTitle','Strictly Necessary Cookies','2026-04-02 10:31:07','2026-04-02 10:31:07'),(46,1,NULL,'cookieDescription','We use cookies to enhance your browsing experience and provide personalized content.','2026-04-02 10:31:07','2026-04-02 10:31:07'),(47,1,NULL,'strictlyCookieDescription','These cookies are essential for the website to function properly.','2026-04-02 10:31:07','2026-04-02 10:31:07'),(48,1,NULL,'contactUsDescription','If you have any questions about our cookie policy, please contact us.','2026-04-02 10:31:07','2026-04-02 10:31:07'),(49,1,NULL,'contactUsUrl','https://example.com/contact','2026-04-02 10:31:07','2026-04-02 10:31:07'),(50,2,NULL,'defaultLanguage','en','2026-04-02 10:31:07','2026-04-02 10:31:07'),(51,2,NULL,'dateFormat','Y-m-d','2026-04-02 10:31:07','2026-04-02 10:31:07'),(52,2,NULL,'timeFormat','H:i','2026-04-02 10:31:07','2026-04-02 10:31:07'),(53,2,NULL,'calendarStartDay','sunday','2026-04-02 10:31:07','2026-04-02 10:31:07'),(54,2,NULL,'defaultTimezone','UTC','2026-04-02 10:31:08','2026-04-02 10:31:08'),(55,2,NULL,'logoDark','/images/logos/logo-dark.png','2026-04-02 10:31:08','2026-04-02 10:31:08'),(56,2,NULL,'logoLight','/images/logos/logo-light.png','2026-04-02 10:31:08','2026-04-02 10:31:08'),(57,2,NULL,'favicon','/images/logos/favicon.png','2026-04-02 10:31:08','2026-04-02 10:31:08'),(58,2,NULL,'titleText','WhatsStore','2026-04-02 10:31:08','2026-04-02 10:31:08'),(59,2,NULL,'footerText','© 2026 WhatsStore. All rights reserved.','2026-04-02 10:31:08','2026-04-02 10:31:08'),(60,2,NULL,'themeColor','green','2026-04-02 10:31:08','2026-04-02 10:31:08'),(61,2,NULL,'customColor','#10b77f','2026-04-02 10:31:08','2026-04-02 10:31:08'),(62,2,NULL,'sidebarVariant','inset','2026-04-02 10:31:08','2026-04-02 10:31:08'),(63,2,NULL,'sidebarStyle','plain','2026-04-02 10:31:08','2026-04-02 10:31:08'),(64,2,NULL,'layoutDirection','left','2026-04-02 10:31:08','2026-04-02 10:31:08'),(65,2,NULL,'themeMode','light','2026-04-02 10:31:08','2026-04-02 10:31:08'),(66,1,NULL,'metaKeywords','ecommerce, online store, shopping, multi-store, saas platform, whatsstore','2026-04-02 10:31:08','2026-04-02 10:31:08'),(67,1,NULL,'metaDescription','WhatsStore - A powerful SaaS platform for creating and managing multiple online stores with professional themes and complete e-commerce features.','2026-04-02 10:31:08','2026-04-02 10:31:08'),(68,1,NULL,'metaImage','/images/logos/logo-dark.png','2026-04-02 10:31:08','2026-04-02 10:31:08'),(69,2,1,'calendarStartDay','sunday','2026-04-02 10:31:08','2026-04-02 10:31:08'),(70,2,1,'customColor','#10b77f','2026-04-02 10:31:08','2026-04-02 10:31:08'),(71,2,1,'dateFormat','Y-m-d','2026-04-02 10:31:08','2026-04-02 10:31:08'),(72,2,1,'defaultLanguage','en','2026-04-02 10:31:08','2026-04-02 10:31:08'),(73,2,1,'defaultTimezone','UTC','2026-04-02 10:31:08','2026-04-02 10:31:08'),(74,2,1,'favicon','/images/logos/favicon.png','2026-04-02 10:31:08','2026-04-02 10:31:08'),(75,2,1,'footerText','© 2026 WhatsStore. All rights reserved.','2026-04-02 10:31:08','2026-04-02 10:31:08'),(76,2,1,'layoutDirection','left','2026-04-02 10:31:08','2026-04-02 10:31:08'),(77,2,1,'logoDark','/images/logos/logo-dark.png','2026-04-02 10:31:08','2026-04-02 10:31:08'),(78,2,1,'logoLight','/images/logos/logo-light.png','2026-04-02 10:31:08','2026-04-02 10:31:08'),(79,2,1,'sidebarStyle','plain','2026-04-02 10:31:08','2026-04-02 10:31:08'),(80,2,1,'sidebarVariant','inset','2026-04-02 10:31:08','2026-04-02 10:31:08'),(81,2,1,'themeColor','green','2026-04-02 10:31:08','2026-04-02 10:31:08'),(82,2,1,'themeMode','light','2026-04-02 10:31:08','2026-04-02 10:31:08'),(83,2,1,'timeFormat','H:i','2026-04-02 10:31:08','2026-04-02 10:31:08'),(84,2,1,'titleText','WhatsStore','2026-04-02 10:31:08','2026-04-02 10:31:08'),(85,2,1,'Order Created','off','2026-04-02 10:31:08','2026-04-02 10:31:08'),(86,2,1,'Order Created For Owner','off','2026-04-02 10:31:08','2026-04-02 10:31:08'),(87,2,1,'Owner And Store Created','off','2026-04-02 10:31:08','2026-04-02 10:31:08'),(88,2,1,'Status Change','off','2026-04-02 10:31:08','2026-04-02 10:31:08'),(89,2,1,'User Created','off','2026-04-02 10:31:08','2026-04-02 10:31:08');
/*!40000 ALTER TABLE `settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shippings`
--

DROP TABLE IF EXISTS `shippings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shippings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `store_id` bigint unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `cost` decimal(10,2) NOT NULL DEFAULT '0.00',
  `min_order_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `delivery_time` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `zone_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `countries` text COLLATE utf8mb4_unicode_ci,
  `postal_codes` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `max_distance` decimal(10,2) DEFAULT NULL,
  `max_weight` decimal(10,2) DEFAULT NULL,
  `max_dimensions` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `require_signature` tinyint(1) NOT NULL DEFAULT '0',
  `insurance_required` tinyint(1) NOT NULL DEFAULT '0',
  `tracking_available` tinyint(1) NOT NULL DEFAULT '1',
  `handling_fee` decimal(10,2) NOT NULL DEFAULT '0.00',
  `views` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `shippings_store_id_foreign` (`store_id`),
  CONSTRAINT `shippings_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shippings`
--

LOCK TABLES `shippings` WRITE;
/*!40000 ALTER TABLE `shippings` DISABLE KEYS */;
INSERT INTO `shippings` VALUES (1,1,'Free Shipping','free','Free standard shipping on orders over $50',0.00,50.00,'5-7 business days',1,1,'global',NULL,NULL,NULL,NULL,NULL,0,0,1,0.00,0,'2026-04-02 10:31:08','2026-04-02 10:31:08'),(2,1,'Standard Shipping','flat_rate','Standard delivery with tracking',9.99,0.00,'3-5 business days',2,1,'global',NULL,NULL,NULL,NULL,NULL,0,0,1,0.00,0,'2026-04-02 10:31:08','2026-04-02 10:31:08'),(3,1,'Express Shipping','flat_rate','Fast delivery with priority handling',19.99,0.00,'1-2 business days',3,1,'global',NULL,NULL,NULL,NULL,NULL,1,0,1,0.00,0,'2026-04-02 10:31:08','2026-04-02 10:31:08');
/*!40000 ALTER TABLE `shippings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `states`
--

DROP TABLE IF EXISTS `states`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `states` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `country_id` bigint unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `states_country_id_foreign` (`country_id`),
  CONSTRAINT `states_country_id_foreign` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `states`
--

LOCK TABLES `states` WRITE;
/*!40000 ALTER TABLE `states` DISABLE KEYS */;
INSERT INTO `states` VALUES (1,1,'California','CA',1,'2026-04-02 10:31:08','2026-04-02 10:31:08'),(2,1,'Texas','TX',1,'2026-04-02 10:31:08','2026-04-02 10:31:08'),(3,2,'Maharashtra','MH',1,'2026-04-02 10:31:08','2026-04-02 10:31:08'),(4,2,'Gujarat','GJ',1,'2026-04-02 10:31:08','2026-04-02 10:31:08');
/*!40000 ALTER TABLE `states` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `store_configurations`
--

DROP TABLE IF EXISTS `store_configurations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `store_configurations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `store_id` bigint unsigned NOT NULL,
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `store_configurations_store_id_key_unique` (`store_id`,`key`),
  CONSTRAINT `store_configurations_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store_configurations`
--

LOCK TABLES `store_configurations` WRITE;
/*!40000 ALTER TABLE `store_configurations` DISABLE KEYS */;
INSERT INTO `store_configurations` VALUES (1,1,'store_status','true','2026-04-02 10:31:08','2026-04-02 10:31:08'),(2,1,'maintenance_mode','false','2026-04-02 10:31:08','2026-04-02 10:31:08'),(3,1,'logo','/storage/media/1896/header-logo.png','2026-04-02 10:31:08','2026-04-02 10:31:08'),(4,1,'favicon','/storage/media/1897/favicon.png','2026-04-02 10:31:08','2026-04-02 10:31:08'),(5,1,'welcome_message','Welcome to our store!','2026-04-02 10:31:08','2026-04-02 10:31:08'),(6,1,'store_description','Discover amazing products at great prices.','2026-04-02 10:31:08','2026-04-02 10:31:08'),(7,1,'copyright_text','© 2026 Your Store Name. All rights reserved.','2026-04-02 10:31:08','2026-04-02 10:31:08'),(8,1,'address','123 Main Street','2026-04-02 10:31:08','2026-04-02 10:31:08'),(9,1,'city','New York','2026-04-02 10:31:08','2026-04-02 10:31:08'),(10,1,'state','NY','2026-04-02 10:31:08','2026-04-02 10:31:08'),(11,1,'country','United States','2026-04-02 10:31:08','2026-04-02 10:31:08'),(12,1,'postal_code','10001','2026-04-02 10:31:08','2026-04-02 10:31:08'),(13,1,'facebook_url','https://facebook.com/techvibe','2026-04-02 10:31:08','2026-04-02 10:31:08'),(14,1,'instagram_url','https://instagram.com/techvibe','2026-04-02 10:31:08','2026-04-02 10:31:08'),(15,1,'twitter_url','https://x.com/techvibe','2026-04-02 10:31:08','2026-04-02 10:31:08'),(16,1,'youtube_url','https://youtube.com/techvibe','2026-04-02 10:31:08','2026-04-02 10:31:08'),(17,1,'whatsapp_url','https://wa.me/+1234567890','2026-04-02 10:31:08','2026-04-02 10:31:08'),(18,1,'email','contact@techvibe.com','2026-04-02 10:31:08','2026-04-02 10:31:08'),(19,1,'whatsapp_widget_enabled','true','2026-04-02 10:31:08','2026-04-02 10:31:08'),(20,1,'whatsapp_widget_phone','+1234567890','2026-04-02 10:31:08','2026-04-02 10:31:08'),(21,1,'whatsapp_widget_message','Hello! I need help with...','2026-04-02 10:31:08','2026-04-02 10:31:08'),(22,1,'whatsapp_widget_position','right','2026-04-02 10:31:08','2026-04-02 10:31:08'),(23,1,'whatsapp_widget_show_on_mobile','true','2026-04-02 10:31:08','2026-04-02 10:31:08'),(24,1,'whatsapp_widget_show_on_desktop','true','2026-04-02 10:31:08','2026-04-02 10:31:08'),(25,1,'custom_css','','2026-04-02 10:31:08','2026-04-02 10:31:08'),(26,1,'custom_javascript','','2026-04-02 10:31:08','2026-04-02 10:31:08');
/*!40000 ALTER TABLE `store_configurations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `store_coupons`
--

DROP TABLE IF EXISTS `store_coupons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `store_coupons` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `code_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'manual',
  `type` enum('percentage','flat') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'percentage',
  `discount_amount` decimal(10,2) NOT NULL,
  `minimum_spend` decimal(10,2) DEFAULT NULL,
  `maximum_spend` decimal(10,2) DEFAULT NULL,
  `use_limit_per_coupon` int DEFAULT NULL,
  `use_limit_per_user` int DEFAULT NULL,
  `used_count` int NOT NULL DEFAULT '0',
  `start_date` date DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `store_id` bigint unsigned NOT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `store_coupons_code_unique` (`code`),
  KEY `store_coupons_store_id_foreign` (`store_id`),
  KEY `store_coupons_created_by_foreign` (`created_by`),
  CONSTRAINT `store_coupons_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `store_coupons_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store_coupons`
--

LOCK TABLES `store_coupons` WRITE;
/*!40000 ALTER TABLE `store_coupons` DISABLE KEYS */;
/*!40000 ALTER TABLE `store_coupons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `store_settings`
--

DROP TABLE IF EXISTS `store_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `store_settings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `store_id` bigint unsigned NOT NULL,
  `theme` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'default',
  `content` json NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `store_settings_store_id_theme_unique` (`store_id`,`theme`),
  CONSTRAINT `store_settings_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store_settings`
--

LOCK TABLES `store_settings` WRITE;
/*!40000 ALTER TABLE `store_settings` DISABLE KEYS */;
/*!40000 ALTER TABLE `store_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stores`
--

DROP TABLE IF EXISTS `stores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stores` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `theme` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'gadgets',
  `user_id` bigint unsigned NOT NULL,
  `custom_domain` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `custom_subdomain` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `enable_custom_domain` tinyint(1) NOT NULL DEFAULT '0',
  `enable_custom_subdomain` tinyint(1) NOT NULL DEFAULT '0',
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_featured` tinyint(1) NOT NULL DEFAULT '0',
  `enable_pwa` tinyint(1) NOT NULL DEFAULT '0',
  `pwa_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pwa_short_name` varchar(12) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pwa_description` text COLLATE utf8mb4_unicode_ci,
  `pwa_theme_color` varchar(9) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#3B82F6',
  `pwa_background_color` varchar(9) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#ffffff',
  `pwa_display` enum('standalone','fullscreen','minimal-ui','browser') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'standalone',
  `pwa_orientation` enum('portrait','landscape','any') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'portrait',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `stores_slug_unique` (`slug`),
  KEY `stores_user_id_foreign` (`user_id`),
  CONSTRAINT `stores_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stores`
--

LOCK TABLES `stores` WRITE;
/*!40000 ALTER TABLE `stores` DISABLE KEYS */;
INSERT INTO `stores` VALUES (1,'TechVibe','techvibe','Your one-stop destination for the latest smartphones, laptops, gaming gear, smart home devices, and cutting-edge technology with expert support and warranty.','gadgets',2,NULL,NULL,0,0,'hello@techvibe.com',0,0,NULL,NULL,NULL,'#3B82F6','#ffffff','standalone','portrait','2026-04-02 10:31:08','2026-04-02 10:31:08');
/*!40000 ALTER TABLE `stores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `taxes`
--

DROP TABLE IF EXISTS `taxes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `taxes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rate` decimal(8,2) NOT NULL,
  `type` enum('percentage','fixed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'percentage',
  `region` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `priority` int NOT NULL DEFAULT '1',
  `compound` tinyint(1) NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `store_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `taxes_name_store_id_unique` (`name`,`store_id`),
  KEY `taxes_store_id_foreign` (`store_id`),
  CONSTRAINT `taxes_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `taxes`
--

LOCK TABLES `taxes` WRITE;
/*!40000 ALTER TABLE `taxes` DISABLE KEYS */;
INSERT INTO `taxes` VALUES (1,'Standard VAT',20.00,'percentage','EU',1,0,1,1,'2026-04-02 10:31:08','2026-04-02 10:31:08'),(2,'Reduced Rate',5.00,'percentage','EU',2,0,1,1,'2026-04-02 10:31:08','2026-04-02 10:31:08'),(3,'Sales Tax',8.25,'percentage','US',3,0,1,1,'2026-04-02 10:31:08','2026-04-02 10:31:08'),(4,'Zero Rate',0.00,'percentage','Global',4,0,1,1,'2026-04-02 10:31:08','2026-04-02 10:31:08');
/*!40000 ALTER TABLE `taxes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_email_templates`
--

DROP TABLE IF EXISTS `user_email_templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_email_templates` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `template_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_email_templates_template_id_foreign` (`template_id`),
  CONSTRAINT `user_email_templates_template_id_foreign` FOREIGN KEY (`template_id`) REFERENCES `email_templates` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_email_templates`
--

LOCK TABLES `user_email_templates` WRITE;
/*!40000 ALTER TABLE `user_email_templates` DISABLE KEYS */;
INSERT INTO `user_email_templates` VALUES (1,1,1,1,'2026-04-02 10:31:08','2026-04-02 10:31:08'),(2,2,1,1,'2026-04-02 10:31:08','2026-04-02 10:31:08'),(3,3,1,1,'2026-04-02 10:31:09','2026-04-02 10:31:09'),(4,4,1,1,'2026-04-02 10:31:09','2026-04-02 10:31:09'),(5,5,1,1,'2026-04-02 10:31:09','2026-04-02 10:31:09');
/*!40000 ALTER TABLE `user_email_templates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lang` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'en',
  `current_store` bigint unsigned DEFAULT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'company',
  `plan_id` bigint unsigned DEFAULT NULL,
  `plan_duration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'monthly',
  `plan_expire_date` date DEFAULT NULL,
  `requested_plan` int NOT NULL DEFAULT '0',
  `created_by` int NOT NULL DEFAULT '0',
  `mode` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'light',
  `plan_is_active` int NOT NULL DEFAULT '1',
  `storage_limit` float NOT NULL DEFAULT '0',
  `is_enable_login` int NOT NULL DEFAULT '1',
  `google2fa_enable` int NOT NULL DEFAULT '0',
  `google2fa_secret` text COLLATE utf8mb4_unicode_ci,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `is_trial` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `trial_day` int NOT NULL DEFAULT '0',
  `trial_expire_date` date DEFAULT NULL,
  `active_module` text COLLATE utf8mb4_unicode_ci,
  `referral_code` int NOT NULL DEFAULT '0',
  `used_referral_code` int NOT NULL DEFAULT '0',
  `commission_amount` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_plan_id_foreign` (`plan_id`),
  CONSTRAINT `users_plan_id_foreign` FOREIGN KEY (`plan_id`) REFERENCES `plans` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Super Admin','moh.laham51@gmail.com',NULL,'$2y$12$bxSJDFvy9ap9Qr1r3pBaNuteD3/Wvl8ZIbZRe02nguJ11m6hSf4sa','MwJYQMCl1SmLd72VpbiEXvr9pRwfmHUIrDC0orr721dYznTYdJ8i3Xi1TDVS','en',NULL,NULL,'superadmin',NULL,'monthly',NULL,0,0,'light',1,0,1,0,NULL,'active',NULL,0,NULL,NULL,0,0,0,'2026-04-02 10:31:07','2026-04-02 11:09:01'),(2,'Company','company@example.com','2026-04-02 10:31:07','$2y$12$6QsDtaP/l9Xk8ExJFlt96uWIzEvRnjc6fSVfGCu8WE5yG/KOuf9uq',NULL,'en',1,NULL,'company',3,'monthly',NULL,0,1,'light',1,0,1,0,NULL,'active',NULL,0,NULL,NULL,196191,0,0,'2026-04-02 10:31:07','2026-04-02 11:35:03');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `webhooks`
--

DROP TABLE IF EXISTS `webhooks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `webhooks` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `store_id` bigint unsigned DEFAULT NULL,
  `module` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `method` enum('GET','POST') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'POST',
  `url` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `webhooks_user_id_store_id_module_unique` (`user_id`,`store_id`,`module`),
  KEY `webhooks_store_id_foreign` (`store_id`),
  KEY `webhooks_user_id_store_id_index` (`user_id`,`store_id`),
  KEY `webhooks_module_is_active_index` (`module`,`is_active`),
  CONSTRAINT `webhooks_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE,
  CONSTRAINT `webhooks_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `webhooks`
--

LOCK TABLES `webhooks` WRITE;
/*!40000 ALTER TABLE `webhooks` DISABLE KEYS */;
/*!40000 ALTER TABLE `webhooks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wishlist_items`
--

DROP TABLE IF EXISTS `wishlist_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wishlist_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `store_id` bigint unsigned NOT NULL,
  `customer_id` bigint unsigned DEFAULT NULL,
  `session_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `product_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `wishlist_customer_unique` (`store_id`,`customer_id`,`product_id`),
  UNIQUE KEY `wishlist_session_unique` (`store_id`,`session_id`,`product_id`),
  KEY `wishlist_items_customer_id_foreign` (`customer_id`),
  KEY `wishlist_items_product_id_foreign` (`product_id`),
  CONSTRAINT `wishlist_items_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `wishlist_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `wishlist_items_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishlist_items`
--

LOCK TABLES `wishlist_items` WRITE;
/*!40000 ALTER TABLE `wishlist_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `wishlist_items` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-02 12:00:24
