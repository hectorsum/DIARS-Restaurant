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