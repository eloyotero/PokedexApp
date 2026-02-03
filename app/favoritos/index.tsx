import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function FavoritosScreen() {
  const [favs, setFavs] = useState<any[]>([]);

  useEffect(() => {
    loadFavs();
  }, []);

  async function loadFavs() {
    const data = await AsyncStorage.getItem("favoritos");
    if (data) setFavs(JSON.parse(data));
  }

  async function removeFav(name: string) {
    const newFavs = favs.filter((p) => p.name !== name);
    setFavs(newFavs);
    await AsyncStorage.setItem("favoritos", JSON.stringify(newFavs));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favoritos</Text>

      <ScrollView contentContainerStyle={styles.list}>
        {favs.length === 0 && (
          <Text style={styles.empty}>No tienes Pokémon favoritos aún.</Text>
        )}

        {favs.map((p, i) => (
          <View key={i} style={styles.card}>
            <Image
              source={{ uri: p.sprites.front_default }}
              style={styles.sprite}
            />
            <Text style={styles.name}>{p.name.toUpperCase()}</Text>

            <TouchableOpacity
              style={styles.remove}
              onPress={() => removeFav(p.name)}
            >
              <Text style={styles.removeText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  list: { alignItems: "center", gap: 20, paddingBottom: 40 },
  empty: { fontSize: 18, color: "#555", marginTop: 20 },
  card: {
    width: "90%",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 15,
    borderWidth: 2,
    borderColor: "#003366",
    alignItems: "center",
  },
  sprite: { width: 100, height: 100 },
  name: { fontSize: 18, fontWeight: "bold", marginTop: 10 },
  remove: {
    marginTop: 10,
    backgroundColor: "#C62828",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  removeText: { color: "white", fontWeight: "bold" },
});
