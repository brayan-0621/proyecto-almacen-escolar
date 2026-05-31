require("dotenv").config();
const express = require("express");
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "Sin token" });
  try {
    req.user = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Token inválido" });
  }
}

// POST /auth/login
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email y password requeridos" });
  try {
    const [rows] = await pool.query(
      "SELECT * FROM usuario WHERE email = ? AND activo = 1",
      [email],
    );
    if (!rows.length)
      return res.status(401).json({ error: "Credenciales incorrectas" });
    const ok = await bcrypt.compare(password, rows[0].password_hash);
    if (!ok) return res.status(401).json({ error: "Credenciales incorrectas" });
    const token = jwt.sign(
      { id: rows[0].id, email: rows[0].email, rol: rows[0].rol },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    res.json({
      token,
      usuario: {
        id: rows[0].id,
        nombre: rows[0].nombre,
        email: rows[0].email,
        rol: rows[0].rol,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /productos
app.get("/productos", auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, nombre_producto AS nombre, categoria, stock, stock_minimo, precio_compra, precio_venta, descripcion FROM producto ORDER BY nombre_producto",
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /productos
app.post("/productos", auth, async (req, res) => {
  const {
    nombre,
    categoria,
    stock,
    stock_minimo,
    precio_compra,
    precio_venta,
    descripcion,
  } = req.body;
  try {
    const [r] = await pool.query(
      "INSERT INTO producto (nombre_producto, categoria, stock, stock_minimo, precio_compra, precio_venta, descripcion) VALUES (?,?,?,?,?,?,?)",
      [
        nombre,
        categoria,
        stock || 0,
        stock_minimo || 0,
        precio_compra || 0,
        precio_venta || 0,
        descripcion || "",
      ],
    );
    res.status(201).json({ id: r.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /movimientos
app.get("/movimientos", auth, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT m.id, m.tipo, m.observacion AS descripcion,
             m.monto_total AS monto, m.fecha,
             c.nombre AS cliente_nombre, p.nombre AS proveedor_nombre
      FROM movimiento m
      LEFT JOIN cliente c   ON m.cliente_id   = c.id
      LEFT JOIN proveedor p ON m.proveedor_id = p.id
      ORDER BY m.fecha DESC LIMIT 100
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/movimientos", auth, async (req, res) => {
  const { tipo, descripcion, monto, cliente_id, proveedor_id } = req.body;
  try {
    const [r] = await pool.query(
      "INSERT INTO movimiento (tipo, observacion, monto_total, fecha, cliente_id, proveedor_id) VALUES (?,?,?,NOW(),?,?)",
      [tipo, descripcion, monto || 0, cliente_id || null, proveedor_id || null],
    );
    res.status(201).json({ id: r.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /dashboard/kpis
app.get("/dashboard/kpis", auth, async (req, res) => {
  try {
    const [[{ total }]] = await pool.query(
      "SELECT COUNT(*) AS total FROM producto",
    );
    const [[{ bajo_stock }]] = await pool.query(
      "SELECT COUNT(*) AS bajo_stock FROM producto WHERE stock <= stock_minimo",
    );
    const [[{ mov_hoy }]] = await pool.query(
      "SELECT COUNT(*) AS mov_hoy FROM movimiento WHERE DATE(fecha) = CURDATE()",
    );
    const [[{ vendido_hoy }]] = await pool.query(
      "SELECT COALESCE(SUM(monto_total),0) AS vendido_hoy FROM movimiento WHERE tipo='salida' AND DATE(fecha)=CURDATE()",
    );
    res.json({ total_productos: total, bajo_stock, mov_hoy, vendido_hoy });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(process.env.PORT || 3000, "0.0.0.0", () =>
  console.log("API en puerto " + (process.env.PORT || 3000)),
);
