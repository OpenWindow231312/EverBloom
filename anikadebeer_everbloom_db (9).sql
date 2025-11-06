-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: mysql-anikadebeer.alwaysdata.net
-- Generation Time: Nov 06, 2025 at 10:43 AM
-- Server version: 10.11.14-MariaDB
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `anikadebeer_everbloom_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `AutoSaleLog`
--

CREATE TABLE `AutoSaleLog` (
  `log_id` int(11) NOT NULL,
  `flower_id` int(11) NOT NULL,
  `harvestBatch_id` int(11) DEFAULT NULL,
  `saleTriggeredAt` datetime NOT NULL DEFAULT current_timestamp(),
  `reason` varchar(255) DEFAULT 'Shelf life ≤ 2 days',
  `oldPrice` decimal(10,2) DEFAULT NULL,
  `newSalePrice` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Stand-in structure for view `ColdroomOverview`
-- (See below for the actual view)
--
CREATE TABLE `ColdroomOverview` (
`flower_id` int(11)
,`flower_name` varchar(255)
,`color` varchar(255)
,`price_per_stem` decimal(10,2)
,`sale_price_per_stem` decimal(10,2)
,`is_on_sale` tinyint(1)
,`harvestBatch_id` int(11)
,`harvestDateTime` datetime
,`expiryDate` date
,`saleStatus` enum('Normal','ExpiringSoon','Expired')
,`inventory_id` int(11)
,`stemsInColdroom` int(11)
,`coldroom_status` enum('Fresh','ExpiringSoon','Expired')
,`archived` tinyint(1)
);

-- --------------------------------------------------------

--
-- Table structure for table `ColdroomReservations`
--

CREATE TABLE `ColdroomReservations` (
  `reservation_id` int(11) NOT NULL,
  `orderItem_id` int(11) NOT NULL,
  `harvestBatch_id` int(11) NOT NULL,
  `quantityReserved` int(11) NOT NULL,
  `reservedAt` datetime DEFAULT NULL,
  `status` enum('Active','Released','Fulfilled') DEFAULT 'Active',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Deliveries`
--

CREATE TABLE `Deliveries` (
  `delivery_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `assignedToUserID` int(11) DEFAULT NULL,
  `driverName` varchar(255) DEFAULT NULL,
  `vehicle` varchar(255) DEFAULT NULL,
  `contactNumber` varchar(255) DEFAULT NULL,
  `deliveryType` enum('Pickup','Delivery') DEFAULT 'Delivery',
  `deliveryDate` datetime DEFAULT NULL,
  `status` enum('Scheduled','In Transit','Delivered','Failed') DEFAULT 'Scheduled',
  `proofOfDeliveryURL` varchar(255) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Discards`
--

CREATE TABLE `Discards` (
  `discard_id` int(11) NOT NULL,
  `harvestBatch_id` int(11) NOT NULL,
  `quantityDiscarded` int(11) NOT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `discardDateTime` datetime DEFAULT NULL,
  `movedToArchiveDate` datetime DEFAULT NULL,
  `discardedByEmployeeID` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Flowers`
--

CREATE TABLE `Flowers` (
  `flower_id` int(11) NOT NULL,
  `type_id` int(11) DEFAULT NULL,
  `variety` varchar(255) NOT NULL,
  `color` varchar(255) DEFAULT NULL,
  `stem_length` float DEFAULT NULL,
  `shelf_life` int(11) DEFAULT NULL,
  `price_per_stem` decimal(10,2) DEFAULT 0.00,
  `sale_price_per_stem` decimal(10,2) DEFAULT 0.00,
  `is_listed_for_sale` tinyint(1) DEFAULT 0,
  `is_on_sale` tinyint(1) DEFAULT 0,
  `image_url` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `unit` varchar(255) DEFAULT 'stem',
  `notes` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `totalStemsAvailable` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Flowers`
--

INSERT INTO `Flowers` (`flower_id`, `type_id`, `variety`, `color`, `stem_length`, `shelf_life`, `price_per_stem`, `sale_price_per_stem`, `is_listed_for_sale`, `is_on_sale`, `image_url`, `description`, `unit`, `notes`, `createdAt`, `updatedAt`, `totalStemsAvailable`) VALUES
(2, 1, 'Red Naomi', 'Red', 50, 7, 12.00, 11.00, 1, 1, 'https://alloccasionswholesale.co.uk/cdn/shop/files/RedNaomi8.png?v=1755083777&width=1445', NULL, 'stem', 'In Stock: 250', '2025-10-09 07:45:53', '2025-11-06 08:32:39', 260),
(3, 2, 'Stargazer', 'Pink', 45, 5, 9.00, 7.00, 1, 1, 'https://www.cascadefloralwholesale.com/wp-content/uploads/2018/03/LILYS.jpg', NULL, 'stem', 'In Stock: 90', '2025-10-09 08:01:11', '2025-10-20 16:06:08', 100),
(4, 3, 'Yellow Triumph', 'Yellow', 35, 6, 10.00, 7.00, 1, 1, 'https://www.ronis.com.au/cdn/shop/files/FI9370YE_540x540.webp?v=1709631953', NULL, 'stem', 'In Stock: 172', '2025-10-09 08:01:13', '2025-10-20 16:09:06', 183),
(5, 1, 'Avalanche', 'White', 48, 7, 8.00, 6.00, 1, 0, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShHGCprxsh2SUPJsF9fBG-cCZLcx07kZNZrw&s', NULL, 'stem', NULL, '2025-10-09 08:03:11', '2025-10-20 16:14:40', 0),
(6, 3, 'Purple Dream', 'Purple', 38, 6, 10.00, 8.00, 1, 0, 'https://greenchoiceflowers.com/cdn/shop/products/purple-close-up-of-beautiful-fresh-tulip-isolated-on-white-background-organic-flower-spring-mood-tender-and-deep-colors-of-petals-and-leaves-magnificent-and-glorious.jpg?v=1634324655&width=1024', NULL, 'stem', NULL, '2025-10-09 08:03:13', '2025-10-20 17:46:36', 0),
(10, 2, 'Casablanca', 'White', 55, 6, 0.00, 0.00, 0, 0, NULL, NULL, 'stem', NULL, '2025-10-09 08:44:51', '2025-10-09 08:44:51', 0),
(12, 31, 'Grand Ivory', 'Ivory White', 60, 6, 12.00, 10.00, 0, 0, '', 'The dahlia was named in honor of Swedish botanist Andreas Dahl, a student of Linnaeus. Native to Mexico and Central America, reports claim the Aztecs used dahlias to treat urinary difficulties. Dahlias are members of the Compositae family and are related to daisies.', 'stem', NULL, '2025-11-06 09:53:06', '2025-11-06 09:53:06', 0),
(27, 3, 'Salmon Tulip', 'Salmon Pink', 30, 5, 13.00, 10.00, 1, 0, 'https://www.becara.com/11530-large_default/salmon-tulip-flower.jpg', 'cute tulip for sale', 'stem', NULL, '2025-10-09 09:34:45', '2025-11-06 08:48:47', 0),
(28, 10, 'King Protea White', 'White', 100, 14, 12.00, 10.00, 1, 0, 'https://thursd.com/storage/media/8620/protea-white-king-product-on-thursd-featured-900x900.jpg', NULL, 'stem', 'In Stock: 60', '2025-10-09 09:54:57', '2025-11-06 08:39:11', 60),
(31, 1, 'Autumn Damask', 'Pink Blend', 30, 5, 6.00, 4.00, 0, 0, NULL, NULL, 'stem', NULL, '2025-10-18 21:32:43', '2025-11-06 06:30:44', 0),
(98, 3, 'Queen of Night', 'Deep Purple', 40, 6, 9.00, 7.00, 1, 0, 'https://thumbs.dreamstime.com/b/black-tulip-queen-night-very-attractive-spring-flower-onion-plant-comes-many-different-colors-213547052.jpg', 'Dark velvety tulip that adds dramatic color and depth to arrangements.', 'stem', NULL, '2025-10-20 20:10:23', '2025-10-20 20:10:23', 0),
(99, 4, 'Phalaenopsis White Elegance', 'White', 45, 10, 15.00, 12.00, 1, 0, 'https://www.jennysilks.com/cdn/shop/files/92012NT.WW.jpg?v=1723069430&width=1214', 'Elegant white orchid with long-lasting blooms — timeless and graceful.', 'stem', NULL, '2025-10-20 20:10:23', '2025-10-20 20:10:23', 0),
(100, 5, 'Vincent’s Choice', 'Yellow', 60, 6, 8.00, 6.00, 1, 0, 'https://www.esmeraldafarms.com/assets/images/processed/NoCrop_1000x1000/2754-esmeralda-farms-sunflower-vincents-choice.jpg', 'Classic bright sunflower with strong stems and dark centers.', 'stem', NULL, '2025-10-20 20:10:23', '2025-10-20 20:10:23', 0),
(101, 6, 'Shasta Daisy', 'White', 45, 6, 7.00, 5.00, 1, 0, 'https://silksareforever.com/cdn/shop/files/FSD114-WH_1024x1024.jpg?v=1698911759', 'Pure white daisy with a yellow center — cheerful and bright.', 'stem', NULL, '2025-10-20 20:10:23', '2025-10-20 20:10:23', 0),
(102, 7, 'Sarah Bernhardt', 'Soft Pink', 45, 7, 14.00, 11.00, 1, 0, 'https://fiftyflowers.com/cdn/shop/files/sarah-bernhardt-pink-peonies-stem_d734.webp?v=1757095377&width=480', 'Romantic soft pink peony with layered petals and rich scent.', 'stem', 'In Stock: 54', '2025-10-20 20:10:23', '2025-10-20 20:10:23', 54),
(103, 8, 'Endless Summer', 'Blue', 40, 6, 10.00, 8.00, 1, 0, 'https://cailinicoastal.com/cdn/shop/files/DTS_20230503_CailiniCoastal_0001_620x.jpg?v=1683237008', 'Blue hydrangea with large, rounded flower heads for full arrangements.', 'stem', NULL, '2025-10-20 20:10:23', '2025-10-20 20:10:23', 0),
(104, 9, 'La Paris', 'Peach', 35, 8, 7.00, 5.00, 1, 0, 'https://www.plantcouture.co.za/cdn/shop/files/FL-DAH-PC14_bac18fe2-11b5-4044-ad19-c3d3615b3c5f.jpg?v=1720165280&width=2400', 'Soft peach carnation with ruffled petals — long-lasting bloom.', 'stem', NULL, '2025-10-20 20:10:23', '2025-10-20 20:10:23', 0),
(105, 10, 'King Protea Pink Ice', 'Pink', 100, 14, 15.00, 12.00, 1, 0, 'https://petaldriven.com/cdn/shop/products/PinkIceProtea.jpg?v=1714854350', 'Large South African protea with striking pink crown-like head.', 'stem', NULL, '2025-10-20 20:10:23', '2025-10-20 20:10:23', 0),
(106, 14, 'Arena III', 'Lavender', 45, 7, 9.00, 7.00, 1, 0, 'https://silksareforever.com/cdn/shop/files/FSA814-LV-CR_1024x1024.jpg?v=1698904229', 'Lavender lisianthus with elegant ruffled petals and long stems.', 'stem', NULL, '2025-10-20 20:10:23', '2025-10-20 20:10:23', 0),
(107, 12, 'Amandine Pink', 'Light Pink', 35, 6, 10.00, 8.00, 1, 0, 'https://www.trianglenursery.co.uk/pictures/products/medium/RANUNCULUS-AMANDINE-ROSE-45cm.jpg?v=638485200399683705', 'Soft pink ranunculus with tightly layered petals — delicate and fresh.', 'stem', NULL, '2025-10-20 20:10:23', '2025-10-20 20:10:23', 0),
(108, 13, 'Mistral Blue', 'Blue-Violet', 30, 5, 9.00, 7.00, 1, 0, 'https://petaldriven.com/cdn/shop/products/Anemone_Mistral_Plus_Blue_04904416-c327-4a52-8bbb-0d50bc18cbc1.jpg?v=1714857195', 'Vibrant blue anemone with dark center — elegant and bold.', 'stem', NULL, '2025-10-20 20:10:23', '2025-11-06 09:11:57', 0),
(109, 15, 'Guardian Blue', 'Blue', 60, 6, 10.00, 8.00, 1, 0, 'https://www.shopnsflowers.co.uk/cdn/shop/files/Delphinium-Guardian-Lavender-110cm-1.jpg?v=1698514279', 'Tall spires of blue delphinium — adds height and structure.', 'stem', 'In Stock: 56', '2025-10-20 20:10:23', '2025-10-20 20:10:23', 56),
(110, 16, 'Potomac Pink', 'Pink', 50, 6, 10.00, 8.00, 1, 1, 'https://info.ballseed.com/dispthumb.aspx?imgsize=Display&imageid=376971', 'Snapdragon variety with pastel pink clustered blooms — classic cottage style.', 'stem', NULL, '2025-10-20 20:10:23', '2025-11-06 06:17:25', 0),
(111, 17, 'Iron White', 'White', 45, 7, 9.00, 7.00, 1, 0, 'https://sakataornamentals.eu/wp-content/uploads/2020/08/Matthiola-Iron-White.jpg', 'White stock with dense spikes and a soft fragrance — elegant filler flower.', 'stem', NULL, '2025-10-20 20:10:23', '2025-10-20 20:10:23', 0),
(112, 18, 'Double Yellow', 'Yellow', 30, 7, 8.00, 6.00, 1, 0, 'https://flowerwholesale.com/image/cache/catalog/Big_Size/FREESIA/FREYELDC-600x600.jpg', 'Bright yellow freesia with trumpet blooms and a sweet fragrance.', 'stem', NULL, '2025-10-20 20:10:23', '2025-10-20 20:10:23', 0),
(113, 19, 'Orange Glow', 'Orange', 40, 5, 8.00, 6.00, 1, 0, 'https://www.longacres.co.uk/Images/Product/Default/xlarge/MINIGERBERAORANGE.jpg', 'Vibrant orange gerbera daisy with long stems and cheerful petals.', 'stem', NULL, '2025-10-20 20:10:23', '2025-10-20 20:10:23', 0),
(114, 20, 'Royal Mix', 'Pastel Mix', 25, 4, 9.00, 7.00, 1, 0, 'https://www.ritchiefeed.com/cdn/shop/products/sweet-peas-high-scent-seeds-392155_grande.png?v=1706056226', 'Pastel-toned sweet peas with a delightful fragrance and delicate blooms.', 'stem', NULL, '2025-10-20 20:10:23', '2025-10-20 20:10:23', 0),
(115, 21, 'Crystal Blush', 'White Blush', 50, 8, 12.00, 9.00, 1, 1, 'https://asiriblooms.com/cdn/shop/products/Crystal-Blush-2_1800x1800.jpg?v=1617286691', 'White calla lily with a soft blush tint — perfect for weddings.', 'stem', NULL, '2025-10-20 20:10:23', '2025-11-06 08:49:33', 0),
(116, 22, 'Anastasia Green', 'Green', 60, 10, 9.00, 7.00, 1, 0, 'https://yucca.gr/wp-content/uploads/2018/02/12003.jpg', 'Green spider chrysanthemum with long petals and vibrant color.', 'stem', 'In Stock: 30', '2025-10-20 20:10:23', '2025-10-20 20:10:23', 30),
(117, 23, 'Fata Morgana', 'Peach', 35, 5, 8.00, 6.00, 1, 0, 'https://i.etsystatic.com/19015903/r/il/376cfd/3216174726/il_fullxfull.3216174726_p2y7.jpg', 'Soft peach scabiosa — airy and romantic bloom.', 'stem', NULL, '2025-10-20 20:10:23', '2025-10-20 20:10:23', 0),
(118, 24, 'Flamingo Feather', 'Magenta', 40, 10, 9.00, 7.00, 1, 0, 'https://emerden.com/cdn/shop/products/Celosia-Flamingo-Feather-3016.jpg?v=1617328235&width=2048', 'Velvet magenta celosia plume adding rich color and texture.', 'stem', NULL, '2025-10-20 20:10:23', '2025-10-20 20:10:23', 0),
(119, 25, 'Love-in-a-Mist', 'Blue', 30, 6, 8.00, 6.00, 1, 0, 'https://www.floralsilk.co.uk/Images/Product/Alternative/xlarge/Y11374L-BL_6.jpg', 'Delicate blue Nigella with lacy foliage — light and whimsical.', 'stem', NULL, '2025-10-20 20:10:23', '2025-10-20 20:10:23', 0),
(120, 27, 'Queeny Lime Orange', 'Coral Orange', 40, 6, 7.00, 5.00, 1, 0, 'https://salinasnursery.co/cdn/shop/files/OrangeZinnia.jpg?v=1754280263&width=1920', 'Bright coral zinnia with warm lime undertones — long-lasting summer bloom.', 'stem', NULL, '2025-10-20 20:10:23', '2025-10-20 20:10:23', 0),
(121, 28, 'Apricot Lemonade', 'Peach Yellow', 45, 4, 8.00, 6.00, 1, 0, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtmrC2tpiwrCOgxrLIOv3IbO4zcF0MN2E5Bw&s', 'Soft apricot-yellow cosmos — airy and elegant.', 'stem', NULL, '2025-10-20 20:10:23', '2025-10-20 20:10:23', 0),
(122, 29, 'Million Star', 'White', 50, 10, 7.00, 5.00, 1, 0, 'https://www.trianglenursery.co.uk/pictures/products/pod/GYPSOPHILA-MILLION-STAR-80cm-20gm-1.jpg?v=638411043993426199', 'Tiny white gypsophila blooms — classic filler for bouquets.', 'stem', NULL, '2025-10-20 20:10:23', '2025-10-20 20:10:23', 0),
(123, 30, 'Parvifolia', 'Green', 60, 14, 6.00, 4.00, 1, 0, 'https://metroflowermarket.com/cdn/shop/files/2_940707d3-2bfb-469a-bce7-705b20ca25ee.png?v=1733491538&width=1445', 'Silvery-green eucalyptus with aromatic, rounded foliage.', 'stem', NULL, '2025-10-20 20:10:23', '2025-10-20 20:10:23', 0),
(124, 31, 'Café au Lait', 'Blush Pink', 40, 5, 12.00, 9.00, 1, 0, 'https://graceandeden.co.uk/wp-content/uploads/2021/11/Cafeaulait_web_SSstyle.jpg', 'Large blush-pink dahlia — elegant centerpiece flower.', 'stem', NULL, '2025-10-20 20:10:23', '2025-11-06 09:11:46', 0),
(143, 1, 'Pink Mondial', 'Soft Pink', 50, 7, 9.00, 7.00, 1, 0, 'https://www.flowerbx.com/media/catalog/product/cache/466bc07fdd9f3406dd5cbfa6621097e2/r/o/rose_pink_mondial_rose_stem_1_8_2_1.jpg', 'Romantic soft pink rose with pale blush tone — perfect for weddings.', 'stem', NULL, '2025-10-20 20:24:06', '2025-10-20 20:24:06', 0),
(144, 1, 'Freedom Spirit', 'Red', 50, 7, 8.00, 6.00, 1, 0, 'https://alisroses.com/wp-content/uploads/2024/09/FREE-SPIRIT2_ALISROSES.jpg', 'Classic red rose with full petals and a vibrant tone — ideal for romantic bouquets.', 'stem', NULL, '2025-10-20 20:24:06', '2025-10-20 20:24:06', 0),
(145, 1, 'Ocean Song', 'Lavender', 50, 7, 9.00, 7.00, 1, 1, 'https://fiftyflowers.com/cdn/shop/files/ocean-song-lavender-rose-wholesale-flowers-stem_b7bd1_62p93.webp?v=1757095206&width=800', 'Elegant lavender rose with subtle dusty tones — modern and soft.', 'stem', NULL, '2025-10-20 20:24:06', '2025-11-06 05:58:13', 0),
(146, 1, 'Cappuccino', 'Nude Peach', 45, 6, 10.00, 8.00, 1, 0, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVSDH1j1nI-HX3Q3mS5vRT5d0ppibhPPH1Pw&s', 'Trendy rose with warm nude and coffee undertones — very popular for neutral palettes.', 'stem', NULL, '2025-10-20 20:24:06', '2025-10-20 20:24:06', 0),
(147, 1, 'Quicksand', 'Beige Pink', 45, 7, 9.00, 7.00, 1, 0, 'https://fiftyflowers.com/cdn/shop/files/quicksand-cream-rose-flowers-wholesale-64-4359-l-vase_ymyv2.webp?v=1757095553&width=800', 'Modern muted rose in sandy beige tones — chic and versatile.', 'stem', NULL, '2025-10-20 20:24:06', '2025-10-20 20:24:06', 0),
(148, 2, 'Polar Star', 'White', 55, 7, 11.00, 9.00, 1, 0, 'https://www.carolinefineflowers.co.za/cdn/shop/files/3_0d9deb36-6322-40ad-8611-7bbae32551a1.jpg?v=1738142353', 'Pure white oriental lily with strong fragrance and refined elegance.', 'stem', NULL, '2025-10-20 20:24:06', '2025-10-20 20:24:06', 0),
(149, 2, 'Sorbonne', 'Pink', 55, 7, 11.00, 9.00, 1, 0, 'https://www.flowerbx.com/media/catalog/product/cache/466bc07fdd9f3406dd5cbfa6621097e2/d/e/deluxe_lily_sorbonne_pink_long_stem_deluxe_lily_stem_2.jpeg', 'Bright pink lily with white edges and a sweet scent — perfect centerpiece flower.', 'stem', NULL, '2025-10-20 20:24:06', '2025-10-20 20:24:06', 0),
(150, 7, 'Coral Charm', 'Coral', 45, 7, 14.00, 11.00, 1, 0, 'https://www.bloomsbythebox.com/img/product/xlarge/07647h__peony_coral_charm_pack__30_stems_.jpg', 'Vibrant coral peony with large, semi-double petals — eye-catching bloom.', 'stem', 'In Stock: 0', '2025-10-20 20:24:06', '2025-10-20 20:24:06', 10),
(151, 7, 'Peony Duchesse de Nemours', 'White', 45, 7, 14.00, 11.00, 1, 0, 'https://www.picturethisai.com/image-handle/website_cmsname/image/1080/235312457766469632.jpeg?x-oss-process=image/format,jpg/resize,s_300&v=1.0', 'Classic white peony with fragrance and full form — timeless choice for weddings.', 'stem', NULL, '2025-10-20 20:24:06', '2025-10-20 20:24:06', 0),
(152, 29, 'White Cloud', 'White', 50, 10, 7.00, 5.00, 1, 0, 'https://www.plantcouture.co.za/cdn/shop/files/FL-GYP-PC1_bb1f4563-dd0a-413b-9419-3d25e9e9e22a.jpg?v=1720165276&width=1200', 'Dense white gypsophila with soft texture — popular bouquet filler.', 'stem', NULL, '2025-10-20 20:24:06', '2025-10-20 20:24:06', 0),
(153, 30, 'Eucalyptus Cinerea', 'Green', 60, 14, 6.00, 4.00, 1, 0, 'https://www.flowerbx.com/media/catalog/product/cache/466bc07fdd9f3406dd5cbfa6621097e2/f/o/foliage_green_cinerea_eucalyptus_foliage_stem_2.jpg', 'Silvery-green rounded eucalyptus leaves — aromatic and long-lasting filler.', 'stem', NULL, '2025-10-20 20:24:06', '2025-10-20 20:24:06', 0),
(154, 12, 'Ranunculus Cloni Hanoi', 'Blush Pink', 35, 6, 10.00, 8.00, 1, 0, 'https://www.rioroses.com/wp-content/uploads/2024/08/Ginette-Lightbox1.jpg', 'Soft blush pink ranunculus — elegant layered bloom ideal for romantic bouquets.', 'stem', NULL, '2025-10-20 20:24:06', '2025-10-20 20:24:06', 0),
(155, 31, 'Dahlia Thomas Edison', 'Purple', 40, 5, 12.00, 9.00, 1, 0, 'https://fiftyflowers.com/cdn/shop/files/plate-thomas-edison-dinner-dahlia-flowers-wholesale_60_7892_l_xn492.webp?v=1757095926&width=800', 'Large purple dahlia with dramatic depth and velvet texture.', 'stem', 'In Stock: 8', '2025-10-20 20:24:06', '2025-10-20 20:24:06', 8),
(156, 14, 'Lisianthus Voyage Champagne', 'Champagne', 45, 7, 9.00, 7.00, 1, 0, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3uqpvTacap-Lx0RSpkRokgbNR3vgmcolFwA&s', 'Champagne lisianthus with ruffled petals — soft and sophisticated.', 'stem', NULL, '2025-10-20 20:24:06', '2025-10-20 20:24:06', 0),
(157, 22, 'Chrysanthemum Baltica White', 'White', 60, 10, 9.00, 7.00, 1, 0, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdz08o7rg2fRpX5yDJ7qlvZ9bwXFJSIfrZxw&s', 'Fluffy white chrysanthemum with soft texture — long vase life.', 'stem', NULL, '2025-10-20 20:24:06', '2025-10-20 20:24:06', 0),
(158, 24, 'Veronica Blue', 'Blue', 45, 8, 8.00, 6.00, 1, 0, 'https://b4078456.smushcdn.com/4078456/wp-content/uploads/2024/10/Artificial-Veronica-Stem-Blue-70cm-500x500.jpg?lossy=0&strip=1&webp=1', 'Slim spiked blue veronica — adds height and texture to designs.', 'stem', NULL, '2025-10-20 20:24:06', '2025-10-20 20:24:06', 0),
(159, 23, 'Scabiosa Black Knight', 'Deep Purple', 35, 5, 8.00, 6.00, 1, 0, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9lqfAfLDbxMU4PCOL9XGmjOrwQ1SgwGuWuQ&s', 'Deep plum scabiosa with rich tone — dramatic accent flower.', 'stem', NULL, '2025-10-20 20:24:06', '2025-10-20 20:24:06', 0),
(160, 17, 'Stock Apricot', 'Peach', 45, 7, 9.00, 7.00, 1, 0, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTevA-U711Z3T9QqCOChkpablgqi-xERROeDg&s', 'Sweetly scented apricot stock with dense petals and soft pastel tone.', 'stem', NULL, '2025-10-20 20:24:06', '2025-10-20 20:24:06', 0),
(161, 8, 'Paniculata', 'Cream', 70, 14, 50.00, 40.00, 1, 0, 'https://terramaniashop.com/cdn/shop/files/artificial-hydrangea-paniculata-cream-abigail-ahern.jpg?v=1738702332&width=1445', 'The Paniculata Hydrangea features large, conical clusters that open creamy white and fade to soft pink as they mature. Each sturdy stem has lush, full blooms that hold their shape well, adding volume and elegance to bouquets, centerpieces, and event décor.', 'stem', NULL, '2025-10-23 07:32:23', '2025-10-23 07:32:30', 0),
(162, 1, 'Anika', 'Red', 10, 10, 10.00, 8.00, 0, 0, 'https://flowerexplosion.com/cdn/shop/products/uio_9867.jpg?v=1713462189&width=600', 'little description', 'stem', NULL, '2025-10-23 10:11:13', '2025-10-23 10:11:13', 0),
(163, 13, 'Galilee', 'Pink', 40, 5, 8.00, 6.00, 1, 0, 'https://www.dutchgrown.com/cdn/shop/files/Anemone_Galilee_Pink-3.jpg?v=1714772292', 'The Anemone Galilee Pink offers radiant pink blooms that will add vibrant color to your garden or floral arrangement.', 'stem', NULL, '2025-11-06 06:01:18', '2025-11-06 06:01:29', 0);

-- --------------------------------------------------------

--
-- Table structure for table `FlowerTypes`
--

CREATE TABLE `FlowerTypes` (
  `type_id` int(11) NOT NULL,
  `type_name` varchar(255) NOT NULL,
  `default_shelf_life` int(11) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `FlowerTypes`
--

INSERT INTO `FlowerTypes` (`type_id`, `type_name`, `default_shelf_life`, `notes`, `createdAt`, `updatedAt`) VALUES
(1, 'Rose', 7, NULL, '2025-10-09 07:45:52', '2025-10-09 07:45:52'),
(2, 'Lily', 5, NULL, '2025-10-09 08:01:08', '2025-10-09 08:01:09'),
(3, 'Tulip', 6, NULL, '2025-10-09 08:01:10', '2025-10-09 08:01:10'),
(4, 'Orchid', 10, NULL, '2025-10-09 08:38:24', '2025-10-09 08:38:25'),
(5, 'Sunflower', 8, NULL, '2025-10-09 08:38:25', '2025-10-09 08:38:26'),
(6, 'Daisy', 5, NULL, '2025-10-09 08:38:27', '2025-10-09 08:38:27'),
(7, 'Peony', 7, NULL, '2025-10-09 08:38:27', '2025-10-09 08:38:28'),
(8, 'Hydrangea', 6, NULL, '2025-10-09 08:38:28', '2025-10-09 08:38:29'),
(9, 'Carnation', 10, NULL, '2025-10-09 08:38:29', '2025-10-09 08:38:30'),
(10, 'Protea', 12, NULL, '2025-10-09 08:38:30', '2025-10-09 08:38:30'),
(11, 'Alstroemeria', 10, NULL, '2025-10-19 02:37:48', '2025-10-19 02:37:48'),
(12, 'Ranunculus', 6, '', '2025-10-19 02:40:06', '2025-10-19 02:40:06'),
(13, 'Anemone', 5, NULL, '2025-10-19 02:40:31', '2025-10-19 02:40:31'),
(14, 'Lisianthus', 8, NULL, '2025-10-19 02:40:47', '2025-10-19 02:40:47'),
(15, 'Delphinium', 4, NULL, '2025-10-19 02:41:09', '2025-10-19 02:41:09'),
(16, 'Snapdragon', 7, NULL, '2025-10-19 02:41:23', '2025-10-19 02:41:23'),
(17, 'Stock', 7, NULL, '2025-10-19 02:41:35', '2025-10-19 02:41:35'),
(18, 'Freesia', 7, NULL, '2025-10-19 02:41:49', '2025-10-19 02:41:49'),
(19, 'Gerbera Daisy', 8, NULL, '2025-10-19 02:42:21', '2025-10-19 02:42:21'),
(20, 'Sweet Pea', 4, NULL, '2025-10-19 02:42:39', '2025-10-19 02:42:39'),
(21, 'Calla Lily', 8, NULL, '2025-10-19 02:43:06', '2025-10-19 02:43:06'),
(22, 'Chrysanthemum', 14, NULL, '2025-10-19 02:43:18', '2025-10-19 02:43:18'),
(23, 'Scabiosa', 7, NULL, '2025-10-19 02:43:33', '2025-10-19 02:43:33'),
(24, 'Celosia', 10, NULL, '2025-10-19 02:43:52', '2025-10-19 02:43:52'),
(25, 'Nigella', 6, NULL, '2025-10-19 02:44:07', '2025-10-19 02:44:07'),
(26, 'Alstroemeria', 10, NULL, '2025-10-19 02:44:18', '2025-10-19 02:44:18'),
(27, 'Zinnia', 6, NULL, '2025-10-19 02:44:34', '2025-10-19 02:44:34'),
(28, 'Cosmos', 4, NULL, '2025-10-19 02:44:53', '2025-10-19 02:44:53'),
(29, 'Baby’s Breath', 7, NULL, '2025-10-19 02:45:13', '2025-10-19 02:45:13'),
(30, 'Eucalyptus', 15, NULL, '2025-10-19 02:45:23', '2025-10-19 02:45:23'),
(31, 'Dahlia', 6, NULL, '2025-10-20 19:27:39', '2025-10-20 19:27:39'),
(32, 'Veronica', NULL, NULL, '2025-10-20 20:22:52', '2025-10-20 20:22:52');

-- --------------------------------------------------------

--
-- Table structure for table `HarvestBatches`
--

CREATE TABLE `HarvestBatches` (
  `harvestBatch_id` int(11) NOT NULL,
  `flower_id` int(11) NOT NULL,
  `harvestDateTime` datetime DEFAULT NULL,
  `expiryDate` date DEFAULT NULL,
  `totalStemsHarvested` int(11) NOT NULL,
  `status` enum('Fresh','InColdroom','PartiallyShipped','ShippedOut','Discarded') NOT NULL DEFAULT 'Fresh',
  `saleStatus` enum('Normal','ExpiringSoon','Expired') DEFAULT 'Normal',
  `harvestedByEmployeeID` int(11) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `HarvestBatches`
--

INSERT INTO `HarvestBatches` (`harvestBatch_id`, `flower_id`, `harvestDateTime`, `expiryDate`, `totalStemsHarvested`, `status`, `saleStatus`, `harvestedByEmployeeID`, `notes`, `createdAt`, `updatedAt`) VALUES
(1, 2, '2025-10-09 07:45:55', '2025-11-13', 120, 'InColdroom', 'Normal', NULL, NULL, '2025-10-09 07:45:55', '2025-10-09 07:45:56'),
(2, 3, '2025-10-09 08:01:15', '2025-11-13', 80, 'InColdroom', 'Normal', NULL, NULL, '2025-10-09 08:01:15', '2025-10-09 08:01:16'),
(3, 4, '2025-10-09 08:01:18', '2025-11-13', 150, 'InColdroom', 'Normal', NULL, NULL, '2025-10-09 08:01:18', '2025-10-09 08:01:18'),
(4, 5, '2025-10-09 08:03:15', '2025-11-13', 65, 'InColdroom', 'Normal', NULL, NULL, '2025-10-09 08:03:15', '2025-10-09 09:34:07'),
(5, 6, '2025-10-09 08:03:21', '2025-11-13', 144, 'InColdroom', 'Normal', NULL, NULL, '2025-10-09 08:03:21', '2025-10-09 08:03:21'),
(6, 2, '2025-09-25 00:00:00', '2025-10-02', 10, 'InColdroom', 'Normal', NULL, '', '2025-10-09 09:23:27', '2025-11-06 00:58:33'),
(7, 6, '2025-10-01 00:00:00', '2025-10-07', 40, 'InColdroom', 'Normal', NULL, '', '2025-10-09 09:23:48', '2025-11-06 00:58:29'),
(8, 27, '2025-10-18 00:00:00', '2025-10-23', 20, 'InColdroom', 'Normal', NULL, 'Great Quality', '2025-10-09 09:35:08', '2025-10-23 07:32:52'),
(9, 28, '2025-10-18 00:00:00', '2025-11-01', 30, 'InColdroom', 'Normal', NULL, '', '2025-10-09 09:55:32', '2025-11-06 00:58:23'),
(10, 3, '2025-10-17 00:00:00', '2025-11-13', 20, 'InColdroom', 'Normal', NULL, '', '2025-10-18 21:30:50', '2025-10-18 21:30:50'),
(11, 2, '2025-10-12 00:00:00', '2025-11-13', 10, 'InColdroom', 'Normal', NULL, '', '2025-10-18 21:31:11', '2025-10-18 21:31:22'),
(12, 4, '2025-10-04 00:00:00', '2025-11-13', 10, 'InColdroom', 'Normal', NULL, '', '2025-10-18 21:32:04', '2025-10-18 21:32:04'),
(13, 31, '2025-10-13 00:00:00', '2025-11-13', 20, 'InColdroom', 'Normal', NULL, '', '2025-10-18 21:32:54', '2025-10-18 21:33:03'),
(14, 2, '2025-10-19 00:00:00', '2025-10-26', 10, 'InColdroom', 'Normal', NULL, '', '2025-10-19 20:32:29', '2025-10-19 20:34:55'),
(15, 3, '2025-10-17 00:00:00', '2025-10-22', 10, 'InColdroom', 'Normal', NULL, '', '2025-10-19 20:34:43', '2025-10-19 20:34:49'),
(16, 10, '2025-10-20 00:00:00', '2025-10-26', 10, 'InColdroom', 'Normal', NULL, '', '2025-10-20 12:49:47', '2025-10-20 12:49:54'),
(17, 5, '2025-11-06 00:00:00', '2025-11-13', 100, 'InColdroom', 'Normal', NULL, '', '2025-11-06 00:44:45', '2025-11-06 00:45:20'),
(18, 2, '2025-11-06 00:00:00', '2025-11-13', 100, 'InColdroom', 'Normal', NULL, '', '2025-11-06 00:44:56', '2025-11-06 00:45:20'),
(19, 124, '2025-11-06 00:00:00', '2025-11-11', 70, 'InColdroom', 'Normal', NULL, '', '2025-11-06 00:45:15', '2025-11-06 00:45:19'),
(20, 4, '2025-11-06 00:00:00', '2025-11-12', 14, 'InColdroom', 'Normal', NULL, '', '2025-11-06 00:57:15', '2025-11-06 00:58:21'),
(21, 31, '2025-11-06 00:00:00', '2025-11-11', 34, 'InColdroom', 'Normal', NULL, '', '2025-11-06 00:57:25', '2025-11-06 00:58:22'),
(22, 104, '2025-11-05 00:00:00', '2025-11-13', 91, 'InColdroom', 'Normal', NULL, '', '2025-11-06 01:36:22', '2025-11-06 01:36:47'),
(23, 157, '2025-11-04 00:00:00', '2025-11-14', 84, 'InColdroom', 'ExpiringSoon', NULL, '', '2025-11-06 01:36:31', '2025-11-06 01:36:47'),
(24, 150, '2025-11-04 00:00:00', '2025-11-11', 20, 'InColdroom', 'Normal', NULL, '', '2025-11-06 01:36:41', '2025-11-06 01:36:45'),
(25, 116, '2025-11-02 00:00:00', '2025-11-12', 30, '', 'Normal', NULL, '', '2025-11-06 01:37:08', '2025-11-06 01:37:12'),
(26, 152, '2025-11-04 00:00:00', '2025-11-14', 200, '', 'Normal', NULL, '', '2025-11-06 01:38:43', '2025-11-06 01:38:47'),
(27, 122, '2025-11-06 00:00:00', '2025-11-16', 20, '', 'Normal', NULL, '', '2025-11-06 01:41:50', '2025-11-06 01:41:54'),
(28, 152, '2025-11-05 00:00:00', '2025-11-15', 14, '', 'Normal', NULL, '', '2025-11-06 01:46:35', '2025-11-06 01:46:41'),
(29, 152, '2025-11-05 00:00:00', '2025-11-15', 14, '', 'Normal', NULL, '', '2025-11-06 01:46:36', '2025-11-06 01:46:45'),
(30, 100, '2025-11-06 00:00:00', '2025-11-12', 12, '', 'Normal', NULL, '', '2025-11-06 01:48:26', '2025-11-06 01:48:31'),
(31, 4, '2025-11-06 00:00:00', '2025-11-12', 20, '', 'Normal', NULL, '', '2025-11-06 06:33:38', '2025-11-06 06:34:08'),
(32, 5, '2025-11-06 00:00:00', '2025-11-13', 109, 'InColdroom', 'Normal', NULL, 'Great Quality', '2025-11-06 06:46:17', '2025-11-06 08:39:46'),
(33, 100, '2025-11-06 00:00:00', '2025-11-12', 20, 'InColdroom', 'Normal', NULL, '', '2025-11-06 06:46:29', '2025-11-06 08:39:44'),
(34, 100, '2025-11-06 00:00:00', '2025-11-12', 10, 'InColdroom', 'Normal', NULL, '', '2025-11-06 06:48:37', '2025-11-06 06:57:09'),
(35, 100, '2025-11-06 00:00:00', '2025-11-12', 10, 'InColdroom', 'Normal', NULL, '', '2025-11-06 06:48:38', '2025-11-06 06:57:04'),
(36, 100, '2025-11-04 00:00:00', '2025-11-10', 29, 'InColdroom', 'Normal', NULL, '', '2025-11-06 06:52:58', '2025-11-06 06:52:58'),
(37, 100, '2025-11-04 00:00:00', '2025-11-10', 29, 'InColdroom', 'Normal', NULL, '', '2025-11-06 06:56:27', '2025-11-06 06:56:27'),
(38, 100, '2025-11-04 00:00:00', '2025-11-10', 29, 'InColdroom', 'Normal', NULL, '', '2025-11-06 06:56:52', '2025-11-06 06:56:52'),
(39, 2, '2025-11-06 00:00:00', '2025-11-13', 20, 'InColdroom', 'Normal', NULL, '', '2025-11-06 08:25:50', '2025-11-06 08:25:50'),
(40, 2, '2025-11-06 00:00:00', '2025-11-13', 20, 'InColdroom', 'Normal', NULL, '', '2025-11-06 08:27:42', '2025-11-06 08:27:42'),
(41, 2, '2025-11-06 00:00:00', '2025-11-13', 2, 'InColdroom', 'Normal', NULL, '', '2025-11-06 08:32:15', '2025-11-06 08:32:15'),
(42, 2, '2025-11-06 00:00:00', '2025-11-13', 20, 'InColdroom', 'Normal', NULL, '', '2025-11-06 08:33:10', '2025-11-06 08:33:10'),
(43, 2, '2025-11-06 00:00:00', '2025-11-13', 8, 'InColdroom', 'Normal', NULL, '', '2025-11-06 08:34:04', '2025-11-06 08:34:04'),
(44, 116, '2025-11-03 00:00:00', '2025-11-13', 30, 'InColdroom', 'Normal', NULL, '', '2025-11-06 08:36:51', '2025-11-06 08:36:51'),
(45, 28, '2025-11-03 00:00:00', '2025-11-17', 30, 'InColdroom', 'Normal', NULL, '', '2025-11-06 08:39:33', '2025-11-06 08:39:33'),
(46, 109, '2025-11-02 00:00:00', '2025-11-08', 56, 'InColdroom', 'Normal', NULL, '', '2025-11-06 08:40:50', '2025-11-06 08:40:50'),
(47, 155, '2025-11-03 00:00:00', '2025-11-08', 8, 'InColdroom', 'Normal', NULL, '', '2025-11-06 08:41:09', '2025-11-06 08:41:09'),
(48, 102, '2025-11-02 00:00:00', '2025-11-09', 54, 'InColdroom', 'Normal', NULL, '', '2025-11-06 08:41:27', '2025-11-06 08:41:27'),
(49, 2, '2025-11-02 00:00:00', '2025-11-09', 10, 'InColdroom', 'Normal', NULL, '', '2025-11-06 09:12:48', '2025-11-06 09:12:48');

--
-- Triggers `HarvestBatches`
--
DELIMITER $$
CREATE TRIGGER `set_expiry_date_before_insert` BEFORE INSERT ON `HarvestBatches` FOR EACH ROW BEGIN
  DECLARE shelf_days INT;

  -- ???? Fetch shelf_life (in days) from related flower
  SELECT shelf_life INTO shelf_days
  FROM Flowers
  WHERE flower_id = NEW.flower_id;

  -- ???? If shelf_life exists, calculate expiry date
  IF shelf_days IS NOT NULL AND NEW.harvestDateTime IS NOT NULL THEN
    SET NEW.expiryDate = DATE_ADD(NEW.harvestDateTime, INTERVAL shelf_days DAY);
  END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `update_expiry_date_before_update` BEFORE UPDATE ON `HarvestBatches` FOR EACH ROW BEGIN
  DECLARE shelf_days INT;

  -- ???? 1. Fetch shelf_life (in days) from the related flower
  SELECT shelf_life INTO shelf_days
  FROM Flowers
  WHERE flower_id = NEW.flower_id;

  -- ???? 2. Recalculate expiry date when harvest time or flower changes
  IF shelf_days IS NOT NULL AND NEW.harvestDateTime IS NOT NULL THEN
    SET NEW.expiryDate = DATE_ADD(NEW.harvestDateTime, INTERVAL shelf_days DAY);
  END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `update_flower_stock_after_harvest` AFTER INSERT ON `HarvestBatches` FOR EACH ROW BEGIN
  DECLARE total_stems INT DEFAULT 0;

  -- 1️⃣ Calculate total stems in inventory for this flower
  SELECT SUM(i.stemsInColdroom)
  INTO total_stems
  FROM Inventories i
  INNER JOIN HarvestBatches hb ON hb.harvestBatch_id = i.harvestBatch_id
  WHERE hb.flower_id = NEW.flower_id AND i.archived = 0;

  -- 2️⃣ Update flower stock in Flowers table
  UPDATE Flowers
  SET notes = CONCAT('In Stock: ', total_stems)
  WHERE flower_id = NEW.flower_id;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `update_inventory_after_harvestbatch` AFTER INSERT ON `HarvestBatches` FOR EACH ROW BEGIN
  DECLARE total_stems INT;

  -- ✅ Insert or update inventory
  INSERT INTO Inventories (harvestBatch_id, stemsInColdroom, status, archived, createdAt, updatedAt)
  VALUES (NEW.harvestBatch_id, NEW.totalStemsHarvested, 'Fresh', 0, NOW(), NOW())
  ON DUPLICATE KEY UPDATE
    stemsInColdroom = NEW.totalStemsHarvested,
    status = 'Fresh',
    archived = 0,
    updatedAt = NOW();

  -- ✅ Recalculate total available stems for the flower
  SELECT IFNULL(SUM(i.stemsInColdroom), 0)
  INTO total_stems
  FROM Inventories i
  INNER JOIN HarvestBatches hb ON i.harvestBatch_id = hb.harvestBatch_id
  WHERE hb.flower_id = NEW.flower_id
    AND i.archived = 0
    AND i.status != 'Expired';

  -- ✅ Update the flower's total stock count
  UPDATE Flowers
  SET totalStemsAvailable = total_stems
  WHERE flower_id = NEW.flower_id;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `update_inventory_on_harvestbatch_update` AFTER UPDATE ON `HarvestBatches` FOR EACH ROW BEGIN
  IF NEW.status = 'InColdroom' AND OLD.status <> 'InColdroom' THEN
    INSERT INTO Inventories (
      harvestBatch_id,
      stemsInColdroom,
      status,
      archived,
      createdAt,
      updatedAt
    )
    VALUES (
      NEW.harvestBatch_id,
      NEW.totalStemsHarvested,
      'Fresh',
      0,
      NOW(),
      NOW()
    )
    ON DUPLICATE KEY UPDATE
      stemsInColdroom = NEW.totalStemsHarvested,
      status = 'Fresh',
      archived = 0,
      updatedAt = NOW();
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `Inventories`
--

CREATE TABLE `Inventories` (
  `inventory_id` int(11) NOT NULL,
  `harvestBatch_id` int(11) NOT NULL,
  `stemsInColdroom` int(11) NOT NULL DEFAULT 0,
  `status` enum('Fresh','ExpiringSoon','Expired') DEFAULT 'Fresh',
  `archived` tinyint(1) DEFAULT 0,
  `lastUpdated` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Inventories`
--

INSERT INTO `Inventories` (`inventory_id`, `harvestBatch_id`, `stemsInColdroom`, `status`, `archived`, `lastUpdated`, `createdAt`, `updatedAt`) VALUES
(1, 1, 50, 'Fresh', 0, '2025-10-09 07:45:57', '2025-10-09 07:45:56', '2025-11-06 09:39:50'),
(2, 2, 60, 'Fresh', 0, '2025-10-09 08:01:17', '2025-10-09 08:01:16', '2025-11-06 09:39:49'),
(3, 3, 138, 'Fresh', 0, '2025-10-09 08:01:19', '2025-10-09 08:01:19', '2025-11-06 09:39:49'),
(4, 4, 65, 'Fresh', 0, '2025-10-09 08:03:17', '2025-10-09 08:03:17', '2025-11-06 02:45:05'),
(5, 5, 144, 'Fresh', 0, '2025-10-09 08:03:22', '2025-10-09 08:03:22', '2025-11-06 02:45:05'),
(6, 10, 20, 'Fresh', 0, NULL, '2025-10-18 21:30:51', '2025-11-06 02:45:05'),
(7, 11, 10, 'Fresh', 0, NULL, '2025-10-18 21:31:11', '2025-11-06 02:45:05'),
(8, 12, 0, 'ExpiringSoon', 0, NULL, '2025-10-18 21:32:05', '2025-11-06 09:39:49'),
(9, 13, 20, 'Fresh', 0, NULL, '2025-10-18 21:32:54', '2025-11-06 02:45:05'),
(10, 15, 10, 'Fresh', 0, NULL, '2025-10-19 20:34:48', '2025-11-06 02:45:05'),
(11, 14, 10, 'Fresh', 0, NULL, '2025-10-19 20:34:54', '2025-11-06 02:45:05'),
(12, 16, 10, 'Fresh', 0, NULL, '2025-10-20 12:49:54', '2025-11-06 02:45:05'),
(13, 8, 20, 'Fresh', 0, NULL, '2025-10-23 07:32:51', '2025-11-06 02:45:05'),
(14, 19, 70, 'Fresh', 0, NULL, '2025-11-06 00:45:18', '2025-11-06 02:45:05'),
(15, 18, 100, 'Fresh', 0, NULL, '2025-11-06 00:45:20', '2025-11-06 02:45:05'),
(16, 17, 100, 'Fresh', 0, NULL, '2025-11-06 00:45:20', '2025-11-06 02:45:05'),
(17, 20, 14, 'Fresh', 0, NULL, '2025-11-06 00:58:20', '2025-11-06 02:45:05'),
(18, 21, 34, 'Fresh', 0, NULL, '2025-11-06 00:58:21', '2025-11-06 02:45:05'),
(19, 9, 30, 'Fresh', 0, NULL, '2025-11-06 00:58:23', '2025-11-06 02:45:05'),
(20, 7, 40, 'Fresh', 0, NULL, '2025-11-06 00:58:29', '2025-11-06 02:45:05'),
(21, 6, 0, 'ExpiringSoon', 0, NULL, '2025-11-06 00:58:33', '2025-11-06 08:34:57'),
(22, 24, 0, 'Fresh', 0, NULL, '2025-11-06 01:36:44', '2025-11-06 09:39:49'),
(23, 22, 91, 'Fresh', 0, NULL, '2025-11-06 01:36:46', '2025-11-06 09:14:46'),
(24, 23, 84, 'Fresh', 0, NULL, '2025-11-06 01:36:46', '2025-11-06 09:14:59'),
(25, 25, 0, 'Expired', 1, NULL, '2025-11-06 01:37:11', '2025-11-06 01:37:12'),
(26, 26, 0, 'Expired', 1, NULL, '2025-11-06 01:38:47', '2025-11-06 01:38:48'),
(27, 27, 0, 'Expired', 1, NULL, '2025-11-06 01:41:53', '2025-11-06 01:41:54'),
(29, 28, 14, 'Fresh', 0, NULL, '2025-11-06 01:46:40', '2025-11-06 01:46:40'),
(30, 29, 14, 'Fresh', 0, NULL, '2025-11-06 01:46:45', '2025-11-06 01:46:45'),
(31, 30, 12, 'Fresh', 0, NULL, '2025-11-06 01:48:30', '2025-11-06 01:48:30'),
(32, 31, 20, 'Fresh', 0, NULL, '2025-11-06 06:34:07', '2025-11-06 06:34:07'),
(33, 36, 29, 'Fresh', 0, NULL, '2025-11-06 06:52:59', '2025-11-06 06:52:59'),
(35, 37, 29, 'Fresh', 0, NULL, '2025-11-06 06:56:27', '2025-11-06 06:56:27'),
(37, 38, 29, 'Fresh', 0, NULL, '2025-11-06 06:56:52', '2025-11-06 06:56:52'),
(39, 35, 10, 'Fresh', 0, NULL, '2025-11-06 06:57:03', '2025-11-06 06:57:04'),
(41, 34, 10, 'Fresh', 0, NULL, '2025-11-06 06:57:09', '2025-11-06 06:57:09'),
(46, 39, 20, 'Fresh', 0, NULL, '2025-11-06 08:25:50', '2025-11-06 08:25:50'),
(48, 40, 20, 'Fresh', 0, NULL, '2025-11-06 08:27:43', '2025-11-06 08:27:43'),
(50, 41, 2, 'Fresh', 0, NULL, '2025-11-06 08:32:15', '2025-11-06 08:32:15'),
(51, 42, 20, 'Fresh', 0, NULL, '2025-11-06 08:33:11', '2025-11-06 08:33:11'),
(52, 43, 8, 'Fresh', 0, NULL, '2025-11-06 08:34:05', '2025-11-06 08:34:05'),
(53, 44, 30, 'Fresh', 0, NULL, '2025-11-06 08:36:52', '2025-11-06 08:36:52'),
(54, 45, 30, 'Fresh', 0, NULL, '2025-11-06 08:39:33', '2025-11-06 08:39:33'),
(55, 33, 20, 'Fresh', 0, NULL, '2025-11-06 08:39:44', '2025-11-06 08:39:45'),
(57, 32, 218, 'Fresh', 0, NULL, '2025-11-06 08:39:44', '2025-11-06 08:39:46'),
(59, 46, 56, 'Fresh', 0, NULL, '2025-11-06 08:40:51', '2025-11-06 08:40:51'),
(60, 47, 8, 'Fresh', 0, NULL, '2025-11-06 08:41:10', '2025-11-06 08:41:10'),
(61, 48, 54, 'Fresh', 0, NULL, '2025-11-06 08:41:27', '2025-11-06 08:41:27'),
(62, 49, 10, 'Fresh', 0, NULL, '2025-11-06 09:12:48', '2025-11-06 09:12:48');

-- --------------------------------------------------------

--
-- Table structure for table `OrderItems`
--

CREATE TABLE `OrderItems` (
  `orderItem_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `flower_id` int(11) NOT NULL,
  `quantityOrdered` int(11) NOT NULL,
  `unitPrice` decimal(10,2) NOT NULL,
  `discountApplied` decimal(10,2) DEFAULT 0.00,
  `reservationStatus` enum('Reserved','Fulfilled','Cancelled') DEFAULT 'Reserved',
  `reservedQuantity` int(11) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `OrderItems`
--

INSERT INTO `OrderItems` (`orderItem_id`, `order_id`, `flower_id`, `quantityOrdered`, `unitPrice`, `discountApplied`, `reservationStatus`, `reservedQuantity`, `createdAt`, `updatedAt`) VALUES
(1, 1, 2, 10, 20.00, 0.00, 'Reserved', 10, '2025-10-09 08:01:21', '2025-10-09 08:01:21'),
(2, 1, 3, 8, 30.00, 0.00, 'Reserved', 8, '2025-10-09 08:01:22', '2025-10-09 08:01:22'),
(3, 1, 4, 12, 25.00, 0.00, 'Reserved', 12, '2025-10-09 08:01:23', '2025-10-09 08:01:23'),
(4, 2, 4, 12, 25.00, 0.00, 'Reserved', 12, '2025-10-09 08:03:27', '2025-10-09 08:03:27'),
(5, 2, 6, 6, 28.00, 0.00, 'Reserved', 6, '2025-10-09 08:03:28', '2025-10-09 08:03:28'),
(6, 43, 2, 3, 12.00, 0.00, 'Reserved', 0, '2025-11-06 07:05:51', '2025-11-06 07:05:51'),
(7, 43, 124, 1, 12.00, 0.00, 'Reserved', 0, '2025-11-06 07:05:52', '2025-11-06 07:05:52'),
(8, 43, 5, 1, 8.00, 0.00, 'Reserved', 0, '2025-11-06 07:05:52', '2025-11-06 07:05:52'),
(9, 44, 3, 4, 7.00, 0.00, 'Reserved', 0, '2025-11-06 08:17:11', '2025-11-06 08:17:11'),
(10, 44, 150, 4, 14.00, 0.00, 'Reserved', 0, '2025-11-06 08:17:12', '2025-11-06 08:17:12'),
(11, 45, 2, 10, 11.00, 0.00, 'Reserved', 0, '2025-11-06 08:34:56', '2025-11-06 08:34:56'),
(12, 46, 2, 20, 11.00, 0.00, 'Reserved', 0, '2025-11-06 09:13:23', '2025-11-06 09:13:23'),
(13, 47, 150, 10, 14.00, 0.00, 'Reserved', 0, '2025-11-06 09:39:48', '2025-11-06 09:39:48'),
(14, 47, 4, 11, 7.00, 0.00, 'Reserved', 0, '2025-11-06 09:39:49', '2025-11-06 09:39:49'),
(15, 47, 3, 10, 7.00, 0.00, 'Reserved', 0, '2025-11-06 09:39:49', '2025-11-06 09:39:49'),
(16, 47, 2, 10, 11.00, 0.00, 'Reserved', 0, '2025-11-06 09:39:49', '2025-11-06 09:39:49');

--
-- Triggers `OrderItems`
--
DELIMITER $$
CREATE TRIGGER `update_inventory_after_order` AFTER INSERT ON `OrderItems` FOR EACH ROW BEGIN
  DECLARE stems_needed INT DEFAULT 0;
  DECLARE current_batch INT;
  DECLARE available_stems INT;

  SET stems_needed = NEW.quantityOrdered;

  WHILE stems_needed > 0 DO
    SELECT hb.harvestBatch_id, i.stemsInColdroom
    INTO current_batch, available_stems
    FROM HarvestBatches hb
    JOIN Inventories i ON hb.harvestBatch_id = i.harvestBatch_id
    WHERE hb.flower_id = NEW.flower_id
      AND i.archived = 0
      AND i.stemsInColdroom > 0
    ORDER BY hb.harvestDateTime ASC
    LIMIT 1;

    IF available_stems IS NULL THEN
      SET stems_needed = 0;
    ELSEIF available_stems >= stems_needed THEN
      UPDATE Inventories
      SET stemsInColdroom = available_stems - stems_needed,
          updatedAt = NOW()
      WHERE harvestBatch_id = current_batch;
      SET stems_needed = 0;
    ELSE
      UPDATE Inventories
      SET stemsInColdroom = 0,
          updatedAt = NOW()
      WHERE harvestBatch_id = current_batch;
      SET stems_needed = stems_needed - available_stems;
    END IF;
  END WHILE;

  -- Recalculate total available stems
  UPDATE Flowers f
  JOIN (
    SELECT hb.flower_id, SUM(i.stemsInColdroom) AS total
    FROM Inventories i
    JOIN HarvestBatches hb ON hb.harvestBatch_id = i.harvestBatch_id
    WHERE i.archived = 0
    GROUP BY hb.flower_id
  ) AS stock ON f.flower_id = stock.flower_id
  SET f.notes = CONCAT('In Stock: ', stock.total)
  WHERE f.flower_id = NEW.flower_id;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `update_stock_after_order` AFTER INSERT ON `OrderItems` FOR EACH ROW BEGIN
  DECLARE remaining INT;
  DECLARE batch_id INT;
  DECLARE stems_in_batch INT;

  SET remaining = NEW.quantityOrdered;

  -- ???? Loop through harvest batches in FIFO order
  WHILE remaining > 0 DO
    SELECT hb.harvestBatch_id, i.stemsInColdroom
    INTO batch_id, stems_in_batch
    FROM HarvestBatches hb
    INNER JOIN Inventories i ON hb.harvestBatch_id = i.harvestBatch_id
    WHERE hb.flower_id = NEW.flower_id
      AND i.archived = 0
      AND i.status != 'Expired'
      AND i.stemsInColdroom > 0
    ORDER BY hb.harvestDateTime ASC
    LIMIT 1;

    IF batch_id IS NULL THEN
      SET remaining = 0; -- No stock left
    ELSE
      IF stems_in_batch <= remaining THEN
        -- Deplete batch
        UPDATE Inventories
        SET stemsInColdroom = 0,
            status = 'ExpiringSoon',
            updatedAt = NOW()
        WHERE harvestBatch_id = batch_id;
        SET remaining = remaining - stems_in_batch;
      ELSE
        -- Deduct partial quantity
        UPDATE Inventories
        SET stemsInColdroom = stems_in_batch - remaining,
            updatedAt = NOW()
        WHERE harvestBatch_id = batch_id;
        SET remaining = 0;
      END IF;
    END IF;
  END WHILE;

  -- ✅ Refresh flower stock count after deduction
  UPDATE Flowers
  SET totalStemsAvailable = (
    SELECT IFNULL(SUM(i.stemsInColdroom), 0)
    FROM Inventories i
    INNER JOIN HarvestBatches hb ON i.harvestBatch_id = hb.harvestBatch_id
    WHERE hb.flower_id = NEW.flower_id
      AND i.archived = 0
      AND i.status != 'Expired'
  )
  WHERE flower_id = NEW.flower_id;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `Orders`
--

CREATE TABLE `Orders` (
  `order_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `status` enum('Pending','Reserved','Shipped','Delivered','Cancelled','Returned') DEFAULT 'Pending',
  `orderDateTime` datetime DEFAULT NULL,
  `totalAmount` decimal(10,2) DEFAULT 0.00,
  `pickupOrDelivery` enum('Pickup','Delivery') DEFAULT 'Pickup',
  `pickupStoreID` int(11) DEFAULT NULL,
  `shippingAddress` varchar(255) DEFAULT NULL,
  `reservedAt` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Orders`
--

INSERT INTO `Orders` (`order_id`, `user_id`, `status`, `orderDateTime`, `totalAmount`, `pickupOrDelivery`, `pickupStoreID`, `shippingAddress`, `reservedAt`, `createdAt`, `updatedAt`) VALUES
(1, 2, 'Pending', '2025-10-09 08:01:20', 1250.00, 'Delivery', 2, '22 Flower Street, Johannesburg', NULL, '2025-10-09 08:01:20', '2025-11-06 06:35:33'),
(2, 4, 'Cancelled', '2025-10-09 08:03:24', 860.00, 'Pickup', 2, '10 Rose Avenue, Cape Town', NULL, '2025-10-09 08:03:24', '2025-11-06 06:35:36'),
(3, 2, 'Pending', '2025-10-18 21:48:56', 0.00, 'Pickup', NULL, NULL, NULL, '2025-10-18 21:48:56', '2025-10-19 19:33:58'),
(4, 2, 'Cancelled', '2025-10-18 21:49:00', 0.00, 'Pickup', NULL, NULL, NULL, '2025-10-18 21:49:00', '2025-11-06 06:35:38'),
(5, 2, 'Pending', '2025-10-18 21:49:46', 0.00, 'Pickup', NULL, NULL, NULL, '2025-10-18 21:49:46', '2025-11-06 06:35:40'),
(6, 2, 'Delivered', '2025-10-18 21:54:52', 0.00, 'Pickup', NULL, NULL, NULL, '2025-10-18 21:54:52', '2025-10-19 01:19:18'),
(7, 5, 'Delivered', '2025-10-18 21:56:35', 0.00, 'Pickup', NULL, NULL, NULL, '2025-10-18 21:56:35', '2025-10-19 01:19:16'),
(8, 5, 'Cancelled', '2025-10-18 21:57:19', 0.00, 'Pickup', NULL, NULL, NULL, '2025-10-18 21:57:19', '2025-10-19 19:36:02'),
(42, 5, 'Delivered', '2025-10-19 21:29:08', 500.00, 'Pickup', 1, NULL, NULL, '2025-10-19 21:29:07', '2025-11-06 06:35:51'),
(43, 21, 'Pending', '2025-11-06 07:05:51', 58.80, 'Delivery', NULL, NULL, NULL, '2025-11-06 07:05:51', '2025-11-06 07:05:51'),
(44, 12, 'Pending', '2025-11-06 08:17:10', 88.20, 'Delivery', NULL, NULL, NULL, '2025-11-06 08:17:10', '2025-11-06 08:17:10'),
(45, 12, 'Pending', '2025-11-06 08:34:55', 115.50, 'Delivery', NULL, NULL, NULL, '2025-11-06 08:34:55', '2025-11-06 08:34:55'),
(46, 12, 'Delivered', '2025-11-06 09:13:22', 231.00, 'Delivery', NULL, NULL, NULL, '2025-11-06 09:13:22', '2025-11-06 09:14:11'),
(47, 12, 'Pending', '2025-11-06 09:39:48', 416.85, 'Delivery', NULL, NULL, NULL, '2025-11-06 09:39:48', '2025-11-06 09:39:48');

-- --------------------------------------------------------

--
-- Table structure for table `Reviews`
--

CREATE TABLE `Reviews` (
  `review_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `rating` int(11) DEFAULT NULL,
  `comment` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Reviews`
--

INSERT INTO `Reviews` (`review_id`, `order_id`, `user_id`, `rating`, `comment`, `createdAt`, `updatedAt`) VALUES
(1, 1, 2, 5, 'Loved my bouquet! Fresh and beautifully arranged 🌸', '2025-10-09 08:01:24', '2025-10-09 08:01:24'),
(2, 2, 4, 4, 'Gorgeous colors, a few stems were short-lived but still stunning 💐', '2025-10-09 08:03:30', '2025-10-09 08:03:30');

-- --------------------------------------------------------

--
-- Table structure for table `Roles`
--

CREATE TABLE `Roles` (
  `role_id` int(11) NOT NULL,
  `roleName` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Roles`
--

INSERT INTO `Roles` (`role_id`, `roleName`) VALUES
(2, 'Admin'),
(1, 'Customer'),
(3, 'Employee'),
(4, 'Florist');

-- --------------------------------------------------------

--
-- Table structure for table `Stores`
--

CREATE TABLE `Stores` (
  `store_id` int(11) NOT NULL,
  `store_name` varchar(255) NOT NULL,
  `storeLocation` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `isOnline` tinyint(1) DEFAULT 0,
  `contact` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Stores`
--

INSERT INTO `Stores` (`store_id`, `store_name`, `storeLocation`, `address`, `isOnline`, `contact`, `createdAt`, `updatedAt`, `user_id`) VALUES
(1, 'EverBloom HQ', 'Pretoria East', '123 Flower Rd', 1, '0123456789', '2025-10-09 07:45:54', '2025-10-09 07:45:54', NULL),
(2, 'Everbloom Market', 'Johannesburg', '22 Flower Street', 1, '0219876543', '2025-10-09 07:58:45', '2025-10-09 07:58:46', NULL),
(3, 'Cape Bloom Co', 'Cape Town', '10 Rose Avenue', 1, '0211112222', '2025-10-09 08:03:07', '2025-10-09 08:03:07', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `UserRoles`
--

CREATE TABLE `UserRoles` (
  `userRole_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `UserRoles`
--

INSERT INTO `UserRoles` (`userRole_id`, `user_id`, `role_id`, `createdAt`, `updatedAt`) VALUES
(3, 3, 3, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(14, 5, 2, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(18, 9, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(19, 9, 4, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(20, 10, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(21, 10, 4, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(22, 11, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(24, 14, 1, '2025-10-18 20:20:54', '2025-10-18 20:20:54'),
(25, 14, 4, '2025-10-18 20:20:55', '2025-10-18 20:20:55'),
(26, 12, 2, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(28, 2, 1, '2025-10-19 17:57:17', '2025-10-19 17:57:17'),
(34, 8, 3, '2025-10-19 18:43:29', '2025-10-19 18:43:29'),
(35, 4, 3, '2025-11-04 22:25:35', '2025-11-04 22:25:35'),
(36, 15, 1, '2025-11-04 22:26:23', '2025-11-04 22:26:23'),
(37, 15, 4, '2025-11-04 22:26:24', '2025-11-04 22:26:24'),
(38, 16, 4, '2025-11-06 02:37:19', '2025-11-06 02:37:19'),
(39, 17, 3, '2025-11-06 02:41:25', '2025-11-06 02:41:25'),
(40, 18, 3, '2025-11-06 05:38:23', '2025-11-06 05:38:23'),
(41, 1, 1, '2025-11-06 06:40:05', '2025-11-06 06:40:05'),
(42, 21, 4, '2025-11-06 07:05:31', '2025-11-06 07:05:31');

-- --------------------------------------------------------

--
-- Table structure for table `Users`
--

CREATE TABLE `Users` (
  `user_id` int(11) NOT NULL,
  `fullName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `passwordHash` varchar(255) NOT NULL,
  `isActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `phone` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Users`
--

INSERT INTO `Users` (`user_id`, `fullName`, `email`, `passwordHash`, `isActive`, `createdAt`, `updatedAt`, `phone`) VALUES
(1, 'Admin User', 'admin@everbloom.local', '$2b$10$KQF1jJ/ij7hLZePGLvPKWObx6UMDaRdYToF6F1.CltofVbnZX28tu', 1, '2025-10-09 07:40:44', '2025-10-09 07:40:44', NULL),
(2, 'Jess Bloom', 'jess@everbloom.local', 'test1234', 1, '2025-10-09 07:58:44', '2025-10-09 07:58:44', NULL),
(3, 'Emma Employee', 'emma@everbloom.local', 'test1234', 1, '2025-10-09 08:02:59', '2025-10-09 08:02:59', NULL),
(4, 'Luca Petal', 'luca@everbloom.local', 'petal123', 1, '2025-10-09 08:03:01', '2025-10-19 18:16:02', NULL),
(5, 'Anika de Beer', 'anikadebeer2004@gmail.com', '$2b$10$1PjiJtFYNHNEutHhxJnj1OaDYXSHB3Y1f2bUYS2KO/NQ2s5fbpX9a', 1, '2025-10-09 08:34:00', '2025-10-09 08:34:00', NULL),
(6, 'Anika de Beer', 'testmail@gmail.com', '$2b$10$qs4WETy./dkLLf8r.MSDlOylOP.TgjbiuiqEDHzW25Aid9iXIKLFG', 1, '2025-10-18 16:46:36', '2025-10-18 16:46:36', NULL),
(7, 'Anika', 'testmail101@mail.com', '$2b$10$MuOptexWyXZAnW7Pn5XTcONPf0wKIQcRO4dE.wXhSxloa2YRuzXOO', 1, '2025-10-18 16:47:06', '2025-10-18 16:47:06', NULL),
(8, 'Test User', 'testuser@example.com', '$2b$10$KOCo5doZXQ0342wdSf5GHO86xcGbGCSgnKziH7TlQbdOc3Jposavu', 1, '2025-10-18 16:52:12', '2025-10-18 16:52:12', NULL),
(9, 'Anika', 'testmail10@mail.com', '$2b$10$pJxJqjDWV7jqOd6Cb3DS7e9jNF95BZvUGJre8HQCAcWJ31ur3nrU2', 1, '2025-10-18 16:52:48', '2025-10-18 16:52:48', NULL),
(10, 'Guztaf Pretorius', 'GuztafPretorius@mail.com', '$2b$10$SvgWNt4QjVwd4l2Yx7d62ucTh7YQR5cSTAx8mbD6/7DEQCicvACMW', 1, '2025-10-18 16:53:14', '2025-10-18 16:53:14', NULL),
(11, 'Test', 'Test@mail.com', '$2b$10$Y8ja.M59yPG6aKIKMzTpfuAm3dH.wthOKSY3K5iuQ6hCwO8F42qEe', 1, '2025-10-18 16:53:51', '2025-11-06 06:40:20', NULL),
(12, 'Admin User', 'admin@everbloom.com', '$2b$10$J.K134Fl.wACOtf8nxNknO9xgq1eeHUTvKNt2Sa5r9cQ7C4lgLagW', 1, '2025-10-18 22:18:24', '2025-11-06 06:40:17', NULL),
(14, 'Test', 'test123@mail.com', '$2b$10$U3CSnjDHqiAVVhW6IaeElOTO36cz.7YYqjquTtzsz2EO6JJMLwLbS', 1, '2025-10-18 20:20:52', '2025-10-18 20:20:52', NULL),
(15, 'Anika de Beer', 'anikadebeer200@gmail.com', '$2b$10$EMDL27l/rmm5ES0DQXsLDeOO8pY.EzMQIUrY/KB17VQ19h/0hJ0t2', 1, '2025-11-04 22:26:22', '2025-11-04 22:26:22', NULL),
(16, 'Anika de Beer', 'anikadebeer20@gmail.com', '$2b$10$eUHAZgC.aOWTaAlIVWZnCuV/13E/Vs8yVH1QkFaIrYy5C62NKHVp2', 1, '2025-11-06 02:37:19', '2025-11-06 02:37:19', NULL),
(17, 'Anika de Beer', 'anikadebeer2@gmail.com', '$2b$10$QC8dI43z.ZTdl7r4zDtxj.nl7RTMdY0TA5a8OhVTPHSo35kF9eOKC', 1, '2025-11-06 02:41:25', '2025-11-06 02:41:25', NULL),
(18, 'Anika', 'anika1@mail.com', '$2b$10$s8baVEvZkzVaD2G.i5jd.OQFPEWvs.IaTVC4SMhEJE4GtyoZ8lbke', 1, '2025-11-06 05:38:22', '2025-11-06 05:38:22', NULL),
(21, 'Chris Evans', 'Chris@gmail.com', '$2b$10$ft0LyfWFR4BxIldXjtgFPOTvsNldZ45uOdJufPQaKPqVDPMVe7ZVW', 1, '2025-11-06 07:05:30', '2025-11-06 07:05:30', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `AutoSaleLog`
--
ALTER TABLE `AutoSaleLog`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `flower_id` (`flower_id`),
  ADD KEY `harvestBatch_id` (`harvestBatch_id`);

--
-- Indexes for table `ColdroomReservations`
--
ALTER TABLE `ColdroomReservations`
  ADD PRIMARY KEY (`reservation_id`),
  ADD KEY `orderItem_id` (`orderItem_id`),
  ADD KEY `harvestBatch_id` (`harvestBatch_id`);

--
-- Indexes for table `Deliveries`
--
ALTER TABLE `Deliveries`
  ADD PRIMARY KEY (`delivery_id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `Discards`
--
ALTER TABLE `Discards`
  ADD PRIMARY KEY (`discard_id`),
  ADD KEY `harvestBatch_id` (`harvestBatch_id`),
  ADD KEY `discardedByEmployeeID` (`discardedByEmployeeID`);

--
-- Indexes for table `Flowers`
--
ALTER TABLE `Flowers`
  ADD PRIMARY KEY (`flower_id`),
  ADD KEY `type_id` (`type_id`);

--
-- Indexes for table `FlowerTypes`
--
ALTER TABLE `FlowerTypes`
  ADD PRIMARY KEY (`type_id`);

--
-- Indexes for table `HarvestBatches`
--
ALTER TABLE `HarvestBatches`
  ADD PRIMARY KEY (`harvestBatch_id`),
  ADD KEY `flower_id` (`flower_id`);

--
-- Indexes for table `Inventories`
--
ALTER TABLE `Inventories`
  ADD PRIMARY KEY (`inventory_id`),
  ADD UNIQUE KEY `harvestBatch_id` (`harvestBatch_id`);

--
-- Indexes for table `OrderItems`
--
ALTER TABLE `OrderItems`
  ADD PRIMARY KEY (`orderItem_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `flower_id` (`flower_id`);

--
-- Indexes for table `Orders`
--
ALTER TABLE `Orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `pickupStoreID` (`pickupStoreID`);

--
-- Indexes for table `Reviews`
--
ALTER TABLE `Reviews`
  ADD PRIMARY KEY (`review_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `Roles`
--
ALTER TABLE `Roles`
  ADD PRIMARY KEY (`role_id`),
  ADD UNIQUE KEY `roleName` (`roleName`);

--
-- Indexes for table `Stores`
--
ALTER TABLE `Stores`
  ADD PRIMARY KEY (`store_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `UserRoles`
--
ALTER TABLE `UserRoles`
  ADD PRIMARY KEY (`userRole_id`),
  ADD UNIQUE KEY `UserRoles_role_id_user_id_unique` (`user_id`,`role_id`),
  ADD KEY `role_id` (`role_id`);

--
-- Indexes for table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `AutoSaleLog`
--
ALTER TABLE `AutoSaleLog`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ColdroomReservations`
--
ALTER TABLE `ColdroomReservations`
  MODIFY `reservation_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Deliveries`
--
ALTER TABLE `Deliveries`
  MODIFY `delivery_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Discards`
--
ALTER TABLE `Discards`
  MODIFY `discard_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Flowers`
--
ALTER TABLE `Flowers`
  MODIFY `flower_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=164;

--
-- AUTO_INCREMENT for table `FlowerTypes`
--
ALTER TABLE `FlowerTypes`
  MODIFY `type_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `HarvestBatches`
--
ALTER TABLE `HarvestBatches`
  MODIFY `harvestBatch_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `Inventories`
--
ALTER TABLE `Inventories`
  MODIFY `inventory_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT for table `OrderItems`
--
ALTER TABLE `OrderItems`
  MODIFY `orderItem_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `Orders`
--
ALTER TABLE `Orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `Reviews`
--
ALTER TABLE `Reviews`
  MODIFY `review_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `Roles`
--
ALTER TABLE `Roles`
  MODIFY `role_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `Stores`
--
ALTER TABLE `Stores`
  MODIFY `store_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `UserRoles`
--
ALTER TABLE `UserRoles`
  MODIFY `userRole_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE `Users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

-- --------------------------------------------------------

--
-- Structure for view `ColdroomOverview`
--
DROP TABLE IF EXISTS `ColdroomOverview`;

CREATE ALGORITHM=UNDEFINED DEFINER=`434073`@`%` SQL SECURITY DEFINER VIEW `ColdroomOverview`  AS SELECT `f`.`flower_id` AS `flower_id`, `f`.`variety` AS `flower_name`, `f`.`color` AS `color`, `f`.`price_per_stem` AS `price_per_stem`, `f`.`sale_price_per_stem` AS `sale_price_per_stem`, `f`.`is_on_sale` AS `is_on_sale`, `h`.`harvestBatch_id` AS `harvestBatch_id`, `h`.`harvestDateTime` AS `harvestDateTime`, `h`.`expiryDate` AS `expiryDate`, `h`.`saleStatus` AS `saleStatus`, `i`.`inventory_id` AS `inventory_id`, `i`.`stemsInColdroom` AS `stemsInColdroom`, `i`.`status` AS `coldroom_status`, `i`.`archived` AS `archived` FROM ((`Flowers` `f` join `HarvestBatches` `h` on(`f`.`flower_id` = `h`.`flower_id`)) join `Inventories` `i` on(`h`.`harvestBatch_id` = `i`.`harvestBatch_id`)) ;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `AutoSaleLog`
--
ALTER TABLE `AutoSaleLog`
  ADD CONSTRAINT `AutoSaleLog_ibfk_1` FOREIGN KEY (`flower_id`) REFERENCES `Flowers` (`flower_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `AutoSaleLog_ibfk_2` FOREIGN KEY (`harvestBatch_id`) REFERENCES `HarvestBatches` (`harvestBatch_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `ColdroomReservations`
--
ALTER TABLE `ColdroomReservations`
  ADD CONSTRAINT `ColdroomReservations_ibfk_53` FOREIGN KEY (`orderItem_id`) REFERENCES `OrderItems` (`orderItem_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ColdroomReservations_ibfk_54` FOREIGN KEY (`harvestBatch_id`) REFERENCES `HarvestBatches` (`harvestBatch_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Deliveries`
--
ALTER TABLE `Deliveries`
  ADD CONSTRAINT `Deliveries_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `Orders` (`order_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `Discards`
--
ALTER TABLE `Discards`
  ADD CONSTRAINT `Discards_ibfk_49` FOREIGN KEY (`harvestBatch_id`) REFERENCES `HarvestBatches` (`harvestBatch_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Discards_ibfk_50` FOREIGN KEY (`discardedByEmployeeID`) REFERENCES `Users` (`user_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `Flowers`
--
ALTER TABLE `Flowers`
  ADD CONSTRAINT `Flowers_ibfk_1` FOREIGN KEY (`type_id`) REFERENCES `FlowerTypes` (`type_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `HarvestBatches`
--
ALTER TABLE `HarvestBatches`
  ADD CONSTRAINT `HarvestBatches_ibfk_1` FOREIGN KEY (`flower_id`) REFERENCES `Flowers` (`flower_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `Inventories`
--
ALTER TABLE `Inventories`
  ADD CONSTRAINT `Inventories_ibfk_1` FOREIGN KEY (`harvestBatch_id`) REFERENCES `HarvestBatches` (`harvestBatch_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `OrderItems`
--
ALTER TABLE `OrderItems`
  ADD CONSTRAINT `OrderItems_ibfk_25` FOREIGN KEY (`order_id`) REFERENCES `Orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `OrderItems_ibfk_26` FOREIGN KEY (`flower_id`) REFERENCES `Flowers` (`flower_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Orders`
--
ALTER TABLE `Orders`
  ADD CONSTRAINT `Orders_ibfk_68` FOREIGN KEY (`pickupStoreID`) REFERENCES `Stores` (`store_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Orders_ibfk_69` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `Reviews`
--
ALTER TABLE `Reviews`
  ADD CONSTRAINT `Reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `Stores`
--
ALTER TABLE `Stores`
  ADD CONSTRAINT `Stores_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `UserRoles`
--
ALTER TABLE `UserRoles`
  ADD CONSTRAINT `UserRoles_ibfk_57` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `UserRoles_ibfk_58` FOREIGN KEY (`role_id`) REFERENCES `Roles` (`role_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
