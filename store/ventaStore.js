import { create } from "zustand";

const ventaStore = create((set, get) => ({
  currentProductEdit: null,
  setCurrentProductEdit: (product) => {
    set({ currentProductEdit: product });
  },
  cartProductsList: [],
  totalPagarUSD: 0.0,
  totalPagarCUP: 0.0,
  totalProducts: 0,
  totalDescontar: 0.0,
  tipoPago: "",
  addCartProduct: (product) => {
    set((state) => ({
      cartProductsList: [...state.cartProductsList, product],
    }));
    const resumen = get().resumen();
  },
  removeCartProductById: (id) => {
    set((state) => ({
      cartProductsList: state.cartProductsList.filter(
        (item) => item.idProductGroup !== id,
      ),
    }));
    const resumen = get().resumen();
  },
  resumen: () => {
    const cartProductsList = get().cartProductsList;
    let aPagarUSD = 0;
    let aPagarCUP = 0;
    cartProductsList.map((item) => {
      if (item.moneda === "USD") {
        aPagarUSD += item.precio * item.cantidad;
      } else {
        aPagarCUP += item.precio * item.cantidad;
      }
    });
    set({
      totalProducts: cartProductsList.length,
      totalPagarUSD: aPagarUSD,
      totalPagarCUP: aPagarCUP,
    });
  },
}));
export default ventaStore;
