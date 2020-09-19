-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 19, 2020 at 07:58 AM
-- Server version: 8.0.18
-- PHP Version: 7.4.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `restaurant`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `delete_user` (IN `in_cod_usuario_emp` INT(11))  NO SQL
begin
declare cod_emp_temp int;
begin        
SET cod_emp_temp=(
SELECT cod_emp FROM usuario_emp WHERE cod_usuario_emp=in_cod_usuario_emp);      
UPDATE empleado SET estado_cuenta=1 WHERE cod_emp=cod_emp_temp;
DELETE FROM usuario_emp WHERE cod_usuario_emp=in_cod_usuario_emp;
END;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_entrada` (IN `in_nombre_entrada` VARCHAR(40), IN `in_precio` DOUBLE, IN `in_stock` INT(11))  NO SQL
begin
    declare codstock int;
    begin
    
    INSERT INTO stock(descripcion,stock_total)
    VALUES(in_nombre_entrada,in_stock);
    
    set codstock=(
                  SELECT cod_stock
                  FROM stock 
                  WHERE `stock`.`descripcion`= in_nombre_entrada
                  );
      
      INSERT INTO entrada(nombre_entrada,precio,cod_stock)
      VALUES(in_nombre_entrada,in_precio,codstock);
    END;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_product` (IN `in_nombre_producto` VARCHAR(40), IN `in_precio` DOUBLE, IN `in_stock` INT(11))  NO SQL
begin
    declare codstock int;
    begin
    
    INSERT INTO stock(descripcion,stock_total)
    VALUES(in_nombre_producto,in_stock);
    
    set codstock=(
                  SELECT cod_stock
                  FROM stock 
                  WHERE `stock`.`descripcion`= in_nombre_producto
                  );
      
      INSERT INTO producto(nombre_producto,precio,cod_stock)
      VALUES(in_nombre_producto,in_precio,codstock);
    END;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_segundo` (IN `in_nombre_segundo` VARCHAR(40), IN `in_precio` DOUBLE, IN `in_stock` INT(11))  NO SQL
begin
    declare codstock int;
    begin
    
    INSERT INTO stock(descripcion,stock_total)
    VALUES(in_nombre_segundo,in_stock);
    
    set codstock=(
                  SELECT cod_stock
                  FROM stock 
                  WHERE `stock`.`descripcion`= in_nombre_segundo
                  );
      
      INSERT INTO segundo(nombre_segundo,precio,cod_stock)
      VALUES(in_nombre_segundo,in_precio,codstock);
    END;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_user` (IN `in_dni` VARCHAR(8), IN `in_usuario` VARCHAR(20), IN `in_password` VARCHAR(20))  NO SQL
begin
    declare cod_empleado int;
    begin
    set cod_empleado=(
                  SELECT cod_emp
                  FROM empleado 
                  WHERE `empleado`.`dni`= in_dni
                  );
                  
      UPDATE empleado SET estado_cuenta=0 WHERE cod_emp=cod_empleado;
      
      INSERT INTO usuario_emp(usuario,password,cod_emp) VALUES(in_usuario,in_password,cod_empleado);
    END;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_venta_local` (IN `in_nombre_segundo` VARCHAR(45), IN `in_nombre_entrada` VARCHAR(45), IN `in_nombre_producto` VARCHAR(45), IN `in_valor` DOUBLE, IN `in_monto_total` DOUBLE, IN `in_fecha_venta` TIMESTAMP, IN `in_cant_entrada` INT, IN `in_cant_segundo` INT, IN `in_cant_producto` INT, IN `in_tipo_pago` INT(11), IN `in_caja` VARCHAR(50))  begin
    declare in_cod_prod int;
    declare in_cod_entrada int;
    declare in_cod_segundo int;
    declare in_estado_pago VARCHAR(45);
    
    begin
   
    set in_cod_prod=(
        		  SELECT cod_prod 
        		  from producto
                  WHERE `producto`.`nombre_producto`=in_nombre_producto
                  );
    set in_cod_entrada=(
                  SELECT cod_entrada
                  FROM entrada 
                  WHERE `entrada`.`nombre_entrada`=in_nombre_entrada
                  );
    set in_cod_segundo=(
                  SELECT cod_segundo
                  FROM segundo 
                  WHERE `segundo`.`nombre_segundo`=in_nombre_segundo
                  );
      IF in_tipo_pago=1 THEN
      	SET in_estado_pago='Cancelado';
      ELSE
      	SET in_estado_pago='Pendiente';
      END IF;
      
      INSERT INTO venta(caja,cod_tipo_pago,estado_pago,valor,monto_total,fecha_venta,cant_entrada,cant_segundo,cant_producto,cod_prod,cod_entrada,cod_segundo)
      VALUES(in_caja,in_tipo_pago,in_estado_pago,in_valor,in_monto_total,in_fecha_venta,in_cant_entrada,in_cant_segundo,in_cant_producto,in_cod_prod,in_cod_entrada,in_cod_segundo);
    END;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `update_entrada` (IN `in_nombre_entrada` VARCHAR(50), IN `in_precio` DOUBLE, IN `in_stock` INT(11), IN `in_cod_entrada` INT(11))  NO SQL
begin
    declare codstock int;
    begin
    
    UPDATE stock set descripcion=in_nombre_entrada,stock_total=in_stock
    WHERE cod_stock=in_cod_entrada;
        
    set codstock=(
                  SELECT cod_stock
                  FROM stock 
                  WHERE `stock`.`descripcion`= in_nombre_entrada
                  );      
      UPDATE entrada SET nombre_entrada=in_nombre_entrada,precio=in_precio,cod_stock=codstock WHERE cod_entrada=in_cod_entrada;
    END;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `update_product` (IN `in_nombre_producto` VARCHAR(50), IN `in_precio` DOUBLE, IN `in_stock` INT(11), IN `in_cod_prod` INT(11))  NO SQL
begin
    declare codstock int;
    begin
    
    UPDATE stock set descripcion=in_nombre_producto,stock_total=in_stock
    WHERE cod_stock=in_cod_prod;
        
    set codstock=(
                  SELECT cod_stock
                  FROM stock 
                  WHERE `stock`.`descripcion`= in_nombre_producto
                  );      
      UPDATE producto SET nombre_producto=in_nombre_producto,precio=in_precio,cod_stock=codstock WHERE cod_prod=in_cod_prod;
    END;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `update_segundo` (IN `in_nombre_segundo` VARCHAR(50), IN `in_precio` DOUBLE, IN `in_stock` INT(11), IN `in_cod_segundo` INT(11))  NO SQL
begin
    declare codstock int;
    begin
    
    UPDATE stock set descripcion=in_nombre_segundo,stock_total=in_stock
    WHERE cod_stock=in_cod_segundo;
        
    set codstock=(
                  SELECT cod_stock
                  FROM stock 
                  WHERE `stock`.`descripcion`= in_nombre_segundo
                  );      
      UPDATE segundo SET nombre_segundo=in_nombre_segundo,precio=in_precio,cod_stock=codstock WHERE cod_segundo=in_cod_segundo;
    END;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `cliente`
--

CREATE TABLE `cliente` (
  `cod_cli` int(11) NOT NULL,
  `nombre` varchar(50) DEFAULT NULL,
  `apellidos` varchar(60) DEFAULT NULL,
  `dni` varchar(7) DEFAULT NULL,
  `telf` varchar(9) DEFAULT NULL,
  `email` varchar(40) DEFAULT NULL,
  `cod_dir` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `configuracion`
--

CREATE TABLE `configuracion` (
  `cod_config` int(11) NOT NULL,
  `nombre_restaurant` varchar(50) DEFAULT NULL,
  `direccion` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `departamento` varchar(50) DEFAULT NULL,
  `provincia` varchar(50) DEFAULT NULL,
  `distrito` varchar(50) DEFAULT NULL,
  `id_departamento` int(11) NOT NULL,
  `id_provincia` int(11) NOT NULL,
  `id_distrito` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `configuracion`
--

INSERT INTO `configuracion` (`cod_config`, `nombre_restaurant`, `direccion`, `email`, `departamento`, `provincia`, `distrito`, `id_departamento`, `id_provincia`, `id_distrito`) VALUES
(1, 'Manos Nortenas', 'Mz U Lote 40, Urb. Los Pilares', 'manosnortenas@gmail.com', 'Loreto', 'Tahuamanu', 'Iqapari', 4108, 4176, 4177);

-- --------------------------------------------------------

--
-- Table structure for table `direccion`
--

CREATE TABLE `direccion` (
  `cod_dir` int(11) NOT NULL,
  `distrito` varchar(30) DEFAULT NULL,
  `dato_direccion` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `direccion`
--

INSERT INTO `direccion` (`cod_dir`, `distrito`, `dato_direccion`) VALUES
(1, 'Comas', 'Mz T Lote 12 Coop. Los Pinos');

-- --------------------------------------------------------

--
-- Table structure for table `empleado`
--

CREATE TABLE `empleado` (
  `cod_emp` int(11) NOT NULL,
  `nombres` varchar(40) NOT NULL,
  `apellidos` varchar(50) NOT NULL,
  `dni` varchar(8) NOT NULL,
  `telefono` varchar(9) NOT NULL,
  `email` varchar(35) DEFAULT NULL,
  `estado_cuenta` tinyint(1) NOT NULL DEFAULT '1',
  `cod_rol` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `empleado`
--

INSERT INTO `empleado` (`cod_emp`, `nombres`, `apellidos`, `dni`, `telefono`, `email`, `estado_cuenta`, `cod_rol`) VALUES
(1, 'Hector', 'Herrera', '74710901', '924230225', 'hectorsum81@hotmail.com', 0, 1),
(2, 'Naty', 'Villanueva', '74712322', '929233231', 'naty@gmail.com', 1, 2),
(6, 'Maria', 'Lopez', '72732312', '992323211', 'maria@gmail.com', 0, 2);

-- --------------------------------------------------------

--
-- Table structure for table `entrada`
--

CREATE TABLE `entrada` (
  `cod_entrada` int(11) NOT NULL,
  `nombre_entrada` varchar(40) DEFAULT NULL,
  `precio` double DEFAULT NULL,
  `ocultar` tinyint(1) NOT NULL DEFAULT '1',
  `cod_stock` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `entrada`
--

INSERT INTO `entrada` (`cod_entrada`, `nombre_entrada`, `precio`, `ocultar`, `cod_stock`) VALUES
(0, '---Seleccione Entrada---', 0, 0, NULL),
(1, 'Caldo de Cerdo', 2.5, 1, 1),
(2, 'Ensalada Cesar', 2.5, 1, 18),
(4, 'Caldo de Pollo', 2.5, 1, 22),
(5, NULL, NULL, 0, NULL),
(6, 'asda', 123, 1, 25),
(7, 'dasdas', 12, 1, 26),
(8, 'as', 12, 1, 30);

-- --------------------------------------------------------

--
-- Table structure for table `producto`
--

CREATE TABLE `producto` (
  `cod_prod` int(11) NOT NULL,
  `nombre_producto` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `precio` double DEFAULT NULL,
  `ocultar` tinyint(1) NOT NULL DEFAULT '1',
  `cod_stock` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `producto`
--

INSERT INTO `producto` (`cod_prod`, `nombre_producto`, `precio`, `ocultar`, `cod_stock`) VALUES
(0, ' ---Seleccione Producto---', 0, 1, NULL),
(1, 'Rocoto Relleno', 5, 0, 1),
(2, 'Gaseosa Coca Cola 500ml', 2.5, 1, 6),
(3, 'Manzana', 1, 0, 10),
(6, 'asdsa', 12, 0, 11),
(7, 'Gaseosa', 3, 0, 12),
(8, 'Keke', 1, 0, 13),
(9, 'Crema Volteada', 0.5, 0, 14),
(10, 'Mazamorra', 2.5, 1, 15),
(11, 'Cigarro', 5.2, 0, 16),
(12, 'asd', 1, 0, 28),
(13, 'a', 1, 0, 29),
(14, NULL, 5.5, 0, NULL),
(15, NULL, 5.2, 0, NULL),
(16, NULL, NULL, 0, NULL),
(17, NULL, NULL, 1, NULL),
(18, NULL, NULL, 1, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `rol`
--

CREATE TABLE `rol` (
  `cod_rol` int(11) NOT NULL,
  `rol_nombre` varchar(25) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `rol`
--

INSERT INTO `rol` (`cod_rol`, `rol_nombre`) VALUES
(1, 'Administrador'),
(2, 'Caja');

-- --------------------------------------------------------

--
-- Table structure for table `segundo`
--

CREATE TABLE `segundo` (
  `cod_segundo` int(11) NOT NULL,
  `nombre_segundo` varchar(40) DEFAULT NULL,
  `precio` double DEFAULT NULL,
  `ocultar` tinyint(1) NOT NULL DEFAULT '1',
  `cod_stock` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `segundo`
--

INSERT INTO `segundo` (`cod_segundo`, `nombre_segundo`, `precio`, `ocultar`, `cod_stock`) VALUES
(0, ' ---Seleccione Segundo---', 0, 1, NULL),
(1, 'Rocoto Relleno', 5, 0, 1),
(2, 'Arroz con Pollo', 5, 0, 3),
(4, 'Arroz a la cubana', 5, 1, 23),
(5, 'Arroz con Pato', 5.2, 1, 33);

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('GaIH0Vm4EOKBS8YiwUK_E16jTv4EjSfs', 1599880072, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{},\"passport\":{\"user\":1}}');

-- --------------------------------------------------------

--
-- Table structure for table `stock`
--

CREATE TABLE `stock` (
  `cod_stock` int(11) NOT NULL,
  `descripcion` varchar(30) DEFAULT NULL,
  `stock_total` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `stock`
--

INSERT INTO `stock` (`cod_stock`, `descripcion`, `stock_total`) VALUES
(1, 'Rocoto Relleno', 1),
(2, 'Pierna', 50),
(3, 'Arroz con Pollo', 50),
(4, 'Aji de Gallina', 50),
(5, 'Sopa de Pollo', 50),
(6, 'Gaseosa Coca Cola 500ml', 50),
(10, NULL, 50),
(11, NULL, 32),
(12, 'Gaseosa', 100),
(13, 'Keke', 100),
(14, 'Crema Volteada', 100),
(15, 'Mazamorra', 30),
(16, 'Cigarro', 50),
(17, 'Caldo de Gallina', 40),
(18, 'Ensalada Cesar', 40),
(20, NULL, 40),
(22, 'Caldo de Pollo', 40),
(23, 'Arroz a la cubana', 50),
(24, NULL, NULL),
(25, 'asda', 123),
(26, 'dasdas', 12),
(28, 'asd', 1),
(29, 'a', 2),
(30, 'as', 1),
(31, NULL, 20),
(32, NULL, 30),
(33, 'Arroz con Pato', 50),
(34, NULL, NULL),
(35, NULL, NULL),
(36, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tipo_pago`
--

CREATE TABLE `tipo_pago` (
  `cod_tipo_pago` int(11) NOT NULL,
  `nombre` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `tipo_pago`
--

INSERT INTO `tipo_pago` (`cod_tipo_pago`, `nombre`) VALUES
(1, 'Efectivo'),
(2, 'VISA');

-- --------------------------------------------------------

--
-- Table structure for table `usuario_emp`
--

CREATE TABLE `usuario_emp` (
  `cod_usuario_emp` int(11) NOT NULL,
  `usuario` varchar(20) DEFAULT NULL,
  `password` varchar(20) DEFAULT NULL,
  `cod_emp` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `usuario_emp`
--

INSERT INTO `usuario_emp` (`cod_usuario_emp`, `usuario`, `password`, `cod_emp`) VALUES
(1, 'hectorsum', 'r8yg7gpd', 1),
(10, 'mary', '123', 6),
(11, 'Manos Nortenas', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `venta`
--

CREATE TABLE `venta` (
  `cod_ven` int(11) NOT NULL,
  `caja` varchar(50) NOT NULL,
  `cod_tipo_pago` int(11) DEFAULT NULL,
  `estado_pago` varchar(20) DEFAULT NULL,
  `valor` double NOT NULL,
  `monto_total` double NOT NULL,
  `fecha_venta` timestamp NOT NULL,
  `cant_entrada` int(11) DEFAULT '0',
  `cant_segundo` int(11) DEFAULT '0',
  `cant_producto` int(11) DEFAULT '0',
  `cod_prod` int(11) DEFAULT NULL,
  `cod_entrada` int(11) DEFAULT NULL,
  `cod_segundo` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `venta`
--

INSERT INTO `venta` (`cod_ven`, `caja`, `cod_tipo_pago`, `estado_pago`, `valor`, `monto_total`, `fecha_venta`, `cant_entrada`, `cant_segundo`, `cant_producto`, `cod_prod`, `cod_entrada`, `cod_segundo`) VALUES
(52, 'Hector Herrera', 1, 'Pendiente', 17.5, 14.35, '2020-08-16 23:14:25', 1, 2, 2, 1, 1, 2),
(53, 'Hector Herrera', 1, 'Pendiente', 7.5, 6.15, '2020-08-16 23:50:25', 2, 0, 1, 1, 2, 0),
(54, 'Hector Herrera', 1, 'Pendiente', 15, 12.3, '2020-08-17 00:27:04', 2, 2, 0, 0, 2, 1),
(55, 'Hector Herrera', 1, 'Pendiente', 0, 0, '2020-08-17 00:56:54', 0, 0, 0, 1, 1, 0),
(56, 'Hector Herrera', 1, 'Pendiente', 10, 8.2, '2020-08-17 01:24:13', 1, 1, 1, 1, 1, 2),
(57, 'Hector Herrera', 1, 'Pendiente', 20, 16.4, '2020-08-17 01:36:28', 2, 2, 2, 1, 2, 2),
(58, 'Hector Herrera', 1, 'Pendiente', 10, 8.2, '2020-08-17 01:38:36', 1, 1, 1, 1, 1, 1),
(59, 'Hector Herrera', 1, 'Pendiente', 10, 8.2, '2020-08-17 08:19:39', 1, 1, 1, 1, 2, 2),
(60, 'Hector Herrera', 1, 'Pendiente', 5, 4.1, '2020-08-17 08:39:23', 1, 0, 1, 1, 1, 0),
(61, 'Hector Herrera', 2, 'Cancelado', 15, 12.3, '2020-08-19 01:01:36', 0, 2, 2, 1, 0, 1),
(62, 'Hector Herrera', 2, 'Cancelado', 0, 0, '2020-08-19 01:00:14', 0, 0, 0, 0, 0, 0),
(63, 'Hector Herrera', 1, 'Cancelado', 10, 8.2, '2020-08-19 01:40:39', 1, 1, 1, 1, 1, 2),
(64, 'Hector Herrera', 1, 'Cancelado', 10, 8.2, '2020-08-19 01:40:50', 1, 1, 1, 1, 1, 1),
(65, 'Hector Herrera', 1, 'Cancelado', 10, 8.2, '2020-08-19 01:41:31', 1, 1, 1, 1, 1, 2),
(66, 'Hector Herrera', 1, 'Cancelado', 10, 8.2, '2020-08-19 01:42:52', 1, 1, 1, 1, 1, 1),
(67, 'Hector Herrera', 1, 'Pendiente', 0, 0, '2020-08-19 02:09:08', 0, 0, 0, 0, 0, 0),
(68, 'Hector Herrera', 2, 'Pendiente', 10, 8.2, '2020-08-20 09:47:22', 1, 1, 1, 1, 1, 2),
(69, 'Hector Herrera', 1, 'Cancelado', 2.5, 2.05, '2020-08-25 04:23:27', 1, 0, 0, 0, 1, 0),
(70, 'Hector Herrera', 1, 'Cancelado', 8, 6.5600000000000005, '2020-08-28 19:41:30', 1, 1, 1, 9, 1, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`cod_cli`);

--
-- Indexes for table `configuracion`
--
ALTER TABLE `configuracion`
  ADD PRIMARY KEY (`cod_config`);

--
-- Indexes for table `direccion`
--
ALTER TABLE `direccion`
  ADD PRIMARY KEY (`cod_dir`);

--
-- Indexes for table `empleado`
--
ALTER TABLE `empleado`
  ADD PRIMARY KEY (`cod_emp`),
  ADD UNIQUE KEY `dni` (`dni`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_cod_rol` (`cod_rol`);

--
-- Indexes for table `entrada`
--
ALTER TABLE `entrada`
  ADD PRIMARY KEY (`cod_entrada`),
  ADD KEY `fk_cod_stock_entrada` (`cod_stock`);

--
-- Indexes for table `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`cod_prod`),
  ADD KEY `fk_cod_stock_producto` (`cod_stock`);

--
-- Indexes for table `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`cod_rol`);

--
-- Indexes for table `segundo`
--
ALTER TABLE `segundo`
  ADD PRIMARY KEY (`cod_segundo`),
  ADD KEY `fk_cod_stock_segundo` (`cod_stock`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indexes for table `stock`
--
ALTER TABLE `stock`
  ADD PRIMARY KEY (`cod_stock`),
  ADD UNIQUE KEY `descripcion` (`descripcion`);

--
-- Indexes for table `tipo_pago`
--
ALTER TABLE `tipo_pago`
  ADD PRIMARY KEY (`cod_tipo_pago`);

--
-- Indexes for table `usuario_emp`
--
ALTER TABLE `usuario_emp`
  ADD PRIMARY KEY (`cod_usuario_emp`),
  ADD KEY `fk_cod_emp` (`cod_emp`);

--
-- Indexes for table `venta`
--
ALTER TABLE `venta`
  ADD PRIMARY KEY (`cod_ven`),
  ADD KEY `fk_cod_prod` (`cod_prod`),
  ADD KEY `fk_cod_entrada` (`cod_entrada`),
  ADD KEY `fk_cod_segundo` (`cod_segundo`),
  ADD KEY `fk_tipo_pago` (`cod_tipo_pago`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `configuracion`
--
ALTER TABLE `configuracion`
  MODIFY `cod_config` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `direccion`
--
ALTER TABLE `direccion`
  MODIFY `cod_dir` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `empleado`
--
ALTER TABLE `empleado`
  MODIFY `cod_emp` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `entrada`
--
ALTER TABLE `entrada`
  MODIFY `cod_entrada` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `producto`
--
ALTER TABLE `producto`
  MODIFY `cod_prod` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `rol`
--
ALTER TABLE `rol`
  MODIFY `cod_rol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `segundo`
--
ALTER TABLE `segundo`
  MODIFY `cod_segundo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `stock`
--
ALTER TABLE `stock`
  MODIFY `cod_stock` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `tipo_pago`
--
ALTER TABLE `tipo_pago`
  MODIFY `cod_tipo_pago` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `usuario_emp`
--
ALTER TABLE `usuario_emp`
  MODIFY `cod_usuario_emp` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `venta`
--
ALTER TABLE `venta`
  MODIFY `cod_ven` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `empleado`
--
ALTER TABLE `empleado`
  ADD CONSTRAINT `fk_cod_rol` FOREIGN KEY (`cod_rol`) REFERENCES `rol` (`cod_rol`);

--
-- Constraints for table `entrada`
--
ALTER TABLE `entrada`
  ADD CONSTRAINT `fk_cod_stock_entrada` FOREIGN KEY (`cod_stock`) REFERENCES `stock` (`cod_stock`);

--
-- Constraints for table `producto`
--
ALTER TABLE `producto`
  ADD CONSTRAINT `fk_cod_stock_producto` FOREIGN KEY (`cod_stock`) REFERENCES `stock` (`cod_stock`);

--
-- Constraints for table `segundo`
--
ALTER TABLE `segundo`
  ADD CONSTRAINT `fk_cod_stock_segundo` FOREIGN KEY (`cod_stock`) REFERENCES `stock` (`cod_stock`);

--
-- Constraints for table `usuario_emp`
--
ALTER TABLE `usuario_emp`
  ADD CONSTRAINT `fk_cod_emp` FOREIGN KEY (`cod_emp`) REFERENCES `empleado` (`cod_emp`);

--
-- Constraints for table `venta`
--
ALTER TABLE `venta`
  ADD CONSTRAINT `fk_cod_entrada` FOREIGN KEY (`cod_entrada`) REFERENCES `entrada` (`cod_entrada`),
  ADD CONSTRAINT `fk_cod_prod` FOREIGN KEY (`cod_prod`) REFERENCES `producto` (`cod_prod`),
  ADD CONSTRAINT `fk_cod_segundo` FOREIGN KEY (`cod_segundo`) REFERENCES `segundo` (`cod_segundo`),
  ADD CONSTRAINT `fk_tipo_pago` FOREIGN KEY (`cod_tipo_pago`) REFERENCES `tipo_pago` (`cod_tipo_pago`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
