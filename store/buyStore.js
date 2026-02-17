import { create } from "zustand";

const buyStore = create((set, get) => ({
  products: [],
  productsGroups: [],
  productsSearch: [],

  addProduct: (name, pCompra, moneda, count, id_grupo, par, nuevo = false) => {
    const newProduct = {
      name,
      pCompra,
      moneda,
      count,
      id_grupo,
      par,
      nuevo,
    };
    set((state) => ({ products: [...state.products, newProduct] }));
  },
  addProductGroup: (
    name,
    moneda,
    pVenta,
    count,
    cTotal,
    gTotal,
    par,
    nuevo = false,
  ) => {
    const newGroup = {
      name,
      moneda,
      pVenta,
      count,
      cTotal,
      gTotal,
      par,
      nuevo,
    };
    set((state) => ({ productsGroups: [...state.productsGroups, newGroup] }));
  },
  cleanSearch: () => {
    set({ productsSearch: [] });
  },
  findByNameProduct: (search) => {
    const filteredProducts = get().products.filter((item) =>
      item.name.includes(search),
    );

    if (filteredProducts.length > 0) {
      set({ productsSearch: filteredProducts });
    }
  },

  cancelarCompra: () => {
    set({ products: [], productsGroups: [] });
  },
}));
export default buyStore;
