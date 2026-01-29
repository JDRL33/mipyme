import { FlatList, StyleSheet, View, ScrollView, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TextInfoDelete from "../../components/TextInfoDelete";
import CardProvider from "../../components/CardProvider";
import ButtonChip from "../../components/ButtonChip";
import SearchBar from "../../components/SearchBar";
import EmptyList from "../../components/EmptyList";
import { appStore } from "../../store/appStore";
import { useTheme } from "react-native-paper";
import Header from "../../components/Header";
import Space from "../../tools/Space";

const Proveedor = () => {
  const insets = useSafeAreaInsets();
  const myTheme = useTheme();
  const providersList = appStore((state) => state.providersList);
  return (
    <View
      style={[
        styles.main,
        {
          backgroundColor: myTheme.colors.primary,
          paddingTop: insets.top,
        },
      ]}
    >
      <Header title="Proveedores" />
      <SearchBar placeHolder="Buscar proveedores..." providers />
      <TextInfoDelete />
      <ButtonChip text="AGREGAR" href="/modalCreateProvider" />
      <Space space={10} />
      {/* <ScrollView style={{ marginBottom: 10 }}> */}
      <FlatList
        scrollEnabled={true}
        ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
        data={providersList}
        ListEmptyComponent={() => (
          <EmptyList text="No hay proveedores" icon="x-circle" />
        )}
        renderItem={({ item }) => (
          <CardProvider
            id={item.id_proveedor}
            name={item.nombre}
            numProducts={item.cantidad_productos}
            a_pagar={item.a_pagar}
            pagado={item.pagado}
          />
        )}
        keyExtractor={(item) => item.id_proveedor}
      />
      {/* <Space space={30} /> */}
      {/* </ScrollView> */}
    </View>
  );
};

export default Proveedor;

const styles = StyleSheet.create({
  main: {
    paddingHorizontal: 15,
    flex: 1,
  },
});
