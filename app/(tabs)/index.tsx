import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import PokedexLayout from "../../components/PokedexLayout";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <PokedexLayout>
      <View style={styles.container}>
        <Text style={styles.title}>POKÉDEX</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/(tabs)/explore")}
        >
          <Ionicons name="list" size={26} color="white" style={styles.icon} />
          <Text style={styles.buttonText}>LISTADO POKÉMON</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#4caf50" }]}
          onPress={() => router.push("/favoritos")}
        >
          <Ionicons name="star" size={26} color="white" style={styles.icon} />
          <Text style={styles.buttonText}>MIS FAVORITOS</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#ff9800" }]}
          onPress={() => router.replace("/batalla")}
        >
          <Ionicons name="flash" size={26} color="white" style={styles.icon} />
          <Text style={styles.buttonText}>MODO BATALLA</Text>
        </TouchableOpacity>
      </View>
    </PokedexLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  title: {
    marginBottom: 50,
    color: "#d32f2f",
    fontSize: 40,
    fontWeight: "900",
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#2196F3",
    width: "85%",
    padding: 22,
    borderRadius: 18,
    alignItems: "center",
    marginVertical: 12,
  },
  icon: { marginRight: 20 },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 18 },
});
