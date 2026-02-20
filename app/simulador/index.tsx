import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import PokedexLayout from "../../components/PokedexLayout";

export default function SimuladorScreen() {
  const router = useRouter();

  const irACombate = (cantidad: number) => {
    router.push({
      pathname: "/batalla/combat",
      params: { modo: cantidad },
    });
  };

  return (
    <PokedexLayout>
      <View style={styles.container}>
        <Text style={styles.title}>MODOS DE COMBATE ALEATORIO</Text>

        <TouchableOpacity style={styles.btn} onPress={() => irACombate(1)}>
          <Text style={styles.btnText}>1 VS 1 ALEATORIO</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={() => irACombate(3)}>
          <Text style={styles.btnText}>3 VS 3 ALEATORIO</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={() => irACombate(6)}>
          <Text style={styles.btnText}>6 VS 6 ALEATORIO</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, { backgroundColor: "#333", marginTop: 20 }]}
          onPress={() => irACombate(1)}
        >
          <Text style={styles.btnText}>COMBATE RÁPIDO 🎲</Text>
        </TouchableOpacity>
      </View>
    </PokedexLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
    textAlign: "center",
  },
  btn: {
    backgroundColor: "#ef5350",
    padding: 20,
    width: "85%",
    borderRadius: 15,
    marginVertical: 8,
    alignItems: "center",
    elevation: 3,
  },
  btnText: { color: "white", fontWeight: "bold", fontSize: 16 },
});
