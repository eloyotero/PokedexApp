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
import { getPokemons } from "../api/pokemonApi";
import PokedexLayout from "../components/PokedexLayout";

function getIdFromUrl(url: string) {
  const parts = url.split("/").filter(Boolean);
  return parts[parts.length - 1];
}

export default function PokemonListScreen() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const router = useRouter();

  useEffect(() => {
    getPokemons()
      .then((res) => setData(res.results))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <PokedexLayout>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Cargando Pokémon...</Text>
      </PokedexLayout>
    );
  }

  if (error) {
    return (
      <PokedexLayout>
        <Text>Error al cargar los Pokémon</Text>
      </PokedexLayout>
    );
  }

  return (
    <PokedexLayout>
      <Text style={styles.title}>Listado de Pokémon</Text>

      <FlatList
        data={data}
        keyExtractor={(item) => item.name}
        contentContainerStyle={{ paddingVertical: 8 }}
        renderItem={({ item }) => {
          const id = getIdFromUrl(item.url);
          const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

          return (
            <TouchableOpacity
              onPress={() => router.push(`/detalle/${item.name}`)}
              style={styles.card}
            >
              <Image source={{ uri: imageUrl }} style={styles.image} />
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.id}>N.º {id}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </PokedexLayout>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  image: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    textTransform: "capitalize",
  },
  id: {
    fontSize: 12,
    color: "#757575",
  },
});
