import { FlatList, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TextInfoDelete from "../../components/TextInfoDelete";
import CardProduct from "../../components/CardProduct";
import SearchBar from "../../components/SearchBar";
import EmptyList from "../../components/EmptyList";
import { appStore } from "../../store/appStore";
import { useTheme } from "react-native-paper";
import Header from "../../components/Header";
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
      <Space space={10} />
      <FlatList
        data={productsGroupList}
        ItemSeparatorComponent={<View style={{ height: 15 }} />}
        ListEmptyComponent={() => (
          <EmptyList text="Stock vacio" icon="x-circle" />
        )}
        ListFooterComponent={<View style={{ height: 20 }} />}
        renderItem={({ item }) => (
          <CardProduct
            key={item.id_grupo}
            pID={item.id_grupo}
            pNombre={item.nombre}
            pMoneda={item.moneda}
            pPrecio_venta={item.precio_venta}
            pCantidad={item.cantidad}
            pCTotal_CUP={item.cobro_total_CUP}
            pCTotal_USD={item.cobro_total_USD}
            pGTotal_CUP={item.ganancia_total_CUP}
            pGTotal_USD={item.ganancia_total_USD}
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
