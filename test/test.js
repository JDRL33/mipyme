if (amount - productsIndisSort[i].cantidad === 0) {
  //i
  console.log("__________IGUALES");
  await deleteProductIndiByIdStore(productsIndisSort[i].id);
  const provider = await getProvidersByIdStore(
    productsIndisSort[i].id_proveedor,
  );
  console.log(i);
  await updatePagoProviderStore(
    // SE PAGA AL PROVEEDOR EL PRECIO DE COSTO * LA CANTIDAD DEL PRODUCTO VENDIDO
    productsIndisSort[i].precio_costo * product.cantidad + provider.pagado,
    productsIndisSort[i].id_proveedor,
  );
  await updateGanaciaStore(
    (groupProduct.precio_venta - productsIndisSort[i].precio_costo) *
      productsIndisSort[i].cantidad,
  );
  amount = 0;
}

if (amountRest - productsIndisSort[i + aux].cantidad === 0) {
  //i+aux
  console.log("__________IGUALES******");
  await deleteProductIndiByIdStore(productsIndisSort[i + aux].id);
  const provider = await getProvidersByIdStore(
    productsIndisSort[i + aux].id_proveedor,
  );
  await updatePagoProviderStore(
    productsIndisSort[i + aux].precio_costo * amountRest + provider.pagado,
    productsIndisSort[i + aux].id_proveedor,
  );
  await updateGanaciaStore(
    (groupProduct.precio_venta - productsIndisSort[i + aux].precio_costo) *
      amountRest,
  );
  amountRest = 0;
}

async function equalCompare(
  id_proveedor,
  id_product,
  precio_venta,
  precio_costo,
  amount,
) {
  await deleteProductIndiByIdStore(id_product);
  const provider = await getProvidersByIdStore(id_proveedor);
  await updatePagoProviderStore(
    precio_costo * amount + provider.pagado,
    id_proveedor,
  );
  await updateGanaciaStore((precio_venta - precio_costo) * amount);
  amount = 0;
}

// ----------------------------------------------------------------------------------------------------
if (amount - productsIndisSort[i].cantidad < 0) {
  await updateamountProductsIndisStore(
    productsIndisSort[i].cantidad - amount,
    productsIndisSort[i].id,
  );

  const provider = await getProvidersByIdStore(
    productsIndisSort[i].id_proveedor,
  );
  await updatePagoProviderStore(
    productsIndisSort[i].precio_costo * amount + provider.pagado,
    productsIndisSort[i].id_proveedor,
  );
  await updateGanaciaStore(
    (groupProduct.precio_venta - productsIndisSort[i].precio_costo) * amount,
  );
  amount = 0;
}

async function moreProducts(
  amount_products,
  amount_products_client,
  id_product,
  id_provider,
  precio_costo,
  precio_venta,
) {
  await updateamountProductsIndisStore(
    amount_products - amount_products_client,
    id_product,
  );

  const provider = await getProvidersByIdStore(id_provider);
  await updatePagoProviderStore(
    precio_costo * amount_products_client + provider.pagado,
    id_provider,
  );
  await updateGanaciaStore(
    (precio_venta - precio_costo) * amount_products_client,
  );
  amount_products_client = 0;
}

//---------------------------------------------------------------------------------------------------------------------

await deleteProductIndiByIdStore(productsIndisSort[i].id);
const provider = await getProvidersByIdStore(productsIndisSort[i].id_proveedor);
await updatePagoProviderStore(
  productsIndisSort[i].precio_costo * productsIndisSort[i].cantidad +
    provider.pagado,
  productsIndisSort[i].id_proveedor,
);
await updateGanaciaStore(
  (groupProduct.precio_venta - productsIndisSort[i].precio_costo) *
    productsIndisSort[i].cantidad,
);

await deleteProductIndiByIdStore(productsIndisSort[i + aux].id);
const p = await getProvidersByIdStore(productsIndisSort[i + aux].id_proveedor);
await updatePagoProviderStore(
  productsIndisSort[i + aux].precio_costo *
    productsIndisSort[i + aux].cantidad +
    p.pagado,
  productsIndisSort[i + aux].id_proveedor,
);
await updateGanaciaStore(
  (groupProduct.precio_venta - productsIndisSort[i + aux].precio_costo) *
    productsIndisSort[i + aux].cantidad,
);

async function allProductsBuy(
  id_product,
  id_provider,
  precio_costo,
  amount,
  precio_venta,
) {
  await deleteProductIndiByIdStore(id_product);
  const provider = await getProvidersByIdStore(id_provider);
  await updatePagoProviderStore(
    precio_costo * amount + provider.pagado,
    id_provider,
  );
  await updateGanaciaStore((precio_venta - precio_costo) * amount);
}
