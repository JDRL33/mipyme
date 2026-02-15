import { create } from "zustand";

const buyStore = create((set, get) => ({
  products: [],
  productsGroups: [],

  addProduct: (name, pCompra, moneda, count, id_grupo, nuevo = false) => {
    const newProduct = {
      name,
      pCompra,
      moneda,
      count,
      id_grupo,
      nuevo,
    };
    set((state) => ({ products: [...state.products, newProduct] }));
  },
  // id_grupo	INTEGER NOT NULL,
  //     nombre	TEXT NOT NULL,
  //     moneda	TEXT NOT NULL,
  //     precio_venta	REAL NOT NULL,
  //     cantidad	INTEGER,
  //     cobro_total	REAL,
  //     ganancia_total	REAL,
  //     PRIMARY KEY(id_grupo AUTOINCREMENT)
  addProductGroup: (
    name,
    moneda,
    pVenta,
    count,
    cTotal,
    gTotal,
    nuevo = false,
  ) => {
    const newGroup = {
      name,
      moneda,
      pVenta,
      count,
      cTotal,
      gTotal,
      nuevo,
    };
    set((state) => ({ productsGroups: [...state.productsGroups, newGroup] }));
  },

  cleanProducts: () => {
    set({ products: [] });
  },
}));
export default buyStore;
