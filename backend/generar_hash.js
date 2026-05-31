const bcrypt = require("bcrypt");
bcrypt.hash("admin123", 10).then((hash) => {
  console.log("Ejecuta este SQL en MySQL:");
  console.log(`INSERT INTO usuario (nombre, email, password_hash, rol)
VALUES ('Administrador', 'admin@almacen.com', '${hash}', 'admin');`);
});
