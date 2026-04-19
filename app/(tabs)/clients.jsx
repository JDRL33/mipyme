import { useSafeAreaInsets } from "react-native-safe-area-context";
import TextInfoDelete from "../../components/TextInfoDelete";
import { FlatList, StyleSheet, View } from "react-native";
import CardClient from "../../components/CardClient";
import EmptyList from "../../components/EmptyList";
import SearchBar from "../../components/SearchBar";
import { appStore } from "../../store/appStore";
import Toast from "react-native-toast-message";
import { useTheme } from "react-native-paper";
import Header from "../../components/Header";
import Space from "../../tools/Space";

const Clients = () => {
  const clientList = appStore((state) => state.clientList);
  const insets = useSafeAreaInsets();
  const myTheme = useTheme();
  return (
    <View
      style={[
        styles.main,
        { paddingTop: insets.top, backgroundColor: myTheme.colors.primary },
      ]}
    >
      <Header title={"Clientes en deuda"} />
      <SearchBar placeHolder="Buscar clientes..." />
      <TextInfoDelete text="Para eliminar un cliente debe liquidar sus pagos pendientes." />
      {/* <ButtonChip text="AGREGAR" href="/modal/modalCreateClient" /> */}
      <Space space={10} />
      <FlatList
        data={clientList}
        ItemSeparatorComponent={<View style={{ height: 15 }} />}
        ListEmptyComponent={() => (
          <EmptyList text="No hay clientes" icon="x-circle" />
        )}
        ListFooterComponent={<View style={{ height: 20 }} />}
        renderItem={({ item }) => (
          <CardClient
            id={item.id}
            nombre={item.nombre}
            ci={item.carnet_identidad}
            cup={item.cup}
            usd={item.usd}
          />
        )}
        keyExtractor={(item) => item.id}
      />
      {/* <View style={{ height: 30 }} /> */}
    </View>
  );
};

export default Clients;

const styles = StyleSheet.create({
  main: { flex: 1, paddingHorizontal: 15 },
});
