import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import PokedexLayout from "../../components/PokedexLayout";

const TYPE_COLORS: any = {
  todos: "#333",
  fire: "#F08030",
  water: "#6890F0",
  grass: "#78C850",
  electric: "#F8D030",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
  normal: "#A8A878",
};

export default function ExploreScreen() {
  const [allGroups, setAllGroups] = useState<any[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState("todos");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    cargarEvolucionesAgrupadas();
  }, []);

  const cargarEvolucionesAgrupadas = async () => {
    try {
      const res = await fetch(
        "https://pokeapi.co/api/v2/pokemon-species?limit=151",
      );
      const data = await res.json();
      const evolutionGroups: any = {};

      for (const item of data.results) {
        const detailRes = await fetch(item.url);
        const detailData = await detailRes.json();
        const chainId = detailData.evolution_chain.url;
        const pkmRes = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${item.name}`,
        );
        const pkmData = await pkmRes.json();

        if (!evolutionGroups[chainId]) evolutionGroups[chainId] = [];
        evolutionGroups[chainId].push({
          name: item.name,
          id: pkmData.id,
          type: pkmData.types[0].type.name,
          image: pkmData.sprites.other["official-artwork"].front_default,
        });
      }
      const finalGroups = Object.values(evolutionGroups);
      setAllGroups(finalGroups);
      setFilteredGroups(finalGroups);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = (tipo: string, texto: string) => {
    setSelectedType(tipo);
    setSearch(texto);
    const filtered = allGroups.filter((family) =>
      family.some(
        (pkm: any) =>
          (tipo === "todos" || pkm.type === tipo) &&
          pkm.name.toLowerCase().includes(texto.toLowerCase()),
      ),
    );
    setFilteredGroups(filtered);
  };

  if (loading)
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
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar Pokémon..."
          value={search}
          onChangeText={(t) => aplicarFiltros(selectedType, t)}
        />
      </View>

      <View style={{ height: 55, marginBottom: 5 }}>
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

      <FlatList
        data={filteredGroups}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item: family }) => (
          <View style={styles.familyWrapper}>
            <Text style={styles.evoTitle}>LÍNEA EVOLUTIVA</Text>
            <View style={styles.familyGrid}>
              {family.map((pkm: any) => (
                <TouchableOpacity
                  key={pkm.id}
                  style={[
                    styles.card,
                    {
                      backgroundColor:
                        TYPE_COLORS[pkm.type] || TYPE_COLORS.default,
                    },
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
              ))}
            </View>
          </View>
        )}
      />
    </PokedexLayout>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { padding: 15 },
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
    elevation: 3,
  },
  typeBtnText: { color: "white", fontWeight: "900", fontSize: 13 },
  typeSelected: { borderWidth: 3, borderColor: "#000" },
  familyWrapper: { marginVertical: 15, alignItems: "center" },
  evoTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#D32F2F",
    marginBottom: 10,
    letterSpacing: 2,
    backgroundColor: "rgba(211, 47, 47, 0.1)",
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 12,
    overflow: "hidden",
  },
  familyGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 20,
    width: "94%",
    elevation: 4,
    boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
  },
  card: {
    width: "44%",
    margin: "2%",
    borderRadius: 15,
    alignItems: "center",
    paddingVertical: 12,
  },
  image: { width: 75, height: 75 },
  name: {
    fontSize: 13,
    fontWeight: "bold",
    color: "white",
    textTransform: "capitalize",
    marginTop: 4,
  },
  id: { color: "rgba(255,255,255,0.9)", fontSize: 10, fontWeight: "800" },
});
