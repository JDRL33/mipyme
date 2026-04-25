import { useEffect, useState } from "react";
import {
  getGananciaOfTheStore,
  createSale,
  getClientById,
  addProductInDeuda,
  updateClientPay,
} from "../../database/database";
import { appStore } from "../../store/appStore";

export function SaleLogic() {
  // params: clientDeudaId
  const store = appStore((state) => state.store);

  const [gananciaActual, setGananciaActual] = useState(null);

  //Datos de la nueva venta
  const [idSale, setIdSale] = useState("");

  useEffect(() => {
    const start = async () => {
      setGananciaActual(await getGananciaOfTheStore());
      setIdSale(await createSale(store.tasa_usd));
    };
    start();
  }, []);
  useEffect(() => {
    const getClient = async () => {
      setCurrentClient(await getClientById(clientDeudaId));
    };
    getClient();
  }, [clientDeudaId]);

  return;
}
async function confirmSale() {
  // Verificar tipo de pago
  if (inputMoney === "efectivo" || inputMoney === "transferencia") {
    // seleccionamos el primer producto
    for (let product of cartProductsList) {
      // buscamos su grupo
      const groupProduct = await findByNameProductStore(product.nombre);
      console.log("group", groupProduct);
      // seleccionamos todos los del grupo para efectuar FIFO(First In First Out)
      const productsI = await getProductsByIdProductGroupStore(
        groupProduct[0].id_grupo,
      );
      // los ordenamos
      const productsIndisSort = productsI.sort(
        (a, b) => parseDMY(a.dateOfBuy) - parseDMY(b.dateOfBuy),
      );
      console.log("indi", productsIndisSort);
      // definimos la cantidad que quiere el cliente
      let amount = product.cantidad;
      console.log("PEDIDO:", amount);

      for (let i = 0; i <= productsIndisSort.length - 1; i++) {
        if (amount > 0) {
          // SE VENDE AL SER IGUAL QUE CERO------------------------------------------------------------------------IGUAL
          if (amount - productsIndisSort[i].cantidad === 0) {
            console.log("__________IGUALES");
            await equalCompare(
              false,
              null,
              productsIndisSort[i].id_proveedor,
              productsIndisSort[i].id,
              groupProduct[0].precio_venta,
              productsIndisSort[i].precio_costo,
              amount,
              productsIndisSort[i].moneda,
              groupProduct[0].moneda,
            );
            amount = 0;
          }
          // SE VENDE AL SOBRAR PRODUCTOS--------------------------------------------------------------------------SOBRAN
          else if (amount - productsIndisSort[i].cantidad < 0) {
            console.log("____________SOBRAN");
            await moreProducts(
              false,
              null,
              productsIndisSort[i].cantidad,
              amount,
              productsIndisSort[i].id,
              productsIndisSort[i].id_proveedor,
              productsIndisSort[i].precio_costo,
              groupProduct[0].precio_venta,
              productsIndisSort[0].moneda,
              groupProduct[0].moneda,
            );
            amount = 0;
          }
          // SE VENDE AL TODAVIA FALTANTE---------------------------------------------------------------------------FALTAN
          else if (amount - productsIndisSort[i].cantidad > 0) {
            console.log("___________FALTAN");
            let amountRest = amount - productsIndisSort[i].cantidad;
            await allProductsBuy(
              false,
              null,
              productsIndisSort[i].id,
              productsIndisSort[i].id_proveedor,
              productsIndisSort[i].precio_costo,
              productsIndisSort[i].cantidad,
              groupProduct[0].precio_venta,
              productsIndisSort[0].moneda,
              groupProduct[0].moneda,
            );

            let aux = 1;
            while (amountRest > 0 && aux <= productsIndisSort.length) {
              // SE VENDE AL SER IGUAL QUE CERO------------------------------------------------IGUAL---------------------------
              if (amountRest - productsIndisSort[i + aux].cantidad === 0) {
                console.log("__________IGUALES******");
                await equalCompare(
                  false,
                  null,
                  productsIndisSort[i + aux].id_proveedor,
                  productsIndisSort[i + aux].id,
                  groupProduct[0].precio_venta,
                  productsIndisSort[i + aux].precio_costo,
                  amountRest,
                  productsIndisSort[i + aux].moneda,
                  groupProduct[0].moneda,
                );
                amountRest = 0;
              }
              // SE VENDE AL SOBRAR PRODUCTOS---------------------------------------------------SOBRAN------------------------
              else if (amountRest - productsIndisSort[i + aux].cantidad < 0) {
                console.log("____________SOBRAN***********");
                await moreProducts(
                  false,
                  null,
                  productsIndisSort[i + aux].cantidad,
                  amountRest,
                  productsIndisSort[i + aux].id,
                  productsIndisSort[i + aux].id_proveedor,
                  productsIndisSort[i + aux].precio_costo,
                  groupProduct[0].precio_venta,
                  productsIndisSort[i + aux].moneda,
                  groupProduct[0].moneda,
                );
                amountRest = 0;
              } else if (amountRest - productsIndisSort[i + aux].cantidad > 0) {
                console.log("___________FALTAN*********"); //-------------------------------------FALTAN-----------------------
                amountRest -= productsIndisSort[i + aux].cantidad;
                await allProductsBuy(
                  false,
                  null,
                  productsIndisSort[i + aux].id,
                  productsIndisSort[i + aux].id_proveedor,
                  productsIndisSort[i + aux].precio_costo,
                  productsIndisSort[i + aux].cantidad,
                  groupProduct[0].precio_venta,
                  productsIndisSort[i].moneda,
                  groupProduct[0].moneda,
                );

                continue;
              }
              aux += 1;
            }
            break;
          }
        }
      }
    }
  } else if (inputMoney === "deuda") {
    //______________DEUDA_________________________________________________________________________________________

    // seleccionamos el primer producto
    for (let product of cartProductsList) {
      // buscamos su grupo
      const groupProduct = await findByNameProductStore(product.nombre);
      // seleccionamos todos los del grupo para efectuar FIFO(First In First Out)
      const productsI = await getProductsByIdProductGroupStore(
        groupProduct[0].id_grupo,
      );
      // los ordenamos
      const productsIndisSort = productsI.sort(
        (a, b) => parseDMY(a.dateOfBuy) - parseDMY(b.dateOfBuy),
      );
      // definimos la cantidad que quiere el cliente
      let amount = product.cantidad;
      console.log("PEDIDO:", amount);

      for (let i = 0; i <= productsIndisSort.length - 1; i++) {
        if (amount > 0) {
          // SE VENDE AL SER IGUAL QUE CERO------------------------------------------------------------------------IGUAL
          if (amount - productsIndisSort[i].cantidad === 0) {
            console.log("__________IGUALES");
            await equalCompare(
              true,
              {
                nombre: productsIndisSort[i].nombre,
                amount: amount,
              },
              productsIndisSort[i].id_proveedor,
              productsIndisSort[i].id,
              groupProduct[0].precio_venta,
              productsIndisSort[i].precio_costo,
              amount,
              productsIndisSort[i].moneda,
              groupProduct[0].moneda,
            );
            amount = 0;
          }
          // SE VENDE AL SOBRAR PRODUCTOS--------------------------------------------------------------------------SOBRAN
          else if (amount - productsIndisSort[i].cantidad < 0) {
            console.log("____________SOBRAN");
            await moreProducts(
              true,
              {
                nombre: productsIndisSort[i].nombre,
                amount: amount,
              },
              productsIndisSort[i].cantidad,
              amount,
              productsIndisSort[i].id,
              productsIndisSort[i].id_proveedor,
              productsIndisSort[i].precio_costo,
              groupProduct[0].precio_venta,
              productsIndisSort[i].moneda,
              groupProduct[0].moneda,
            );
            amount = 0;
          }
          // SE VENDE AL TODAVIA FALTANTE---------------------------------------------------------------------------FALTAN
          else if (amount - productsIndisSort[i].cantidad > 0) {
            console.log("___________FALTAN");
            let amountRest = amount - productsIndisSort[i].cantidad;
            await allProductsBuy(
              true,
              {
                nombre: productsIndisSort[i].nombre,
                amount: productsIndisSort[i].cantidad,
              },
              productsIndisSort[i].id,
              productsIndisSort[i].id_proveedor,
              productsIndisSort[i].precio_costo,
              productsIndisSort[i].cantidad,
              groupProduct[0].precio_venta,
              productsIndisSort[i].moneda,
              groupProduct[0].moneda,
            );

            let aux = 1;
            while (amountRest > 0 && aux <= productsIndisSort.length) {
              // SE VENDE AL SER IGUAL QUE CERO------------------------------------------------IGUAL---------------------------
              if (amountRest - productsIndisSort[i + aux].cantidad === 0) {
                console.log("__________IGUALES******");
                await equalCompare(
                  true,
                  {
                    nombre: productsIndisSort[i + aux].nombre,
                    amount: amountRest,
                  },
                  productsIndisSort[i + aux].id_proveedor,
                  productsIndisSort[i + aux].id,
                  groupProduct[0].precio_venta,
                  productsIndisSort[i + aux].precio_costo,
                  amountRest,
                  productsIndisSort[i + aux].moneda,
                  groupProduct[0].moneda,
                );
                amountRest = 0;
              }
              // SE VENDE AL SOBRAR PRODUCTOS---------------------------------------------------SOBRAN------------------------
              else if (amountRest - productsIndisSort[i + aux].cantidad < 0) {
                console.log("____________SOBRAN***********");
                await moreProducts(
                  true,
                  {
                    nombre: productsIndisSort[i + aux].nombre,
                    amount: amountRest,
                  },
                  productsIndisSort[i + aux].cantidad,
                  amountRest,
                  productsIndisSort[i + aux].id,
                  productsIndisSort[i + aux].id_proveedor,
                  productsIndisSort[i + aux].precio_costo,
                  groupProduct[0].precio_venta,
                  productsIndisSort[i + aux].moneda,
                  groupProduct[0].moneda,
                );
                amountRest = 0;
              } else if (amountRest - productsIndisSort[i + aux].cantidad > 0) {
                console.log("___________FALTAN*********"); //-------------------------------------FALTAN-----------------------
                amountRest -= productsIndisSort[i + aux].cantidad;
                await allProductsBuy(
                  true,
                  {
                    nombre: productsIndisSort[i + aux].nombre,
                    amount: productsIndisSort[i + aux].cantidad,
                  },
                  productsIndisSort[i + aux].id,
                  productsIndisSort[i + aux].id_proveedor,
                  productsIndisSort[i + aux].precio_costo,
                  productsIndisSort[i + aux].cantidad,
                  groupProduct[0].precio_venta,
                  productsIndisSort[0].moneda,
                  groupProduct[0].moneda,
                );

                continue;
              }
              aux += 1;
            }
            break;
          }
        }
      }
    }
  }
  console.log(
    "GANANCIAS:",
    gananciaActual.cGanancia_CUP,
    gananciaActual.cGanancia_USD,
  );
  await updateGanaciaStore(
    gananciaActual.cGanancia_CUP + ganancia_CUP,
    gananciaActual.cGanancia_USD + ganancia_USD,
  );
  await deleteProductGroupWithEmptyStock();
  await initStore();
  console.log("Vendido con exito");
  router.replace("home");
}

const equalCompare = async (
  DEUDA = false,
  extra = null,
  id_proveedor,
  id_product,
  precio_venta,
  precio_costo,
  amount,
  moneda_PC,
  moneda_PV,
) => {
  const provider = await getProvidersByIdStore(id_proveedor);

  if (DEUDA == false) {
    await deleteProductIndiByIdStore(id_product);
    if (moneda_PC.toLowerCase() === "cup") {
      await updatePagoProviderStore(
        precio_costo * amount + provider.pagado_CUP,
        id_proveedor,
      );
    } else {
      await updatePagoProviderStore(
        precio_costo * amount + provider.pagado_USD,
        id_proveedor,
        true,
      );
    }
    if (
      moneda_PC.toLowerCase() === "cup" &&
      moneda_PV.toLowerCase() === "cup"
    ) {
      ganancia_CUP += (precio_venta - precio_costo) * amount;
    } else if (
      moneda_PC.toLowerCase() === "usd" &&
      moneda_PV.toLowerCase() === "cup"
    ) {
      ganancia_CUP += (precio_venta - precio_costo * store.tasa_usd) * amount;
    } else if (
      moneda_PC.toLowerCase() === "cup" &&
      moneda_PV.toLowerCase() === "usd"
    ) {
      ganancia_CUP += (precio_venta * store.tasa_usd - precio_costo) * amount;
    } else if (
      moneda_PC.toLowerCase() === "usd" &&
      moneda_PV.toLowerCase() === "usd"
    ) {
      ganancia_USD += (precio_venta - precio_costo) * amount;
    }
  } else if (DEUDA === true) {
    await addProductInDeuda(
      extra.nombre,
      extra.amount,
      precio_costo,
      precio_venta,
      moneda_PC,
      moneda_PV,
      id_proveedor,
      idSale,
    );
    switch (moneda_PV.toLowerCase()) {
      case "cup":
        await updateClientPay(
          clientDeudaId,
          idSale,
          0 + currentClient[0].usd,
          precio_venta * extra.amount + currentClient[0].cup,
        );
        currentClient &&
          setCurrentClient(
            ...currentClient,
            (currentClient[0].cup += precio_venta * extra.amount),
          );
        break;
      case "usd":
        await updateClientPay(
          clientDeudaId,
          idSale,
          precio_venta * extra.amount + currentClient[0].usd,
          0 + currentClient[0].cup,
        );
        currentClient &&
          setCurrentClient(
            ...currentClient,
            (currentClient[0].usd += precio_venta * extra.amount),
          );
        break;
    }

    await deleteProductIndiByIdStore(id_product);
  }
};
const moreProducts = async (
  DEUDA = false,
  extra = null,
  amount_products,
  amount_products_client,
  id_product,
  id_provider,
  precio_costo,
  precio_venta,
  moneda_PC,
  moneda_PV,
) => {
  await updateAmountProductsIndisStore(
    amount_products - amount_products_client,
    id_product,
  );
  const provider = await getProvidersByIdStore(id_provider);
  if (DEUDA == false) {
    if (moneda_PC.toLowerCase() === "cup") {
      await updatePagoProviderStore(
        precio_costo * amount_products_client + provider.pagado_CUP,
        id_provider,
      );
    } else {
      await updatePagoProviderStore(
        precio_costo * amount_products_client + provider.pagado_USD,
        id_provider,
        true,
      );
    }
    if (
      moneda_PC.toLowerCase() === "cup" &&
      moneda_PV.toLowerCase() === "cup"
    ) {
      ganancia_CUP =
        ganancia_CUP + (precio_venta - precio_costo) * amount_products_client;
    } else if (
      moneda_PC.toLowerCase() === "usd" &&
      moneda_PV.toLowerCase() === "cup"
    ) {
      ganancia_CUP =
        ganancia_CUP +
        (precio_venta - precio_costo * store.tasa_usd) * amount_products_client;
    } else if (
      moneda_PC.toLowerCase() === "cup" &&
      moneda_PV.toLowerCase() === "usd"
    ) {
      ganancia_CUP =
        ganancia_CUP +
        (precio_venta * store.tasa_usd - precio_costo) * amount_products_client;
    } else if (
      moneda_PC.toLowerCase() === "usd" &&
      moneda_PV.toLowerCase() === "usd"
    ) {
      ganancia_USD =
        ganancia_USD + (precio_venta - precio_costo) * amount_products_client;
    }
  } else if (DEUDA === true) {
    await addProductInDeuda(
      extra.nombre,
      extra.amount,
      precio_costo,
      precio_venta,
      moneda_PC,
      moneda_PV,
      id_provider,
      idSale,
    );
    switch (moneda_PV.toLowerCase()) {
      case "cup":
        await updateClientPay(
          clientDeudaId,
          idSale,
          0 + currentClient[0].usd,
          precio_venta * extra.amount + currentClient[0].cup,
        );
        currentClient &&
          setCurrentClient(
            ...currentClient,
            (currentClient[0].cup += precio_venta * extra.amount),
          );

        break;
      case "usd":
        await updateClientPay(
          clientDeudaId,
          idSale,
          precio_venta * extra.amount + currentClient[0].usd,
          0 + currentClient[0].cup,
        );
        currentClient &&
          setCurrentClient(
            ...currentClient,
            (currentClient[0].usd += precio_venta * extra.amount),
          );
        break;
    }
  }
};
const allProductsBuy = async (
  DEUDA = false,
  extra = null,
  id_product,
  id_provider,
  precio_costo,
  amount,
  precio_venta,
  moneda_PC,
  moneda_PV,
) => {
  const provider = await getProvidersByIdStore(id_provider);
  if (DEUDA == false) {
    await deleteProductIndiByIdStore(id_product);
    if (moneda_PC.toLowerCase() === "cup") {
      await updatePagoProviderStore(
        precio_costo * amount + provider.pagado_CUP,
        id_provider,
      );
    } else {
      await updatePagoProviderStore(
        precio_costo * amount + provider.pagado_USD,
        id_provider,
        true,
      );
    }
    if (
      moneda_PC.toLowerCase() === "cup" &&
      moneda_PV.toLowerCase() === "cup"
    ) {
      ganancia_CUP = ganancia_CUP + (precio_venta - precio_costo) * amount;
    } else if (
      moneda_PC.toLowerCase() === "usd" &&
      moneda_PV.toLowerCase() === "cup"
    ) {
      ganancia_CUP =
        ganancia_CUP + (precio_venta - precio_costo * store.tasa_usd) * amount;
    } else if (
      moneda_PC.toLowerCase() === "cup" &&
      moneda_PV.toLowerCase() === "usd"
    ) {
      ganancia_CUP =
        ganancia_CUP + (precio_venta * store.tasa_usd - precio_costo) * amount;
    } else if (
      moneda_PC.toLowerCase() === "usd" &&
      moneda_PV.toLowerCase() === "usd"
    ) {
      ganancia_USD = ganancia_USD + (precio_venta - precio_costo) * amount;
    }
  } else {
    await addProductInDeuda(
      extra.nombre,
      extra.amount,
      precio_costo,
      precio_venta,
      moneda_PC,
      moneda_PV,
      id_provider,
      idSale,
    );
    switch (moneda_PV.toLowerCase()) {
      case "cup":
        await updateClientPay(
          clientDeudaId,
          idSale,
          0 + currentClient[0].usd,
          precio_venta * extra.amount + currentClient[0].cup,
        );
        currentClient &&
          setCurrentClient(
            ...currentClient,
            (currentClient[0].cup += precio_venta * extra.amount),
          );
        break;
      case "usd":
        await updateClientPay(
          clientDeudaId,
          idSale,
          precio_venta * extra.amount + currentClient[0].usd,
          0 + currentClient[0].cup,
        );
        currentClient &&
          setCurrentClient(
            ...currentClient,
            (currentClient[0].usd += precio_venta * extra.amount),
          );
        break;
    }
  }
  await deleteProductIndiByIdStore(id_product);
};
