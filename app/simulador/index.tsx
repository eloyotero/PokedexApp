import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SimuladorScreen() {
  const router = useRouter();

  function go(mode: string) {
    router.push(`/selector?mode=${mode}`);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Simulador de Batallas</Text>

      <TouchableOpacity style={styles.button} onPress={() => go("1v1")}>
        <Text style={styles.buttonText}>Batalla 1v1</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => go("3v3")}>
        <Text style={styles.buttonText}>Batalla 3v3</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => go("6v6")}>
        <Text style={styles.buttonText}>Batalla 6v6</Text>
      </TouchableOpacity>
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
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 40 },
  button: {
    backgroundColor: "#4A90E2",
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#003366",
    width: "70%",
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
  },
});
