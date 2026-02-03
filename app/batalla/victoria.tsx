import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function VictoriaScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>¡VICTORIA!</Text>
        <Text style={styles.text}>Entrenador Eloy ganó el combate</Text>
        <Text style={styles.text}>Eloy obtuvo 300₽</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/")}
        >
          <Text style={styles.buttonText}>Volver al menú</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    backgroundColor: "black",
    borderWidth: 4,
    borderColor: "white",
    padding: 30,
    borderRadius: 10,
    width: "85%",
    alignItems: "center",
  },
  title: { color: "white", fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  text: { color: "white", fontSize: 18, marginBottom: 10 },
  button: {
    marginTop: 20,
    backgroundColor: "#4A90E2",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#003366",
  },
  buttonText: { color: "white", fontSize: 18, fontWeight: "bold" },
});
