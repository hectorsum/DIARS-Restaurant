CREATE TABLE usuario_emp(
  cod_usuario_emp INT,
  usuario VARCHAR(20) DEFAULT NULL,
  password VARCHAR(20) DEFAULT NULL,
  cod_emp INT
)

ALTER TABLE usuario_emp
ADD PRIMARY KEY(`cod_usuario_emp`)
ADD CONSTRAINT `fk_cod_emp` FOREIGN KEY (`cod_emp`) REFERENCES `empleado` (`cod_emp`)
MODIFY `cod_usuario_emp` INT(11) NOT NULL
AUTO_INCREMENT, AUTO_INCREMENT=1


CREATE TABLE empleado(
  cod_emp INT,
  nombres VARCHAR(40) NOT NULL,
  apellidos VARCHAR(50) NOT NULL,
  dni VARCHAR(8) NOT NULL,
  telefono VARCHAR(9) NOT NULL,
  email VARCHAR(35),
  inicio_horario DATE,
  fin_horario DATE,
  fec_inic_cont DATE NOT NULL,
  fec_fin_cont DATE NOT NULL,
  cod_rol INT
)

ALTER TABLE empleado
ADD PRIMARY KEY (`cod_emp`)
ADD CONSTRAINT `fk_cod_rol` FOREIGN KEY (`cod_rol`) REFERENCES `rol` (`cod_rol`)
MODIFY `cod_emp` INT(11) NOT NULL
AUTO_INCREMENT, AUTO_INCREMENT=1


CREATE TABLE rol(
  cod_rol INT,
  rol_nombre VARCHAR(25)
)

ALTER TABLE rol
ADD PRIMARY KEY (`cod_rol`)
MODIFY `cod_rol` INT(11) NOT NULL
AUTO_INCREMENT, AUTO_INCREMENT=1

CREATE TABLE stock(
  cod_stock INT,
  descripcion VARCHAR(30),
  stock_total INT
)

ALTER TABLE stock
ADD PRIMARY KEY (`cod_stock`)
MODIFY cod_stock INT(11) NOT NULL
AUTO_INCREMENT, AUTO_INCREMENT=1

CREATE TABLE entrada(
  cod_entrada INT,
  nombre_entrada VARCHAR(40),
  precio DOUBLE,
  cod_parte_pollo INT
)

ALTER TABLE entrada
ADD PRIMARY KEY (`cod_entrada`)
MODIFY `cod_entrada` INT(11) NOT NULL
AUTO_INCREMENT, AUTO_INCREMENT=1

CREATE TABLE segundo(
  cod_segundo INT,
  nombre_segundo VARCHAR(40),
  precio DOUBLE,
)

ALTER TABLE segundo
ADD PRIMARY KEY (`cod_segundo`)
MODIFY `cod_segundo` INT(11) NOT NULL
AUTO_INCREMENT, AUTO_INCREMENT=1

CREATE TABLE producto(
  cod_prod INT,
  nombre VARCHAR(40),
  categoria VARCHAR(45),
  precio DOUBLE,
)

INSERT INTO producto(nombre,categoria,precio,stock)
VALUES ('Gaseosa Inka Kola 500ml','Bebidas',2.50,50)

ALTER TABLE producto 
ADD PRIMARY KEY(`cod_prod`)
MODIFY `cod_prod` INT(11) NOT NULL
AUTO_INCREMENT,AUTO_INCREMENT=1
ADD CONSTRAINT `fk_cod_stock_producto` FOREIGN KEY(`cod_stock`) REFERENCES `stock`(`cod_stock`)


CREATE TABLE cliente(
  cod_cli INT,
  nombre VARCHAR(50),
  apellidos VARCHAR(60),
  dni VARCHAR(7),
  telf VARCHAR(9),
  email VARCHAR(40),
  cod_dir INT
)

ALTER TABLE cliente
ADD PRIMARY KEY (`cod_cli`)
ADD CONSTRAINT `fk_cod_cli` FOREIGN KEY (`cod_dir`) REFERENCES `direccion` (`cod_dir`)
MODIFY `cod_cli` INT(11) NOT NULL
AUTO_INCREMENT, AUTO_INCREMENT=1

CREATE TABLE direccion(
  cod_dir INT,
  distrito VARCHAR(30),
  dato_direccion VARCHAR(50)
)
INSERT INTO direccion(distrito,dato_direccion) 
VALUES ('Comas','Mz T Lote 12 Coop. Los Pinos')

ALTER TABLE direccion
ADD PRIMARY KEY (`cod_dir`)
MODIFY `cod_dir` INT(11) NOT NULL,
AUTO_INCREMENT, AUTO_INCREMENT=1

CREATE TABLE tipo_pago(
  cod_tipo_pago INT,
  nombre VARCHAR(30)
)

ALTER TABLE tipo_pago
ADD PRIMARY KEY(`cod_tipo_pago`)
MODIFY cod_tipo_pago INT(11) NOT NULL
AUTO_INCREMENT,AUTO_INCREMENT=1

INSERT INTO tipo_pago(nombre) VALUES('VISA'),('Efectivo')

CREATE TABLE venta(
  cod_ven INT,
  tipo_pago VARCHAR(20),
  estado_pago VARCHAR(20),
  valor DOUBLE,
  monto_total DOUBLE,
  fecha_venta DATE,
  cant_entrada INT,
  cant_segundo INT,
  cant_producto INT,
  parte_pollo_entrada INT,
  parte_pollo_segundo INT,
  cod_prod INT,
  cod_entrada INT,
  cod_segundo INT,
  cod_cli INT,
)

INSERT INTO venta(valor_venta,tipo_pago,estado_pago,cod_prod,cod_menu,cod_cli) VALUES (200.5,'Efectivo','Cancelado',1,1,NULL)


ALTER TABLE venta
ADD PRIMARY KEY (`cod_ven`)
ADD CONSTRAINT `fk_cod_prod` FOREIGN KEY (`cod_prod`) REFERENCES `producto`(`cod_prod`)
ADD CONSTRAINT `fk_cod_cli` FOREIGN KEY (`cod_cli`) REFERENCES `cliente`(`cod_cli`)
ADD CONSTRAINT `fk_cod_entrada` FOREIGN KEY (`cod_entrada`) REFERENCES 
`entrada`(`cod_entrada`)
ADD CONSTRAINT `fk_cod_segundo` FOREIGN KEY (`cod_segundo`) REFERENCES 
`segundo`(`cod_segundo`)
ADD CONSTRAINT `fk_parte_pollo_entrada` FOREIGN KEY(`parte_pollo_entrada`) REFERENCES `stock`(`cod_stock`)
ADD CONSTRAINT `fk_parte_pollo_segundo` FOREIGN KEY(`parte_pollo_segundo`) REFERENCES `stock`(`cod_stock`)
ADD CONSTRAINT `fk_cod_tipo_pago` FOREIGN KEY(`cod_tipo_pago`) REFERENCES `tipo_pago`(`nombre`)
MODIFY `cod_ven` INT(11) NOT NULL
AUTO_INCREMENT, AUTO_INCREMENT=1



DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_venta_local`(IN `in_nombre_segundo` VARCHAR(30), IN `in_nombre_entrada` VARCHAR(30),IN `in_nombre_producto` VARCHAR(30), IN `in_tipo_pago` VARCHAR(45), IN `in_estado_pago` VARCHAR(45), IN `in_valor` DOUBLE, IN `in_monto_total` DOUBLE, IN `in_fecha_venta` TIMESTAMP, IN `in_cant_entrada` INT, IN `in_cant_segundo` INT,IN `in_cant_producto` INT)
begin
    declare cod_prod int;
    declare cod_entrada int;
    declare cod_segundo int;
    begin
    
    set cod_prod=(
                  SELECT `venta`.`cod_prod`
                  FROM `venta` 
                  LEFT JOIN `producto` ON `venta`.`cod_prod` = `producto`.`cod_prod`
                  WHERE `producto`.`nombre_producto` = in_nombre_producto
                  );
    set cod_entrada=(
                  SELECT `venta`.`cod_entrada`
                  FROM `venta` 
	                LEFT JOIN `entrada` ON `venta`.`cod_entrada` = `entrada`.`cod_entrada`
                  WHERE `entrada`.`nombre_entrada` = in_nombre_entrada
                  );
    set cod_segundo=(
                  SELECT `venta`.`cod_segundo`
                  FROM `venta` 
	                LEFT JOIN `segundo` ON `venta`.`cod_segundo` = `segundo`.`cod_segundo`
                  WHERE `segundo`.`nombre_segundo` = in_nombre_segundo
                  );
      INSERT INTO venta(tipo_pago,estado_pago,valor,monto_total,fecha_venta,cant_entrada,cant_segundo,cant_producto,cod_prod,cod_entrada,cod_segundo)
      VALUES(in_tipo_pago,in_estado_pago,in_valor,in_monto_total,in_fecha_venta,in_cant_entrada,in_cant_segundo,in_cant_producto,cod_prod,cod_entrada,cod_segundo);
    END;
END$$
DELIMITER ;