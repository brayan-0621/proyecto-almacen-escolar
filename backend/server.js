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
    const productos = rows.map((r) => ({
      ...r,
      precio_compra: Number(r.precio_compra),
      precio_venta: Number(r.precio_venta),
    }));
    res.json(productos);
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
  const { tipo, descripcion, monto, cliente_id, proveedor_id, items } =
    req.body;

  if (!tipo || !Array.isArray(items) || items.length === 0) {
    return res
      .status(400)
      .json({ error: "tipo e items (con al menos 1 producto) son requeridos" });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    if (tipo === "salida") {
      for (const item of items) {
        const [[prod]] = await conn.query(
          "SELECT stock, nombre_producto FROM producto WHERE id = ? FOR UPDATE",
          [item.producto_id],
        );
        if (!prod) throw new Error(`Producto ${item.producto_id} no existe`);
        if (prod.stock < item.cantidad) {
          throw new Error(
            `Stock insuficiente para "${prod.nombre_producto}" (disponible: ${prod.stock}, solicitado: ${item.cantidad})`,
          );
        }
      }
    }

    const [r] = await conn.query(
      "INSERT INTO movimiento (tipo, observacion, monto_total, fecha, cliente_id, proveedor_id) VALUES (?,?,?,NOW(),?,?)",
      [tipo, descripcion, monto || 0, cliente_id || null, proveedor_id || null],
    );

    for (const item of items) {
      const delta = tipo === "salida" ? -item.cantidad : item.cantidad;
      await conn.query("UPDATE producto SET stock = stock + ? WHERE id = ?", [
        delta,
        item.producto_id,
      ]);
      await conn.query(
        "INSERT INTO movimiento_detalle (movimiento_id, producto_id, cantidad, precio_unitario) VALUES (?,?,?,?)",
        [
          r.insertId,
          item.producto_id,
          item.cantidad,
          item.precio_unitario || 0,
        ],
      );
    }

    await conn.commit();
    res.status(201).json({ id: r.insertId });
  } catch (err) {
    await conn.rollback();
    res.status(400).json({ error: err.message });
  } finally {
    conn.release();
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

app.get("/clientes", auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, nombre, empresa, dni, telefono FROM cliente ORDER BY nombre",
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/proveedores", auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, nombre, razon_social, ruc, telefono, direccion, email FROM proveedor ORDER BY nombre",
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
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
// POST /clientes
app.post("/clientes", auth, async (req, res) => {
  const { nombre, empresa, dni, telefono } = req.body;
  if (!nombre || !dni)
    return res.status(400).json({ error: "nombre y dni son requeridos" });
  try {
    const [r] = await pool.query(
      "INSERT INTO cliente (nombre, empresa, dni, telefono) VALUES (?,?,?,?)",
      [nombre, empresa || null, dni, telefono || null],
    );
    res.status(201).json({ id: r.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /proveedores
app.post("/proveedores", auth, async (req, res) => {
  const { nombre, razon_social, ruc, telefono, direccion, email } = req.body;
  if (!nombre || !ruc)
    return res.status(400).json({ error: "nombre y ruc son requeridos" });
  try {
    const [r] = await pool.query(
      "INSERT INTO proveedor (nombre, razon_social, ruc, telefono, direccion, email) VALUES (?,?,?,?,?,?)",
      [
        nombre,
        razon_social || null,
        ruc,
        telefono || null,
        direccion || null,
        email || null,
      ],
    );
    res.status(201).json({ id: r.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// PUT /clientes/:id
app.put("/clientes/:id", auth, async (req, res) => {
  const { nombre, empresa, dni, telefono } = req.body;
  try {
    await pool.query(
      "UPDATE cliente SET nombre=?, empresa=?, dni=?, telefono=? WHERE id=?",
      [nombre, empresa || null, dni, telefono || null, req.params.id],
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /clientes/:id
app.delete("/clientes/:id", auth, async (req, res) => {
  try {
    await pool.query("DELETE FROM cliente WHERE id=?", [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /proveedores/:id
app.put("/proveedores/:id", auth, async (req, res) => {
  const { nombre, razon_social, ruc, telefono, direccion, email } = req.body;
  try {
    await pool.query(
      "UPDATE proveedor SET nombre=?, razon_social=?, ruc=?, telefono=?, direccion=?, email=? WHERE id=?",
      [
        nombre,
        razon_social || null,
        ruc,
        telefono || null,
        direccion || null,
        email || null,
        req.params.id,
      ],
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /proveedores/:id
app.delete("/proveedores/:id", auth, async (req, res) => {
  try {
    await pool.query("DELETE FROM proveedor WHERE id=?", [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.listen(process.env.PORT || 3000, "0.0.0.0", () =>
  console.log("API en puerto " + (process.env.PORT || 3000)),
);
