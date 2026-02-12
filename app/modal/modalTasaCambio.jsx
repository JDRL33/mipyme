import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useState, useEffect } from "react";
import { useTheme } from "react-native-paper";
import { useRouter } from "expo-router";
import { appStore } from "../../store/appStore";

const modalTasaCambio = () => {
  const myTheme = useTheme();
  const router = useRouter();
  const store = appStore((state) => state.store);
  const updateTasaCambio = appStore((state) => state.updateTasaCambio);
  const [usd, setUsd] = useState(store.tasa_usd);
  const [eur, setEur] = useState(store.tasa_eur);

  const handleSave = () => {
    if (usd >= 0 && eur >= 0) {
      updateTasaCambio(usd, eur);
      router.back();
    }
  };

  return (
    <View style={[styles.main, { backgroundColor: myTheme.colors.primary }]}>
      <View style={{ marginBottom: 30 }}>
        <Text style={styles.title}>Actualizar </Text>
        <Text style={styles.title}>Tasas de Cambio</Text>
      </View>
      <View style={styles.textInputFlex}>
        <Text style={[styles.label]}>USD</Text>
        <TextInput
          value={usd}
          onChangeText={setUsd}
          placeholder={`$${store.tasa_usd}`}
          placeholderColor={myTheme.colors.greenForce}
          cursorColor={myTheme.colors.purpleForce}
          selectionColor={myTheme.colors.purpleForce}
          placeholderTextColor={myTheme.colors.textSecondary}
          keyboardType="decimal-pad"
          style={[
            styles.tInput,
            {
              backgroundColor: myTheme.colors.grayLight,
              color: myTheme.colors.textSecondary,
            },
          ]}
        />
      </View>
      <View style={styles.textInputFlex}>
        <Text style={[styles.label]}>EUR</Text>
        <TextInput
          value={eur}
          onChangeText={setEur}
          placeholder={`$${store.tasa_eur}`}
          placeholderColor={myTheme.colors.greenForce}
          cursorColor={myTheme.colors.purpleForce}
          selectionColor={myTheme.colors.purpleForce}
          placeholderTextColor={myTheme.colors.textSecondary}
          keyboardType="decimal-pad"
          style={[
            styles.tInput,
            {
              backgroundColor: myTheme.colors.grayLight,
              color: myTheme.colors.textSecondary,
            },
          ]}
        />
      </View>
      <View
        style={{
          marginTop: 30,
          flexDirection: "row",
          height: 60,
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
        }}
      >
        <Pressable
          onPress={handleSave}
          style={[
            styles.btnSave,
            { backgroundColor: myTheme.colors.purpleLight },
          ]}
        >
          {({ pressed }) => (
            <Text
              style={[
                styles.textBtn,
                {
                  color: myTheme.colors.purpleForce,
                  fontSize: !pressed ? 20 : 22,
                },
              ]}
            >
              Actualizar
            </Text>
          )}
        </Pressable>
        <Pressable
          onPress={() => {
            router.back();
          }}
          style={[styles.btnSave, { backgroundColor: myTheme.colors.redForce }]}
        >
          {({ pressed }) => (
            <Text
              style={[
                styles.textBtn,
                {
                  color: myTheme.colors.redLight,
                  fontSize: !pressed ? 20 : 22,
                },
              ]}
            >
              Cancelar
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
};

export default modalTasaCambio;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    gap: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 40,
    textAlign: "center",
  },
  tInput: {
    padding: 10,
    borderRadius: 10,
    minWidth: 100,
    textAlign: "center",
    fontSize: 18,
  },
  label: {
    fontSize: 25,
    fontWeight: "bold",
  },
  textInputFlex: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  textBtn: {
    textAlign: "center",
  },
  btnSave: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
});
