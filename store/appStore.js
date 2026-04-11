import { create } from "zustand";
import {
  getData,
  getStore,
  addClient,
  getClient,
  addProduct,
  updateStore,
  addProvider,
  getProviders,
  clearDatabase,
  addProductIndi,
  updateProvider,
  getProviderById,
  delProviderById,
  getProductsGroup,
  findByNameClient,
  getProductsIndis,
  findByNameProduct,
  findByNameProvider,
  updatePagoProvider,
  updateProductGroup,
  getProductsIndiById,
  getProductsStockDown,
  deleteProductIndiById,
  findByNameProductIndi,
  findByNameProductGroup,
  deleteGroupProductById,
  getProductsByIdProvider,
  getProductsByIdProductGroup,
  updateamountProductsIndis,
  updateGanancia,
} from "../database/database";

export const appStore = create((set, get) => ({
  productsIndis: [],
  providersList: [],
  productsGroupList: [],
  clientList: [],
  productsWithStockDown: [],
  store: {},
  aux: "",

  setAux: (value) => {
    set({ aux: value });
  },

  // METODO PARA INICIAR LA APPSTORE
  initStore: async () => {
    await get().getDataStore();
    await get().extractDatabaseList();
    await get().updateProductsGroupStatsStore();
    await get().updateProvidersStatsStore();
    await get().updateStoreStatus();

    return true;
  },
  // METODOS PARA OBTENER LOS DATOS DE LA TIENDA
  getDataStore: async () => {
    const response = await getStore();
    set({ store: response });
  },
  // METODOS PARA ACTUALIZAR VARIABLES DE ESTADISTICAS FINANCIERAS
  updateStoreStatus: async () => {
    const store = get().store;
    const productsStockBajo = get().getProductsDownStore();
    const products = get().productsGroupList;
    const providers = get().providersList;
    const clients = get().clientList;

    let cDebito = 0;
    let cPagado = 0;
    if (providers.length > 0) {
      products.map((product) => {
        cDebito += product.cobro_total;
      });
      providers.map((p) => {
        cPagado += p.pagado;
      });
    }

    const newStore = {
      id: store.id,
      name: store.name,
      limitStockDown: store.limitStockDown,
      tasa_usd: store.tasa_usd,
      tasa_eur: store.tasa_eur,
      nProducts: products.length,
      nProducts_stock_down: productsStockBajo.length,
      nProviders: providers.length,
      nClients: clients.length,
      cDebito: parseFloat(cDebito).toFixed(2),
      cPagado: parseFloat(cPagado).toFixed(2),
      cGanancia: store.cGanancia,
    };

    await updateStore(newStore);
    set({ store: newStore });
  },

  // METODO PARA ACTUALIZAR LOS PAGOS A PROVEEDORES
  updatePagoProviderStore: async (amount, id) => {
    const response = await updatePagoProvider(amount, id);
    return response;
  },
  updateGanaciaStore: async (amount) => {
    await updateGanancia(amount);
    return true;
  },

  //METODO PARA ACTUALIZAR LOS PRODUCTOS GRUPOS
  updateProductsGroupStatsStore: async () => {
    const productsIndis = get().productsIndis;
    const productsGroupList = get().productsGroupList;
    for (let group of productsGroupList) {
      let amount = 0;
      let costoTotal = 0;
      let gananciaTotal = 0;
      productsIndis.map((item) => {
        if (item.id_grupo === group.id_grupo) {
          amount += item.cantidad;
          costoTotal += item.precio_costo * item.cantidad;
          gananciaTotal +=
            (group.precio_venta - item.precio_costo) * item.cantidad;
        }
      });
      group.cantidad = amount;
      group.cobro_total = costoTotal;
      group.ganancia_total = gananciaTotal;
      await updateProductGroup(group);
      set({ productsGroupList: productsGroupList });
    }
  },
  //METODO PARA ACTUALIZAR LOS PROVEEDORES
  updateProvidersStatsStore: async () => {
    const providersList = get().providersList;
    const productsIndis = get().productsIndis;
    for (let provider of providersList) {
      let amount = 0;
      let a_pagar = 0;
      productsIndis.map((product) => {
        if (product.id_proveedor === provider.id_proveedor) {
          amount += product.cantidad;
          a_pagar += product.precio_costo * product.cantidad;
        }
      });
      provider.cantidad_productos = amount;
      provider.a_pagar = a_pagar;
      provider.pagado = provider.pagado;
      await updateProvider(provider);
      const providers = await getProviders();
      set({ providersList: providers });
    }
  },

  // METODO PARA ACTUALIZAR LA TASA DE CAMBIO
  updateTasaCambio: (usd, eur) => {
    set((state) => ({
      store: { ...state.store, tasa_usd: usd, tasa_eur: eur },
    }));
    get().updateStoreStatus();
  },

  // METODO PARA ACTUALIZAR CANTIDAD DE PRODUCTOS INDEPENDIENTES
  updateamountProductsIndisStore: async (amount, id) => {
    await updateamountProductsIndis(amount, id);
  },

  updateStatusStockDown: async () => {
    const sql = `SELECT * FROM producto_grupo WHERE cantidad <= ${get().limitStockDown}`;
    const response = await getData(sql, []);
    if (response.length > 0) {
      set({ stockBajo: response.length });
    }
  },
  // METODO PARA OBTENER LOS PRODUCTOS DE BAJO STOCK
  getProductsDownStore: () => {
    const store = get().store;
    const productsGroupList = get().productsGroupList;
    const productsStockDown = productsGroupList.filter(
      (product) => product.cantidad <= store.limitStockDown,
    );
    return productsStockDown;
  },
  // METODOS PARA OBTENER TODAS LAS FILAS DE LA BD
  extractDatabaseList: async () => {
    const providers = await getProviders();
    const productsGroup = await getProductsGroup();
    const productIndi = await getProductsIndis();
    const client = await getClient();

    set({
      providersList: providers,
      productsGroupList: productsGroup,
      productsIndis: productIndi,
      clientList: client,
    });
    return { providers, productsGroup, client };
  },
  //METODO PARA OBTENER LOS PRODUCTOS POR ID DE PROVEEDOR
  getProductsByIdProviderStore: async (id) => {
    const response = await getProductsByIdProvider(id);
    set({ productsIndis: response });
  },
  //METODO PARA OBTENER LOS PROVEEDORES POR ID
  getProvidersByIdStore: async (id) => {
    const response = await getProviderById(id);
    return response;
  },

  // METODO PARA REINICIAR LA BD
  resetDB: async () => {
    await clearDatabase().finally(async () => {
      await get().initStore();
    });
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
  // METODO PARA BUSCAR GRUPO DE PRODUCTS BY NAME
  findByNameProductGroupStore: async (name) => {
    if (name) {
      const response = await findByNameProductGroup(name.toLocaleLowerCase());
      set({ productsGroupList: response });
      return response;
    } else {
      await get().extractDatabaseList();
    }
  },
  //METODO PARA BUCAR PRODUCTOS INDEPENDIENTES POR EL ID DEL GRUPO
  getProductsByIdProductGroupStore: async (id_grupo) => {
    const response = await getProductsByIdProductGroup(id_grupo);
    return response;
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
    return productId;
  },
  // METODO PARA ANIADIR PRODUCTOS INDEPENDIENTES
  addProductsIndiStore: async (
    pNombre,
    pMoneda,
    pPrecio_costo,
    pCantidad,
    pIdProveedor,
    pIdGrupo,
    pGanancia,
    pDateOfBuy,
  ) => {
    const productId = await addProductIndi(
      pNombre,
      pMoneda,
      pPrecio_costo,
      pCantidad,
      pIdProveedor,
      pIdGrupo,
      pGanancia,
      pDateOfBuy,
    );

    const newProduct = {
      id: productId,
      nombre: pNombre,
      moneda: pMoneda,
      precio_costo: pPrecio_costo,
      cantidad: pCantidad,
      id_proveedor: pIdProveedor,
      id_grupo: pIdGrupo,
      ganancia: pGanancia,
      dateOfBuy: pDateOfBuy,
    };
    set((state) => ({
      productsIndis: [...state.productsIndis, newProduct],
    }));
    return productId;
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
  // METODO PARA ELIMINAR PRODUCTO INDEPENDIENTE POR ID
  deleteProductIndiByIdStore: async (id) => {
    const response = await deleteProductIndiById(id);
    await get().initStore();
    return response;
  },
  // METODO PARA ELIMINAR UN GRUPO DE PRODUCTOS POR ID
  deleteProductGroupByIdStore: async (id) => {
    const response = await deleteGroupProductById(id);
    return response;
  },
  // METODO PARA ELIMINAR UN GRUPO DE PRODUCTOS POR ID
  deleteProductGroupWithEmptyStock: async () => {
    for (let product of get().productsGroupList) {
      if (product.cantidad <= 0) {
        await get().deleteProductGroupByIdStore(product.id_grupo);
        // const productsGroupUpdate = get().productsGroupList.filter(
        //   (item) => item.id_grupo !== product.id_grupo,
        // );
        // set({ productsGroupList: productsGroupUpdate });
        await get().initStore();
      }
    }
  },
}));
