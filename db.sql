CREATE DATABASE banco_db;

CREATE TABLE transacciones
(descripcion varchar(50), fecha varchar(10), monto DECIMAL, cuenta INT);
CREATE TABLE cuentas (id INT, saldo DECIMAL CHECK (saldo >= 0) );
INSERT INTO cuentas values (1, 20000);

----------  transacion ------------
node index.js transaccion 4  5 1500 5-5-2022 papas
------ 10 registros por cuenta-------
node index.js consultas 1
----- saldo actual -----
node index.js saldo-actual 2

