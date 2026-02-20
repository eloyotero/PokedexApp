import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PokedexLayout from "../../components/PokedexLayout";

export default function BattleMenu() {
  const router = useRouter();

  const iniciarBatalla = (modo: number) => {
    router.push({
      pathname: "/batalla/combat",
      params: { modo: modo },
    });
  };

  return (
    <PokedexLayout>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.replace("/")}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={32} color="#D32F2F" />
        </TouchableOpacity>
        <Text style={styles.title}>MODO COMBATE</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.subtitle}>Selecciona el formato de batalla:</Text>

        <TouchableOpacity
          style={styles.modeCard}
          onPress={() => iniciarBatalla(1)}
        >
          <Ionicons name="person" size={40} color="#D32F2F" />
          <View style={styles.modeInfo}>
            <Text style={styles.modeTitle}>Individual (1 vs 1)</Text>
            <Text style={styles.modeDesc}>Un combate rápido a muerte.</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.modeCard}
          onPress={() => iniciarBatalla(3)}
        >
          <Ionicons name="people" size={40} color="#D32F2F" />
          <View style={styles.modeInfo}>
            <Text style={styles.modeTitle}>Equipo (3 vs 3)</Text>
            <Text style={styles.modeDesc}>
              Estrategia con un equipo reducido.
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.modeCard}
          onPress={() => iniciarBatalla(6)}
        >
          <Ionicons name="trophy" size={40} color="#D32F2F" />
          <View style={styles.modeInfo}>
            <Text style={styles.modeTitle}>Liga (6 vs 6)</Text>
            <Text style={styles.modeDesc}>
              El formato clásico de los maestros.
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </PokedexLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50, // Un poco más de espacio arriba
    paddingBottom: 10,
    zIndex: 10, // Asegura que esté por encima de todo
  },
  backButton: {
    padding: 10, // Área de toque más grande
    backgroundColor: "#f0f0f0",
    borderRadius: 50,
  },
  title: { fontSize: 24, fontWeight: "900", color: "#333", marginLeft: 15 },
  container: { padding: 20, alignItems: "center" },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    fontWeight: "600",
  },
  modeCard: {
    flexDirection: "row",
    backgroundColor: "white",
    width: "100%",
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  modeInfo: { marginLeft: 20, flex: 1 },
  modeTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  modeDesc: { fontSize: 14, color: "#888" },
});
