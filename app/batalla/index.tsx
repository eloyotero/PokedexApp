import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function BattleModeScreen() {
  const router = useRouter();
  const [battleSize, setBattleSize] = useState<number>(3);

  function goToSelection() {
    router.replace(`/batalla/seleccion?size=${battleSize}`);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecciona modo de batalla</Text>

      <View style={styles.modesRow}>
        <TouchableOpacity
          style={[styles.modeButton, battleSize === 1 && styles.active]}
          onPress={() => setBattleSize(1)}
        >
          <Text style={styles.modeText}>1 vs 1</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeButton, battleSize === 3 && styles.active]}
          onPress={() => setBattleSize(3)}
        >
          <Text style={styles.modeText}>3 vs 3</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeButton, battleSize === 6 && styles.active]}
          onPress={() => setBattleSize(6)}
        >
          <Text style={styles.modeText}>6 vs 6</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.startButton} onPress={goToSelection}>
        <Text style={styles.startText}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  modesRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 30,
  },
  modeButton: {
    backgroundColor: "#333",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#555",
  },
  active: {
    borderColor: "#FFD700",
    backgroundColor: "#555",
  },
  modeText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  startButton: {
    backgroundColor: "#4A90E2",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#003366",
  },
  startText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
