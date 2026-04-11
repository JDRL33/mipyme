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
      id INTEGER CHECK (id = 1), 
      name	TEXT NOT NULL DEFAULT 'Mi Tienda Pro',
      limitStockDown	INTEGER DEFAULT 5,
      tasa_usd	REAL DEFAULT 580.0,
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
    -- VALORES CALCULABLES stock
    -- = nProducts
    -- = nProviders
    -- = nProducts_stock_down
    -- = nClients
    -- = cDebito
    -- = cPagado
    

    INSERT OR IGNORE INTO store (name) VALUES ('Mi Tienda Pro');

    CREATE TABLE IF NOT EXISTS proveedor (
      id_proveedor	INTEGER NOT NULL,
      nombre	TEXT NOT NULL,
      cantidad_productos	INTEGER,
      a_pagar	REAL, 
      pagado	REAL,
      ultimaFechaEntrada TEXT,
      PRIMARY KEY(id_proveedor AUTOINCREMENT)
    );

    -- VALORES CALCULABLES proveedor
    -- = cantidad_productos

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

    --VALORES CALCULABLES producto_grupo
    -- = cantidad
    -- = cobro_total
    -- = ganancia_total

    CREATE TABLE IF NOT EXISTS producto_independiente (
      id	INTEGER NOT NULL,
      nombre	TEXT NOT NULL,
      moneda	TEXT NOT NULL,
      precio_costo	REAL NOT NULL,
      cantidad	INTEGER,
      id_proveedor	INTEGER NOT NULL,
      id_grupo	INTEGER,
      ganancia	REAL,
      dateOfBuy TEXT NOT NULL,
      PRIMARY KEY(id AUTOINCREMENT),
      FOREIGN KEY(id_grupo) REFERENCES producto_grupo(id_grupo) ON DELETE CASCADE,
      FOREIGN KEY(id_proveedor) REFERENCES proveedor(id_proveedor) ON DELETE CASCADE
      );

      --VALORES CALCULABLES producto_independiente
      -- = ganancia
      
    

--_________REGISTROS DE LA TIENDA____________

    CREATE TABLE IF NOT EXISTS record_buys (
      id	INTEGER ,
      buy_date	TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      id_provider	INTEGER NOT NULL,
      amount_products	INTEGER NOT NULL,
      import	REAL NOT NULL,
      PRIMARY KEY (id AUTOINCREMENT),
      FOREIGN KEY(id_provider) REFERENCES proveedor(id_proveedor) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS record_sales(
      id_sale INTEGER  ,
      buy_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      tasa_usd REAL NOT NULL,
      PRIMARY KEY (id_sale AUTOINCREMENT)
    );
    CREATE TABLE IF NOT EXISTS products_in_deuda(
      id_producto_in_deuda INTEGER ,
      nombre TEXT NOT NULL,
      type_money TEXT ,
      cost_price REAL NOT NULL,
      sale_price REAL NOT NULL,
      id_provider INTEGER,
      id_sale INTEGER,
      amount INTEGER,
      PRIMARY KEY (id_producto_in_deuda AUTOINCREMENT),
      FOREIGN KEY (id_provider) REFERENCES proveedor (id_proveedor) ON DELETE CASCADE

    );
--___________________END____________________________________________________________


    CREATE TABLE IF NOT EXISTS clientes_deuda (
      id	INTEGER NOT NULL,
      nombre	TEXT NOT NULL,
      carnet_identidad	TEXT,
      numero	TEXT,
      usd	REAL NOT NULL,
      cup	REAL NOT NULL,
      id_sale INTEGER ,
      state TEXT DEFAULT 'PENDIENTE' CHECK (state IN ('PENDIENTE','COMPLETADA')),
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
//Funcion para obtener la base de datos para usarla
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

// Funcion para actualizar la tienda
export async function updateStore(store) {
  await executeQuery(
    "UPDATE store SET name=?, limitStockDown = ?, tasa_usd = ?, tasa_eur = ?, nProducts = ?, nProducts_stock_down = ?, nProviders = ?, nClients = ?, cDebito = ?, cPagado = ?, cGanancia = ? WHERE id = ?",
    [
      store.name,
      store.limitStockDown,
      store.tasa_usd,
      store.tasa_eur,
      store.nProducts,
      store.nProducts_stock_down,
      store.nProviders,
      store.nClients,
      store.cDebito,
      store.cPagado,
      store.cGanancia,
      store.id,
    ],
  );
}
//Funcion para actualizar un grupo de productos
export async function updateProductGroup(group) {
  await executeQuery(
    "UPDATE producto_grupo SET nombre = ?, moneda = ?, precio_venta = ?, cantidad = ?, cobro_total = ?, ganancia_total = ? WHERE id_grupo = ?",
    [
      group.nombre,
      group.moneda,
      group.precio_venta,
      group.cantidad,
      group.cobro_total,
      group.ganancia_total,
      group.id_grupo,
    ],
  );
}
//Funcion para actualizar un proveedor
export async function updateProvider(provider) {
  await executeQuery(
    "UPDATE proveedor SET nombre = ?, cantidad_productos = ?, a_pagar = ?, pagado = ?, ultimaFechaEntrada = ? WHERE id_proveedor = ?",
    [
      provider.nombre,
      provider.cantidad_productos,
      provider.a_pagar,
      provider.pagado,
      provider.ultimaFechaEntrada,
      provider.id_proveedor,
    ],
  );
}

// Obteniendo TODOS LOS PROVEEDORES, STOCK y CLIENTS

// Obteniendo datos de la tienda
export async function getStore() {
  const response = await getData("SELECT * FROM store WHERE id = 1");
  return response[0];
}
export async function getProviders() {
  return await getData("SELECT * FROM proveedor");
}
export async function getProductsGroup() {
  return await getData("SELECT * FROM producto_grupo");
}
export async function getProductsIndis() {
  return await getData("SELECT * FROM producto_independiente");
}
export async function getClient() {
  return await getData("SELECT * FROM clientes_deuda");
}
export async function getClientById(id) {
  return await getData("SELECT * FROM clientes_deuda WHERE id = ?", [id]);
}
export async function getGananciaOfTheStore() {
  const response = await getData("SELECT cGanancia FROM store WHERE id = 1");
  return response;
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
// Aniadiendo Productos independientes
export async function addProductIndi(
  pNombre,
  pMoneda,
  pPrecio_costo,
  pCantidad,
  pIdProveedor,
  pIdGrupo,
  pGanancia,
  pDateOfBuy,
) {
  const response = await executeQuery(
    "INSERT INTO producto_independiente ( nombre, moneda, precio_costo, cantidad, id_proveedor, id_grupo, ganancia, dateOfBuy ) VALUES (?,?,?,?,?,?,?,?);",
    [
      pNombre,
      pMoneda,
      pPrecio_costo,
      pCantidad,
      pIdProveedor,
      pIdGrupo,
      pGanancia,
      pDateOfBuy,
    ],
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
// Incrementar o Decrementar pago a proveedor
export async function updatePagoProvider(amount, id) {
  const response = await executeQuery(
    `UPDATE proveedor SET pagado = ${amount} WHERE id_proveedor = ${id}`,
  );
  return response;
}
//Actualizar deuda de los clientes
export async function updateClientPay(id, id_sale, usd, cup) {
  const response = await executeQuery(
    `UPDATE clientes_deuda SET cup = ?, usd = ?, id_sale = ? WHERE id = ?`,
    [cup, usd, id_sale, id],
  );
  return response;
}
// Actualizar ganancias
export async function updateGanancia(amount) {
  const response = await executeQuery(
    `UPDATE store SET cGanancia = ${amount} WHERE id = ${1}`,
  );
  return response;
}
// Actualizar la cantidad del producto independiente
export async function updateamountProductsIndis(amount, id) {
  const response = await executeQuery(
    `UPDATE producto_independiente SET cantidad = ${amount} WHERE id = ${id}`,
  );
  return true;
}
// Buscar los providers por nombre
export async function findByNameProvider(name) {
  const response = await getData(
    `SELECT * FROM proveedor WHERE LOWER(nombre) LIKE '%${name}%'`,
  );
  return response;
}
// Buscar los productos por nombre
export async function findByNameProduct(name) {
  const response = await getData(
    `SELECT * FROM producto_grupo WHERE LOWER(nombre) LIKE '%${name}%'`,
  );
  return response;
}
// Buscar los productos_independientes por nombre
export async function findByNameProductIndi(id_proveedor, name) {
  const response = await getData(
    `SELECT * FROM producto_independiente WHERE LOWER(nombre) LIKE '%${name}%' AND id_proveedor = ?`,
    [id_proveedor],
  );
  return response;
}
// Buscar los clientes por nombre
export async function findByNameClient(name) {
  const response = await getData(
    `SELECT * FROM clientes_deuda WHERE LOWER(nombre) LIKE '%${name}%'`,
  );
  return response;
}
// Buscar los grupos de productos por nombre
export async function findByNameProductGroup(name) {
  const response = await getData(
    `SELECT * FROM producto_grupo WHERE LOWER(nombre) LIKE '%${name}%'`,
  );
  return response;
}
// Obtener proveedor By ID
export async function getProviderById(id) {
  const response = await getData(
    `SELECT * FROM proveedor WHERE id_proveedor = ?`,
    [id],
  );
  return response[0];
}
// Obtener Productos de stock bajos
// export async function getProductsStockDown() {
//   const limit = await getData("SELECT limitStockDown FROM store");
//   return await getData("SELECT * FROM producto_grupo WHERE cantidad <= ?", [
//     limit,
//   ]);
// }

//Obtener los productos por id del proveedor
export async function getProductsByIdProvider(id) {
  const response = await getData(
    "SELECT * FROM producto_independiente WHERE id_proveedor = ?",
    [id],
  );
  return response;
}
//Obtener los productos por id del grupo de producto
export async function getProductsByIdProductGroup(id) {
  const response = await getData(
    "SELECT * FROM producto_independiente WHERE id_grupo = ? ORDER BY dateOfBuy ASC",
    [id],
  );
  console.log(response);
  return response;
}
//Obtener los productoIndi por id
export async function getProductsIndiById(id) {
  const response = await getData(
    "SELECT * FROM producto_independiente WHERE id = ?",
    [id],
  );
  return response;
}
// Eliminar proveedor BY id
export async function delProviderById(id) {
  const response = await executeQuery(
    `DELETE FROM proveedor WHERE id_proveedor = ?`,
    [id],
  );
  return true;
}
// Eliminar grupo de product By id ..
export async function deleteGroupProductById(id) {
  const response = await executeQuery(
    `DELETE FROM producto_grupo WHERE id_grupo = ?`,
    [id],
  );
  return true;
}
// Eliminar producto indi By id ....
export async function deleteProductIndiById(id) {
  const response = await executeQuery(
    `DELETE FROM producto_independiente WHERE id = ?`,
    [id],
  );
  return true;
}
//Eliminar cliente By ID
export async function deleteClientById(id) {
  await executeQuery(`DELETE FROM clientes_deuda WHERE id = ?`, [id]);
  return true;
}
// Utilidades ..
export async function clearDatabase() {
  const db = await getDatabase();
  await db.execAsync(`
    DELETE FROM store;
    DELETE FROM proveedor;
    DELETE FROM producto_independiente;
    DELETE FROM producto_grupo;
    DELETE FROM clientes_deuda;
    DELETE FROM sqlite_sequence;
    VACUUM;
  `);
  dbInstance = null;
  await initDatabase();
}

// VENTAS-------------------------------------------------------
//create sale
export async function createSale(tasa_usd) {
  const response = await executeQuery(
    `INSERT INTO record_sales (tasa_usd) VALUES (?);`,
    [tasa_usd],
  );
  return response.lastInsertRowId;
}
// add a product in sale
export async function addProductInDeuda(
  nombre,
  typeMoney,
  amount,
  costPrice,
  salePrice,
  idProvider,
  idSale,
) {
  try {
    const response = await executeQuery(
      `INSERT INTO products_in_deuda (nombre, type_money, amount, cost_price, sale_price, id_provider, id_sale) VALUES (?,?,?,?,?,?,?);`,
      [nombre, typeMoney, amount, costPrice, salePrice, idProvider, idSale],
    ).finally(() => {
      return true;
    });
  } catch (e) {
    console.error(e);
  }
}
//get products in dued
export async function getProductsInDeuda() {
  const response = await getData("SELECT * FROM products_in_deuda");
  return response;
}
//get sales
export async function getSales() {
  const response = await getData("SELECT * FROM record_sales");
  return response;
}
