import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TextInfoDelete from "../../components/TextInfoDelete";
import CardProduct from "../../components/CardProduct";
import SearchBar from "../../components/SearchBar";
import EmptyList from "../../components/EmptyList";
import { appStore } from "../../store/appStore";
import { useTheme } from "react-native-paper";
import Header from "../../components/Header";
import React from "react";
import ButtonChip from "../../components/ButtonChip";
import Space from "../../tools/Space";

const Products = () => {
  const myTheme = useTheme();
  const insets = useSafeAreaInsets();
  const productsGroupList = appStore((state) => state.productsGroupList);
  return (
    <View
      style={[
        styles.main,
        { paddingTop: insets.top, backgroundColor: myTheme.colors.primary },
      ]}
    >
      <Header title={"Productos"} />
      <SearchBar placeHolder="Buscar producto..." products />
      <TextInfoDelete text="Para eliminar el producto mantengalo presionado." />
      <ButtonChip href={"/modalCreateProduct"} text={"AGREGAR"} />
      <Space space={10} />
      <FlatList
        data={productsGroupList}
        ItemSeparatorComponent={<View style={{ height: 15 }} />}
        ListEmptyComponent={() => (
          <EmptyList text="Stock vacio" icon="x-circle" />
        )}
        renderItem={({ item }) => (
          <CardProduct
            key={item.id_grupo}
            pNombre={item.nombre}
            pMoneda={item.moneda}
            pPrecio_venta={item.precio_venta}
            pCantidad={item.cantidad}
            pCobroTotal={item.cobro_total}
            pGanancia={item.ganancia}
          />
        )}
      />
      {/* <View style={{ height: 30 }} /> */}
    </View>
  );
};

export default Products;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    paddingHorizontal: 15,
  },
});
