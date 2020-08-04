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

CREATE TABLE menu(
  cod_menu INT,
  nombre_entrada VARCHAR(40),
  nombre_segundo VARCHAR(40),
  parte_pollo VARCHAR(20),
  precio DOUBLE,
  stock INT
)

INSERT INTO menu(nombre_entrada,nombre_segundo,parte_pollo,precio,stock) VALUES('Caldo de Gallina','Arroz con Pollo','Pierna',5.50,40),
              ('Ensalada','Aji de Gallina',NULL,5.50,40)

ALTER TABLE menu
ADD PRIMARY KEY (`cod_menu`)
MODIFY `cod_menu` INT(11) NOT NULL
AUTO_INCREMENT, AUTO_INCREMENT=1

CREATE TABLE producto(
  cod_prod INT,
  nombre VARCHAR(40),
  categoria VARCHAR(45),
  precio DOUBLE,
  stock INT
)

INSERT INTO producto(nombre,categoria,precio,stock)
VALUES ('Gaseosa Inka Kola 500ml','Bebidas',2.50,50)

ALTER TABLE producto 
ADD PRIMARY KEY(`cod_prod`)
MODIFY `cod_prod` INT(11) NOT NULL
AUTO_INCREMENT,AUTO_INCREMENT=1

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

CREATE TABLE venta(
  cod_ven INT,
  tipo_pago VARCHAR(20),
  estado_pago VARCHAR(20),
  valor DOUBLE,
  monto_total DOUBLE,
  cod_prod INT,
  cod_menu INT,
  cod_cli INT,
)

INSERT INTO venta(valor_venta,tipo_pago,estado_pago,cod_prod,cod_menu,cod_cli) VALUES (200.5,'Efectivo','Cancelado',1,1,NULL)


ALTER TABLE venta
ADD PRIMARY KEY (`cod_ven`)
ADD CONSTRAINT `fk_cod_prod` FOREIGN KEY (`cod_prod`) REFERENCES `producto`(`cod_prod`)
ADD CONSTRAINT `fk_cod_cli` FOREIGN KEY (`cod_cli`) REFERENCES `cliente`(`cod_cli`)
ADD CONSTRAINT `fk_cod_menu` FOREIGN KEY (`cod_menu`) REFERENCES 
`menu`(`cod_menu`)
MODIFY `cod_ven` INT(11) NOT NULL
AUTO_INCREMENT, AUTO_INCREMENT=1