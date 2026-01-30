import * as SQLite from "expo-sqlite";

let dbInstance = null;
let isInitialized = false;
// Inicializar tablas
export async function initDatabase() {
  // Verifico si la base de datos existe y esta inicializada
  if (isInitialized && dbInstance) return dbInstance;

  try {
    // Abro la base de datos para trabajar en ella
    dbInstance = await SQLite.openDatabaseSync("database");

    await dbInstance.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS store (
      id	INTEGER NOT NULL,
      name	TEXT NOT NULL DEFAULT 'Mi Tienda Pro',
      limitStockDown	INTEGER DEFAULT 5,
      tasa_usd	REAL DEFAULT 400.0,
      tasa_eur	REAL DEFAULT 500.0,
      nProducts	INTEGER DEFAULT 0,
      nProviders	INTEGER DEFAULT 0,
      nProducts_stock_down INTEGER DEFAULT 0,
      nClients	INTEGER DEFAULT 0,
      cDebito	REAL DEFAULT 0,
      cPagado	REAL DEFAULT 0,
      cGanancia	REAL DEFAULT 0,
      PRIMARY KEY(id AUTOINCREMENT)
    );

    CREATE TABLE IF NOT EXISTS proveedor (
      id_proveedor	INTEGER NOT NULL,
      nombre	TEXT NOT NULL,
      cantidad_productos	INTEGER,
      a_pagar	REAL,
      pagado	REAL,
      PRIMARY KEY(id_proveedor AUTOINCREMENT)
    );

    CREATE TABLE IF NOT EXISTS producto_grupo (
	    id_grupo	INTEGER NOT NULL,
	    nombre	TEXT NOT NULL,
      moneda	TEXT NOT NULL,
	    precio_venta	REAL NOT NULL,
	    cantidad	INTEGER,
	    cobro_total	REAL,
	    ganancia_total	REAL,
	    PRIMARY KEY(id_grupo AUTOINCREMENT)
    );

    CREATE TABLE IF NOT EXISTS producto_independiente (
      id	INTEGER NOT NULL,
      nombre	TEXT NOT NULL,
      moneda	TEXT NOT NULL,
      precio_costo	REAL NOT NULL,
      cantidad	INTEGER,
      id_proveedor	INTEGER NOT NULL,
      id_grupo	INTEGER NOT NULL,
      ganancia	REAL,
      ultima_fecha_entrada	TEXT NOT NULL,
      PRIMARY KEY(id AUTOINCREMENT),
      FOREIGN KEY(id_grupo) REFERENCES producto_grupo(id_grupo) ON DELETE CASCADE,
      FOREIGN KEY(id_proveedor) REFERENCES proveedor(id_proveedor) ON DELETE CASCADE
      );
      
    CREATE TABLE IF NOT EXISTS clientes_deuda (
      id	INTEGER NOT NULL,
      nombre	TEXT NOT NULL,
      carnet_identidad	TEXT,
      numero	TEXT,
      usd	REAL NOT NULL,
      cup	REAL NOT NULL,
      PRIMARY KEY(id AUTOINCREMENT)
    );
  `);

    isInitialized = true;
    console.log("✅ Base de datos inicializada");
    return dbInstance;
  } catch (error) {
    console.error("❌ Error inicializando DB:", error);
    throw error;
  }
}
export async function getDatabase() {
  if (!dbInstance) {
    await initDatabase();
  }
  return dbInstance;
}
// Funcion par ejecutar querys de SQL
export async function executeQuery(SQLite, params = []) {
  const db = await getDatabase();
  return await db.runAsync(SQLite, params);
}
// Funcion par ejecutar y obtener querys de SQL
export async function getData(sql, params = []) {
  const db = await getDatabase();
  return await db.getAllAsync(sql, params);
}
// Obteniendo datos de la tienda
export async function getStore() {
  const response = await getData("SELECT * FROM store");
  if (response.length == 0) {
    await executeQuery("INSERT INTO store (name) VALUES ('Mi Tienda Pro')");
    return await getData("SELECT * FROM store")[0];
  } else {
    return response[0];
  }
}
// Obteniendo TODOS LOS PROVEEDORES, STOCK y CLIENTS
export async function getProviders() {
  return await getData("SELECT * FROM proveedor");
}
export async function getProductsGroup() {
  return await getData("SELECT * FROM producto_grupo");
}
export async function getClient() {
  return await getData("SELECT * FROM clientes_deuda");
}
// Aniadiendo proveedores
export async function addProvider(
  pNombre,
  pCantidad_productos,
  pA_pagar,
  pPagado,
) {
  const response = await executeQuery(
    "INSERT INTO proveedor ( nombre, cantidad_productos, a_pagar, pagado ) VALUES (?,?,?,?);",
    [pNombre, pCantidad_productos, pA_pagar, pPagado],
  );
  return response.lastInsertRowId;
}
// Aniadiendo Productos
export async function addProduct(
  pNombre,
  pMoneda,
  pPrecio_venta,
  pCantidad,
  pCobroTotal,
  pGanancia,
) {
  const response = await executeQuery(
    "INSERT INTO producto_grupo ( nombre, moneda, precio_venta, cantidad, ganancia_total, cobro_total ) VALUES (?,?,?,?,?,?);",
    [pNombre, pMoneda, pPrecio_venta, pCantidad, pGanancia, pCobroTotal],
  );
  return response.lastInsertRowId;
}
// Aniadiendo Clientes
export async function addClient(
  pNombre,
  pCup,
  pUsd,
  pNumero,
  pCarnet_identidad,
) {
  const response = await executeQuery(
    "INSERT INTO clientes_deuda ( nombre, cup, usd, numero, carnet_identidad) VALUES (?,?,?,?,?);",
    [pNombre, pCup, pUsd, pNumero, pCarnet_identidad],
  );
  return response.lastInsertRowId;
}
// Buscar por nombre los providers
export async function findByNameProvider(name) {
  const response = await getData(
    `SELECT * FROM proveedor WHERE LOWER(nombre) LIKE '%${name}%'`,
  );
  return response;
}
// Buscar por nombre los productos
export async function findByNameProduct(name) {
  const response = await getData(
    `SELECT * FROM producto_grupo WHERE LOWER(nombre) LIKE '%${name}%'`,
  );
  return response;
}
// Buscar por nombre los clientes
export async function findByNameClient(name) {
  const response = await getData(
    `SELECT * FROM clientes_deuda WHERE LOWER(nombre) LIKE '%${name}%'`,
  );
  return response;
}
// Obtener proveedor By ID
export async function getProviderById(id) {
  const response = await getData(
    `SELECT * FROM proveedor WHERE id_proveedor=?`,
    [id],
  );
  return response;
}
// Obtener Productos de stock bajos
export async function getProductsStockDown() {
  const limit = await getData("SELECT limitStockDown FROM store");
  return await getData("SELECT * FROM producto_grupo WHERE cantidad <= ?", [
    limit[0],
  ]);
}
// Eliminar proveedor BY id
export async function delProviderById(id) {
  const response = await executeQuery(
    `DELETE FROM proveedor WHERE id_proveedor = ?`,
    [id],
  );
  return true;
}
// Utilidades
export async function clearDatabase() {
  const db = await getDatabase();
  await db.execAsync(`
    DELETE FROM proveedor;
    DELETE FROM producto_independiente;
    DELETE FROM producto_grupo;
    DELETE FROM clientes_deuda;
    DELETE FROM sqlite_sequence;
    VACUUM;
  `);
}
