import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function PokedexScreen() {
  const router = useRouter();

  const [groups, setGroups] = useState<any[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const types = [
    "fire",
    "water",
    "grass",
    "electric",
    "ice",
    "fighting",
    "poison",
    "ground",
    "flying",
    "psychic",
    "bug",
    "rock",
    "ghost",
    "dragon",
    "dark",
    "steel",
    "fairy",
    "normal",
  ];

  useEffect(() => {
    loadPokedex();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, typeFilter, groups]);

  async function loadPokedex() {
    try {
      const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
      const data = await res.json();

      const detailed = await Promise.all(
        data.results.map(async (p: any) => {
          const d = await fetch(p.url);
          return await d.json();
        }),
      );

      const evoGroups: Record<string, any[]> = {};

      for (const p of detailed) {
        const species = await (await fetch(p.species.url)).json();
        const evoData = await (await fetch(species.evolution_chain.url)).json();
        const chainId = evoData.id;

        if (!evoGroups[chainId]) evoGroups[chainId] = [];
        evoGroups[chainId].push(p);
      }

      const finalGroups = Object.values(evoGroups).map((g: any[]) =>
        g.sort((a, b) => a.id - b.id),
      );

      setGroups(finalGroups);
      setFilteredGroups(finalGroups);
      setLoading(false);
    } catch (e) {
      console.log("Error cargando pokedex:", e);
    }
  }

  function applyFilters() {
    let result = [...groups];

    if (search.trim() !== "") {
      result = result
        .map((g) =>
          g.filter(
            (p: any) =>
              p.name.toLowerCase().includes(search.toLowerCase()) ||
              String(p.id) === search,
          ),
        )
        .filter((g) => g.length > 0);
    }

    if (typeFilter !== "") {
      result = result
        .map((g) =>
          g.filter((p: any) =>
            p.types.some((t: any) => t.type.name === typeFilter),
          ),
        )
        .filter((g) => g.length > 0);
    }

    setFilteredGroups(result);
  }

  function typeColor(type: string) {
    const colors: any = {
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
      dark: "#705848",
      steel: "#B8B8D0",
      fairy: "#EE99AC",
      normal: "#A8A878",
    };
    return colors[type] || "#AAA";
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 20 }}>Cargando Pokédex...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.pokedexBody}>
      <View style={styles.pokedexFrame}>
        <View style={styles.topLights}>
          <View style={styles.bigBlueLight} />
          <View style={styles.smallRedLight} />
          <View style={styles.smallYellowLight} />
          <View style={styles.smallGreenLight} />
        </View>

        <View style={styles.screen}>
          <Text style={styles.title}>POKÉDEX</Text>

          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre "
            placeholderTextColor="#AAA"
            value={search}
            onChangeText={setSearch}
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.typeScroll}
          >
            {types.map((t) => (
              <TouchableOpacity
                key={t}
                style={[
                  styles.typeButton,
                  { backgroundColor: typeColor(t) },
                  typeFilter === t && styles.typeButtonActive,
                ]}
                onPress={() => setTypeFilter(typeFilter === t ? "" : t)}
              >
                <Text style={styles.typeButtonText}>{t.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {filteredGroups.map((group: any[], index: number) => {
            const mainType = group[0].types[0].type.name;

            return (
              <View key={index} style={styles.groupContainer}>
                <View
                  style={[
                    styles.groupHeader,
                    { backgroundColor: typeColor(mainType) },
                  ]}
                >
                  <Text style={styles.groupTitle}>
                    {group[0].name.toUpperCase()} — LÍNEA EVOLUTIVA
                  </Text>
                </View>

                <View style={styles.groupGrid}>
                  {group.map((p) => (
                    <TouchableOpacity
                      key={p.id}
                      style={styles.card}
                      onPress={() =>
                        router.push({
                          pathname: "/detalle/[name]",
                          params: { name: String(p.name) },
                        })
                      }
                    >
                      <Image
                        source={{ uri: p.sprites.front_default }}
                        style={styles.sprite}
                      />
                      <Text style={styles.name}>
                        #{p.id} {p.name.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#D00000",
  },
  pokedexBody: { flex: 1, backgroundColor: "#D00000" },

  pokedexFrame: {
    margin: 20,
    padding: 15,
    backgroundColor: "#C00000",
    borderRadius: 20,
    borderWidth: 4,
    borderColor: "#700000",
  },

  topLights: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    gap: 10,
  },

  bigBlueLight: {
    width: 40,
    height: 40,
    backgroundColor: "#4FC3F7",
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#0288D1",
  },

  smallRedLight: {
    width: 15,
    height: 15,
    backgroundColor: "#FF5252",
    borderRadius: 8,
  },
  smallYellowLight: {
    width: 15,
    height: 15,
    backgroundColor: "#FFEB3B",
    borderRadius: 8,
  },
  smallGreenLight: {
    width: 15,
    height: 15,
    backgroundColor: "#66BB6A",
    borderRadius: 8,
  },

  screen: {
    backgroundColor: "#1A1A1A",
    borderRadius: 15,
    padding: 15,
    borderWidth: 4,
    borderColor: "#0D47A1",
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#4FC3F7",
    textAlign: "center",
    marginBottom: 15,
  },

  searchInput: {
    backgroundColor: "#333",
    color: "white",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#555",
  },

  typeScroll: { marginBottom: 15 },

  typeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
  },

  typeButtonActive: { borderWidth: 3, borderColor: "white" },

  typeButtonText: { color: "white", fontWeight: "bold" },

  groupContainer: { marginBottom: 25 },

  groupHeader: { padding: 8, borderRadius: 8, marginBottom: 10 },

  groupTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },

  groupGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 15,
  },

  card: {
    width: 110,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 10,
    borderWidth: 2,
    borderColor: "#003366",
    alignItems: "center",
  },

  sprite: { width: 80, height: 80 },
  name: { fontSize: 14, fontWeight: "bold", marginTop: 5, textAlign: "center" },
});
