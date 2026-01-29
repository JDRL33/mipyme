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
} from "../database/database";

export const appStore = create((set, get) => ({
  providersList: [],
  productsGroupList: [],
  clientList: [],
  temp: "",

  countDeposit: 0,
  countDeposited: 0,
  countGanancia: 0,

  stockBajo: 0,
  limitStockDown: 5,

  // METODO PARA INICIAR LA APPSTORE
  initStore: async () => {
    await get().extractDatabaseList();
    get().updateStatusFinanciero();
  },
  // METODOS PARA ACTUALIZAR VARIABLES DE ESTADISTICAS FINANCIERAS
  updateStatusFinanciero: () => {
    const response = get().providersList;
    let sumaAPagar = 0;
    let sumaPagada = 0;
    if (response.length > 0) {
      response.map((respons) => {
        sumaAPagar += respons.a_pagar;
        sumaPagada += respons.pagado;
      });
    }

    const response1 = get().productsGroupList;
    let sumaGanancia = 0;
    if (response1.length > 0) {
      response1.map((respons) => {
        sumaGanancia += respons.ganancia;
      });
    }
    set({
      countDeposit: sumaAPagar,
      countDeposited: sumaPagada,
      countGanancia: sumaGanancia,
    });
  },
  // METODO PARA OBTENER LOS PRODUCTOS DE STOCK BAJO
  updateStatusStockDown: async () => {
    const sql = `SELECT * FROM inventario WHERE cantidad <= ${get().limitStockDown}`;
    const response = await getData(sql, []);
    if (response.length > 0) {
      set({ stockBajo: response.length });
    }
  },
  // METODO PARA REINICIAR LA BD
  resetDB: async () => {
    await clearDatabase();
    await get().initStore();
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

  //Mentodos de busquedas____________________________________________________

  // METODO PARA BUSCAR PROVIDERS BY NAME
  findByNameProviderStore: async (name) => {
    if (name) {
      const response = await findByNameProvider(name);
      set({ providersList: response });
      console.log(get().providersList);
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
      console.log(get().productsGroupList);
      return response;
    } else {
      await get().extractDatabaseList();
    }
  },
  // METODO PARA BUSCAR CLIENTS BY NAME
  findByNameClientStore: async (name) => {
    if (name) {
      const response = await findByNameClient(name);
      set({ clientList: response });
      console.log(get().clientList);
      return response;
    } else {
      await get().extractDatabaseList();
    }
  },
  // METODO PARA BUSCAR PROVEEDOR POR ID
  getProviderByIdStore: async (id) => {
    const response = await getProviderById(id);
    return response[0];
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
    get().updateStatusFinanciero();
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
    get().updateStatusFinanciero();
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
  },

  // METODO PARA ELIMINAR PROVEEDOR POR ID
  deleteProviderByIdStore: async (id) => {
    const response = await delProviderById(id);
    await get().initStore();
    return response;
  },

  setTemp: (temporal) => {
    set({ temp: temporal });
  },
}));
