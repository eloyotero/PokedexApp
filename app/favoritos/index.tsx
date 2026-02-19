import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import PokedexLayout from "../../components/PokedexLayout";

const KEY = "FAVORITE_POKEMONS";
const TYPE_COLORS: any = {
  todos: "#333",
  fire: "#FF4422",
  water: "#3399FF",
  grass: "#77CC55",
  electric: "#FFCC33",
  ice: "#66CCFF",
  fighting: "#BB5544",
  poison: "#AA5599",
  ground: "#E2C56A",
  flying: "#8899FF",
  psychic: "#FF5599",
  bug: "#AABB22",
  rock: "#BBAA66",
  ghost: "#6666BB",
  dragon: "#7766EE",
  steel: "#AAAABB",
  fairy: "#EE99EE",
  normal: "#AAAA99",
};

export default function FavoritesScreen() {
  const [favoriteGroups, setFavoriteGroups] = useState<any[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState("todos");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      cargarFavoritosAgrupados();
    }, []),
  );

  const cargarFavoritosAgrupados = async () => {
    try {
      setLoading(true);
      const json = await AsyncStorage.getItem(KEY);
      const favNames: string[] = json ? JSON.parse(json) : [];

      if (favNames.length === 0) {
        setFavoriteGroups([]);
        setFilteredGroups([]);
        setLoading(false);
        return;
      }

      // 1. Cargamos todos los datos en paralelo
      const pkmDataList = await Promise.all(
        favNames.map(async (name) => {
          const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
          const pkm = await res.json();
          const speciesRes = await fetch(pkm.species.url);
          const species = await speciesRes.json();
          return { pkm, species };
        }),
      );

      // 2. Agrupamos por ID de cadena evolutiva
      const evolutionGroups: any = {};
      pkmDataList.forEach(({ pkm, species }) => {
        const chainUrl = species.evolution_chain.url;
        // Usamos la URL de la cadena como clave para agrupar familias
        if (!evolutionGroups[chainUrl]) evolutionGroups[chainUrl] = [];

        evolutionGroups[chainUrl].push({
          name: pkm.name,
          id: pkm.id,
          type: pkm.types[0].type.name,
          image: pkm.sprites.other["official-artwork"].front_default,
        });
      });

      // 3. ORDENAR: Primero ordenamos los Pokémon dentro de cada familia,
      // y luego ordenamos las familias por el ID del primer Pokémon de cada una.
      const sortedGroups = Object.values(evolutionGroups)
        .map((family: any) => family.sort((a: any, b: any) => a.id - b.id))
        .sort((groupA: any, groupB: any) => groupA[0].id - groupB[0].id);

      setFavoriteGroups(sortedGroups);
      setFilteredGroups(sortedGroups);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const eliminarDeFavoritos = async (name: string) => {
    // Eliminación instantánea en la interfaz
    const nuevasFamilias = favoriteGroups
      .map((family) => family.filter((p: any) => p.name !== name))
      .filter((family) => family.length > 0);

    setFavoriteGroups(nuevasFamilias);
    setFilteredGroups(nuevasFamilias);

    // Persistencia en segundo plano
    const json = await AsyncStorage.getItem(KEY);
    let favs = json ? JSON.parse(json) : [];
    favs = favs.filter((n: string) => n !== name);
    await AsyncStorage.setItem(KEY, JSON.stringify(favs));
  };

  const aplicarFiltros = (tipo: string, texto: string) => {
    setSelectedType(tipo);
    setSearch(texto);
    const filtered = favoriteGroups.filter((family) =>
      family.some(
        (pkm: any) =>
          (tipo === "todos" || pkm.type === tipo) &&
          pkm.name.toLowerCase().includes(texto.toLowerCase()),
      ),
    );
    setFilteredGroups(filtered);
  };

  if (loading && favoriteGroups.length === 0)
    return (
      <PokedexLayout>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#D32F2F" />
        </View>
      </PokedexLayout>
    );

  return (
    <PokedexLayout>
      <View style={styles.header}>
        <Text style={styles.title}>MIS CAPTURAS</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar Pokémon..."
          value={search}
          onChangeText={(t) => aplicarFiltros(selectedType, t)}
        />
      </View>

      <View style={{ height: 55, marginBottom: 10 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.typeScroll}
        >
          {Object.keys(TYPE_COLORS).map((t) => (
            <TouchableOpacity
              key={t}
              style={[
                styles.typeBtn,
                { backgroundColor: TYPE_COLORS[t] },
                selectedType === t && styles.typeSelected,
              ]}
              onPress={() => aplicarFiltros(t, search)}
            >
              <Text style={styles.typeBtnText}>{t.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {filteredGroups.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-dislike-outline" size={80} color="#ddd" />
          <Text style={styles.emptyText}>Lista vacía</Text>
        </View>
      ) : (
        <FlatList
          data={filteredGroups}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item: family }) => (
            <View style={styles.familyWrapper}>
              <Text style={styles.evoTitle}>LÍNEA EVOLUTIVA</Text>
              <View style={styles.familyGrid}>
                {family.map((pkm: any) => (
                  <View key={pkm.id} style={styles.cardContainer}>
                    <TouchableOpacity
                      style={[
                        styles.card,
                        { backgroundColor: TYPE_COLORS[pkm.type] },
                      ]}
                      onPress={() => router.push(`/detalle/${pkm.name}`)}
                    >
                      <Image
                        source={{ uri: pkm.image }}
                        style={styles.image}
                        resizeMode="contain"
                      />
                      <Text numberOfLines={1} style={styles.name}>
                        {pkm.name}
                      </Text>
                      <Text style={styles.id}>#{pkm.id}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.deleteBtn}
                      onPress={() => eliminarDeFavoritos(pkm.name)}
                    >
                      <Ionicons name="close-circle" size={24} color="#FF4422" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}
        />
      )}
    </PokedexLayout>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { padding: 15 },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  searchInput: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
  },
  typeScroll: { paddingLeft: 15 },
  typeBtn: {
    paddingHorizontal: 22,
    borderRadius: 25,
    marginRight: 10,
    height: 45,
    justifyContent: "center",
    elevation: 2,
  },
  typeBtnText: { color: "white", fontWeight: "900", fontSize: 13 },
  typeSelected: { borderWidth: 3, borderColor: "#000" },
  familyWrapper: { marginVertical: 12, alignItems: "center" },
  evoTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: "#D32F2F",
    marginBottom: 8,
    letterSpacing: 1,
    backgroundColor: "rgba(211, 47, 47, 0.08)",
    paddingHorizontal: 15,
    paddingVertical: 4,
    borderRadius: 10,
  },
  familyGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 20,
    width: "92%",
    elevation: 3,
    boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
  },
  cardContainer: { width: "45%", margin: "2.5%", position: "relative" },
  card: {
    width: "100%",
    borderRadius: 15,
    alignItems: "center",
    paddingVertical: 15,
  },
  image: { width: 80, height: 80 },
  name: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
    textTransform: "capitalize",
    marginTop: 5,
  },
  id: { color: "rgba(255,255,255,0.85)", fontSize: 11, fontWeight: "800" },
  deleteBtn: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: "white",
    borderRadius: 12,
    elevation: 5,
    boxShadow: "0px 2px 4px rgba(0,0,0,0.3)",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 80,
  },
  emptyText: { color: "#ccc", fontSize: 18, fontWeight: "bold" },
});
