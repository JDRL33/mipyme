import { Button, FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { appStore } from "../../store/appStore";
import { useTheme } from "react-native-paper";
import InfoProviderText from "../../components/InfoProviderText";
import EmptyList from "../../components/EmptyList";

const ProveedorInfo = () => {
  const { id } = useLocalSearchParams();
  const getProviderByIdStore = appStore((state) => state.getProviderByIdStore);
  const getProductsByIdProviderStore = appStore(
    (state) => state.getProductsByIdProviderStore,
  );
  const myTheme = useTheme();
  const [provider, setProvider] = useState({});
  const [products, setProducts] = useState({});
  useEffect(() => {
    const getProviderAndProducts = async () => {
      const response = await getProviderByIdStore(id.at(1));
      setProvider(response);
      const aux = await getProductsByIdProviderStore(id.at(1));
      setProducts(aux);
    };
    getProviderAndProducts();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: myTheme.colors.primary,
        padding: 10,
      }}
    >
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
        <View
          style={{
            padding: 10,
            backgroundColor: myTheme.colors.redLight,
            borderRadius: 10,
            width: "49%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: myTheme.colors.redForce,
              fontWeight: "bold",
              fontSize: 20,
            }}
          >
            ${provider.a_pagar}
          </Text>
          <Text
            style={{
              color: myTheme.colors.textSecondary,
              fontSize: 18,
            }}
          >
            PAGO PENDIENTE
          </Text>
        </View>
        <View
          style={{
            padding: 10,
            backgroundColor: myTheme.colors.greenLight,
            borderRadius: 10,
            width: "49%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: myTheme.colors.greenForce,
              fontWeight: "bold",
              fontSize: 20,
            }}
          >
            ${provider.pagado}
          </Text>
          <Text
            style={{
              color: myTheme.colors.textSecondary,
              fontSize: 18,
            }}
          >
            TOTAL PAGADO
          </Text>
        </View>
      </View>
      <View style={{ gap: 5, marginTop: 10 }}>
        <InfoProviderText
          textPrimary="Cantidad de productos:"
          textSecondary={provider.cantidad_productos}
        />
        <InfoProviderText
          textPrimary="Ganancias:"
          textSecondary="Pendiente a funcion !!!!!!"
        />
        <InfoProviderText
          textPrimary="Productos en bajo Stock:"
          textSecondary="Pendiente!!!"
        />
        <InfoProviderText
          textPrimary="Ultima entrada:"
          textSecondary="Pendiente!!!"
        />
      </View>
      <Text
        style={{
          marginTop: 25,
          marginBottom: 15,
          fontSize: 20,
          textAlign: "center",
          width: "100%",
          fontWeight: "bold",
        }}
      >
        PRODUCTOS
      </Text>
      <FlatList
        data={products}
        ItemSeparatorComponent={<View style={{ height: 15 }} />}
        ListEmptyComponent={() => (
          <EmptyList text="Stock vacio" icon="x-circle" />
        )}
        renderItem={({ item }) => (
          <CardProduct
            key={item.id}
            pNombre={item.nombre}
            pMoneda={item.moneda}
            pPrecio_venta={item.precio_costo}
            pCantidad={item.cantidad}
          />
        )}
      />
    </View>
  );
};

export default ProveedorInfo;

const styles = StyleSheet.create({});
