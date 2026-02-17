import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { getProductsByIdProductGroup } from "../../database/database";

const product_info = () => {
  const myTheme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const [products, setProducts] = React.useState([]);
  const [cTotal, setCTotal] = React.useState(0);
  const [gananciaTotal, setGananciaTotal] = React.useState(0);
  let prod = [];

  React.useEffect(() => {
    let mounted = true;
    const fetchProducts = async () => {
      const product = await getProductsByIdProductGroup(params.id_grupo);
      if (mounted) setProducts(product);
    };
    fetchProducts();

    return () => {
      mounted = false;
    };
  }, []);
  //   console.log(products.map((p) => p.cantidad));
  React.useEffect(() => {
    products.map((p) => {
      const cal = p.precio_costo * p.cantidad;
      setCTotal(cTotal + cal);
      console.log(cTotal);
    });

    products.map((p) => {
      const cal = (params.precioVenta - p.precio_costo) * p.cantidad;
      setGananciaTotal(gananciaTotal + cal);
    });
  }, [products]);

  //   let total = 0;
  //   products.forEach((p) => {
  //     total += p.precio_costo;
  //   });
  //   setCTotal(total);
  // let ganancia = 0;
  // products.map((p) => {
  //   ganancia += params.precioVenta - p.precio_costo;
  // });
  // setGananciaTotal(ganancia);

  //   console.log(products);

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        backgroundColor: myTheme.colors.primary,
        paddingHorizontal: 20,
      }}
    >
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: myTheme.colors.greenLight },
          title: params.name,
          headerTitleStyle: { color: myTheme.colors.greenForce },
          headerBackIconTintColor: myTheme.colors.greenForce,
        }}
      />
      <Text
        style={{
          color: myTheme.colors.greenForce,
          fontSize: 32,
          textAlign: "center",
          marginTop: 20,
        }}
      >
        ${params.precioVenta} {params.moneda.toUpperCase()}
      </Text>
      <Text
        style={{
          color: myTheme.colors.textSecondary,
          fontSize: 20,
          textAlign: "center",
          marginTop: 10,
        }}
      >
        Precio de Venta
      </Text>
      <View
        style={{
          marginTop: 20,
          flexDirection: "row",
          gap: 10,
        }}
      >
        <FontAwesome5
          name="money-bill-wave"
          size={24}
          color={myTheme.colors.greenForce}
        />
        <Text style={{ color: myTheme.colors.textPrimary, fontSize: 20 }}>
          Cobro total: {cTotal}
        </Text>
      </View>
      <View
        style={{
          marginTop: 5,
          flexDirection: "row",
          gap: 10,
        }}
      >
        <FontAwesome5
          name="money-bill-wave"
          size={24}
          color={myTheme.colors.greenForce}
        />
        <Text style={{ color: myTheme.colors.textPrimary, fontSize: 20 }}>
          Ganancia total: {gananciaTotal}
        </Text>
      </View>
    </View>
  );
};

export default product_info;

const styles = StyleSheet.create({});
