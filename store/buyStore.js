import { create } from "zustand";

const buyStore = create((set, get) => ({
  products: [],
  productsGroups: [],
  productsSearch: [],
  par: 1,

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
  plusPar: () => {
    set((state) => ({ par: state.par + 1 }));
  },
  cleanSearch: () => {
    set({ productsSearch: [] });
  },
  findByNameProduct: (search) => {
    const filteredProducts = get().products.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase()),
    );

    if (filteredProducts.length > 0) {
      set({ productsSearch: filteredProducts });
    } else {
      set({ productsSearch: [] });
    }
  },

  cancelarCompra: () => {
    set({ products: [], productsGroups: [], par: 1 });
  },
}));
export default buyStore;
