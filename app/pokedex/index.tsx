import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getPokemons } from "../../api/pokemonApi";

export default function PokedexScreen() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getPokemons()
      .then((res) => setData(res.results))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#D32F2F" />
      </View>
    );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => {
          const id = item.url.split("/").filter(Boolean).pop();
          const img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/detalle/${item.name}`)}
            >
              <Image source={{ uri: img }} style={styles.image} />
              <View>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.id}>N.º {id}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 10 },
  center: { flex: 1, justifyContent: "center" },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 10,
    marginBottom: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  image: { width: 70, height: 70, marginRight: 15 },
  name: { fontSize: 18, textTransform: "capitalize", fontWeight: "bold" },
  id: { color: "#666" },
});
