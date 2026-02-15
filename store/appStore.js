import { create } from "zustand";
import {
  addClient,
  addProduct,
  addProvider,
  clearDatabase,
  delProviderById,
  findByNameClient,
  findByNameProduct,
  findByNameProvider,
  getClient,
  getData,
  getProviderById,
  getProviders,
  getProductsGroup,
  getStore,
  getProductsStockDown,
  updateStore,
  getProductsByIdProvider,
  findByNameProductIndi,
  deleteProductIndiById,
  getProductsIndiById,
  findByNameProductGroup,
} from "../database/database";

export const appStore = create((set, get) => ({
  productsIndis: [],
  providersList: [],
  productsGroupList: [],
  clientList: [],
  productsWithStockDown: [],
  store: {},

  countDeposit: 0,
  countDeposited: 0,
  countGanancia: 0,

  stockBajo: 0,
  limitStockDown: 5,

  // METODO PARA INICIAR LA APPSTORE
  initStore: async () => {
    await get().extractDatabaseList();
    await get().getDataStore();
    await get().updateStoreStatus();
  },
  // METODOS PARA OBTENER LOS DATOS DE LA TIENDA
  getDataStore: async () => {
    const response = await getStore();
    set({ store: response });
  },
  // METODOS PARA ACTUALIZAR VARIABLES DE ESTADISTICAS FINANCIERAS
  updateStoreStatus: async () => {
    const store = get().store;
    const productsStockBajo = get().productsWithStockDown;
    const products = get().productsGroupList;
    const providers = get().providersList;
    const clients = get().clientList;

    const nProducts = products.length;
    const nProviders = providers.length;
    const nClients = clients.length;

    let cDebito = 0;
    let cPagado = 0;
    let cGanancia = 0;
    if (providers.length > 0) {
      providers.map((provider) => {
        cDebito += provider.a_pagar;
        cPagado += provider.pagado;
      });
    }
    if (products.length > 0) {
      products.map((product) => {
        cGanancia += product.ganancia_total;
      });
    }
    // get().getProductsStockDownStore();

    const newStore = {
      id: store.id,
      name: store.name,
      limitStockDown: store.limitStockDown,
      tasa_usd: store.tasa_usd,
      tasa_eur: store.tasa_eur,
      nProducts: nProducts,
      nProducts_stock_down: productsStockBajo.length,
      nProviders: nProviders,
      nClients: nClients,
      cDebito: cDebito,
      cPagado: cPagado,
      cGanancia: cGanancia,
    };

    await updateStore(newStore);
    set({ store: newStore });
  },

  // METODO PARA ACTUALIZAR LA TASA DE CAMBIO
  updateTasaCambio: (usd, eur) => {
    set((state) => ({
      store: { ...state.store, tasa_usd: usd, tasa_eur: eur },
    }));
    get().updateStoreStatus();
  },
  updateStatusStockDown: async () => {
    const sql = `SELECT * FROM producto_grupo WHERE cantidad <= ${get().limitStockDown}`;
    const response = await getData(sql, []);
    if (response.length > 0) {
      set({ stockBajo: response.length });
    }
  },
  // METODO PARA OBTENER LOS PRODUCTOS DE BAJO STOCK
  getProductsDownStore: async () => {
    const stockDown = await getProductsStockDown();
  },
  // METODOS PARA OBTENER TODAS LAS FILAS DE LA BD
  extractDatabaseList: async () => {
    const providers = await getProviders();
    const productsGroup = await getProductsGroup();
    const client = await getClient();

    set({
      providersList: providers,
      productsGroupList: productsGroup,
      clientList: client,
    });
    return { providers, productsGroup, client };
  },
  //METODO PARA OBTENER LOS PRODUCTOS POR ID DE PROVEEDOR
  getProductsByIdProviderStore: async (id) => {
    const response = await getProductsByIdProvider(id);
    set({ productsIndis: response });
  },
  // METODO PARA REINICIAR LA BD
  resetDB: async () => {
    await clearDatabase();
    await get().initStore();
  },

  //Mentodos de busquedas____________________________________________________

  // METODO PARA BUSCAR PROVIDERS BY NAME
  findByNameProviderStore: async (name) => {
    if (name) {
      const response = await findByNameProvider(name);
      set({ providersList: response });
      return response;
    } else {
      await get().extractDatabaseList();
    }
  },
  // METODO PARA BUSCAR PRODUCTS BY NAME
  findByNameProductStore: async (name) => {
    if (name) {
      const response = await findByNameProduct(name);
      set({ productsGroupList: response });
      return response;
    } else {
      await get().extractDatabaseList();
    }
  },
  // METODO PARA BUSCAR PRODUCTS INDI BY NAME
  findByNameProductIndiStore: async (id_proveedor, name) => {
    if (name) {
      const response = await findByNameProductIndi(id_proveedor, name);
      set({ productsIndis: response });
      return response;
    } else {
      await get().getProductsByIdProviderStore(id_proveedor);
    }
  },
  // METODO PARA BUSCAR CLIENTS BY NAME
  findByNameClientStore: async (name) => {
    if (name) {
      const response = await findByNameClient(name);
      set({ clientList: response });
      return response;
    } else {
      await get().extractDatabaseList();
    }
  },
  findByNameProductGroupStore: async (name) => {
    if (name) {
      const response = await findByNameProductGroup(name);
      set({ productsGroupList: response });
      return response;
    } else {
      await get().extractDatabaseList();
    }
  },

  // Metodos para aniadir_________________________________________________________

  // METODO PARA ANIADIR PROVEEDORES
  addProviderStore: async (pNombre, pCantidad_productos, pA_pagar, pPagado) => {
    const userId = await addProvider(
      pNombre,
      pCantidad_productos,
      pA_pagar,
      pPagado,
    );
    const newProvider = {
      id_proveedor: userId,
      nombre: pNombre,
      cantidad_productos: pCantidad_productos,
      a_pagar: pA_pagar,
      pagado: pPagado,
    };

    set((state) => ({ providersList: [...state.providersList, newProvider] }));
    await get().updateStoreStatus();
  },
  // METODO PARA ANIADIR PRODUCTOS
  addProductsStore: async (
    pNombre,
    pMoneda,
    pPrecio_venta,
    pCantidad,
    pGanancia,
    pCobroTotal,
  ) => {
    const productId = await addProduct(
      pNombre,
      pMoneda,
      pPrecio_venta,
      pCantidad,
      pGanancia,
      pCobroTotal,
    );
    const newProduct = {
      id: productId,
      nombre: pNombre,
      moneda: pMoneda,
      precio_venta: pPrecio_venta,
      cantidad: pCantidad,
      ganancia: pGanancia,
      cobro_total: pCobroTotal,
    };
    set((state) => ({
      productsGroupList: [...state.productsGroupList, newProduct],
    }));
    await get().updateStoreStatus();
  },
  //METODO PARA ANIADIR CLIENTES
  addClientStore: async (pNombre, pCup, pUsd, pPhone, pCi) => {
    const clientId = await addClient(pNombre, pCup, pUsd, pPhone, pCi);
    const newClient = {
      id: clientId,
      nombre: pNombre,
      cup: pCup,
      usd: pUsd,
      phone: pPhone,
      ci: pCi,
    };
    set((state) => ({
      clientList: [...state.clientList, newClient],
    }));
    await get().updateStoreStatus();
  },
  // METODO PARA ELIMINAR PROVEEDOR POR ID
  deleteProviderByIdStore: async (id) => {
    const response = await delProviderById(id);
    await get().initStore();
    return response;
  },
}));

// METODO PARA BUSCAR PROVEEDOR POR ID
// getProviderByIdStore: async (id) => {
//   const response = await getProviderById(id);
//   return response[0];
// },

// METODO PARA BUSCAR PRODUCTO INDEPENDIENTE POR ID
// getProductsIndiByIdStore: async (id) => {
//   const response = await getProductsIndiById(id);
//   return response;
// },

//  deleteProductIndiByIdStore: async (id) => {
//     const response = await deleteProductIndiById(id);
//     return response;
//   },
