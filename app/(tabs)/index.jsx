import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScrollView, StyleSheet, View, Text } from "react-native";

import { CardsGridInfo, CardsGridActions } from "../../components/CardsGrid";
import CambioCard from "../../components/CambioCard";
import FabButton from "../../components/FabButton";
import { useTheme } from "react-native-paper";
import Header from "../../components/Header";
import { appStore } from "../../store/appStore";
import { useEffect } from "react";
import { initDatabase } from "../../database/database";

const index = () => {
  const initStore = appStore((state) => state.initStore);
  useEffect(() => {
    const init = async () => {
      await initDatabase();
      await initStore();
    };
    init();
  }, []);
  const myTheme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    // View contenedor de la pantalla INICIO
    <View
      style={[
        styles.main,
        { paddingTop: insets.top, backgroundColor: myTheme.colors.primary },
      ]}
    >
      {/* Cabecera de la pantalla principal */}
      <Header title={"Mi Tienda Pro"} start={true} />
      <ScrollView style={{ paddingBottom: 10 }}>
        <CardsGridInfo />
        {/* Bloque de las tasas de cambio */}
        <CambioCard />
        <Text
          style={[styles.textSubtitle, { color: myTheme.colors.textPrimary }]}
        >
          Acciones Rápidas
        </Text>
        <CardsGridActions />
        <View style={{ height: 30 }} />
      </ScrollView>
      {/* Button de faboritos */}
      <FabButton onClick={async () => {}} />
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    paddingHorizontal: 15,
  },
  textSubtitle: {
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 10,
    fontWeight: "bold",
    fontSize: 22,
  },
});
