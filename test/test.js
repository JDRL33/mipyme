if (count - productsOrder[i].cantidad === 0) {
  //i
  console.log("__________IGUALES");
  await deleteProductIndiByIdStore(productsOrder[i].id);
  const provider = await getProvidersByIdStore(productsOrder[i].id_proveedor);
  console.log(i);
  await updatePagoProviderStore(
    // SE PAGA AL PROVEEDOR EL PRECIO DE COSTO * LA CANTIDAD DEL PRODUCTO VENDIDO
    productsOrder[i].precio_costo * product.cantidad + provider.pagado,
    productsOrder[i].id_proveedor,
  );
  await updateGanaciaStore(
    (groupProduct.precio_venta - productsOrder[i].precio_costo) *
      productsOrder[i].cantidad,
  );
  count = 0;
}

if (cantRest - productsOrder[i + aux].cantidad === 0) {
  //i+aux
  console.log("__________IGUALES******");
  await deleteProductIndiByIdStore(productsOrder[i + aux].id);
  const provider = await getProvidersByIdStore(
    productsOrder[i + aux].id_proveedor,
  );
  await updatePagoProviderStore(
    productsOrder[i + aux].precio_costo * cantRest + provider.pagado,
    productsOrder[i + aux].id_proveedor,
  );
  await updateGanaciaStore(
    (groupProduct.precio_venta - productsOrder[i + aux].precio_costo) *
      cantRest,
  );
  cantRest = 0;
}

async function equalCompare(
  id_proveedor,
  id_product,
  precio_venta,
  precio_costo,
  count,
) {
  await deleteProductIndiByIdStore(id_product);
  const provider = await getProvidersByIdStore(id_proveedor);
  await updatePagoProviderStore(
    precio_costo * count + provider.pagado,
    id_proveedor,
  );
  await updateGanaciaStore((precio_venta - precio_costo) * count);
  count = 0;
}

// ----------------------------------------------------------------------------------------------------
if (count - productsOrder[i].cantidad < 0) {
  await updateCountProductsIndisStore(
    productsOrder[i].cantidad - count,
    productsOrder[i].id,
  );

  const provider = await getProvidersByIdStore(productsOrder[i].id_proveedor);
  await updatePagoProviderStore(
    productsOrder[i].precio_costo * count + provider.pagado,
    productsOrder[i].id_proveedor,
  );
  await updateGanaciaStore(
    (groupProduct.precio_venta - productsOrder[i].precio_costo) * count,
  );
  count = 0;
}

async function moreProducts(
  count_products,
  count_products_client,
  id_product,
  id_provider,
  precio_costo,
  precio_venta,
) {
  await updateCountProductsIndisStore(
    count_products - count_products_client,
    id_product,
  );

  const provider = await getProvidersByIdStore(id_provider);
  await updatePagoProviderStore(
    precio_costo * count_products_client + provider.pagado,
    id_provider,
  );
  await updateGanaciaStore(
    (precio_venta - precio_costo) * count_products_client,
  );
  count_products_client = 0;
}

//---------------------------------------------------------------------------------------------------------------------

await deleteProductIndiByIdStore(productsOrder[i].id);
const provider = await getProvidersByIdStore(productsOrder[i].id_proveedor);
await updatePagoProviderStore(
  productsOrder[i].precio_costo * productsOrder[i].cantidad + provider.pagado,
  productsOrder[i].id_proveedor,
);
await updateGanaciaStore(
  (groupProduct.precio_venta - productsOrder[i].precio_costo) *
    productsOrder[i].cantidad,
);

await deleteProductIndiByIdStore(productsOrder[i + aux].id);
const p = await getProvidersByIdStore(productsOrder[i + aux].id_proveedor);
await updatePagoProviderStore(
  productsOrder[i + aux].precio_costo * productsOrder[i + aux].cantidad +
    p.pagado,
  productsOrder[i + aux].id_proveedor,
);
await updateGanaciaStore(
  (groupProduct.precio_venta - productsOrder[i + aux].precio_costo) *
    productsOrder[i + aux].cantidad,
);

async function allProductsBuy(
  id_product,
  id_provider,
  precio_costo,
  count,
  precio_venta,
) {
  await deleteProductIndiByIdStore(id_product);
  const provider = await getProvidersByIdStore(id_provider);
  await updatePagoProviderStore(
    precio_costo * count + provider.pagado,
    id_provider,
  );
  await updateGanaciaStore((precio_venta - precio_costo) * count);
}
