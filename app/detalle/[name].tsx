import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PokedexLayout from "../../components/PokedexLayout";

const KEY = "FAVORITE_POKEMONS";
const TYPE_COLORS: any = {
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
  default: "#4caf50",
};

const fullCache: any = {};

export default function DetallePokemon() {
  const { name } = useLocalSearchParams();
  const router = useRouter();

  const cachedData = fullCache[name as string];

  const [pokemon, setPokemon] = useState<any>(cachedData?.pokemon || null);
  const [evolutions, setEvolutions] = useState<any[]>(
    cachedData?.evolutions || [],
  );
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(!cachedData);

  const mainColor = pokemon
    ? TYPE_COLORS[pokemon.types[0].type.name] || TYPE_COLORS.default
    : TYPE_COLORS.default;

  useEffect(() => {
    if (name) fetchData();
  }, [name]);

  const fetchData = async () => {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      const pkmData = await res.json();

      const speciesRes = await fetch(pkmData.species.url);
      const speciesData = await speciesRes.json();
      const evoRes = await fetch(speciesData.evolution_chain.url);
      const evoData = await evoRes.json();

      let chain = [];
      let current = evoData.chain;
      while (current) {
        const id = current.species.url.split("/").filter(Boolean).pop();
        chain.push({
          name: current.species.name,
          image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
        });
        current = current.evolves_to[0];
      }

      fullCache[name as string] = { pokemon: pkmData, evolutions: chain };

      setPokemon(pkmData);
      setEvolutions(chain);

      const favsJson = await AsyncStorage.getItem(KEY);
      setIsFav(favsJson ? JSON.parse(favsJson).includes(pkmData.name) : false);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const añadirAFavoritos = async () => {
    if (isFav) return;
    const json = await AsyncStorage.getItem(KEY);
    let favs = json ? JSON.parse(json) : [];
    favs.push(pokemon.name);
    await AsyncStorage.setItem(KEY, JSON.stringify(favs));
    setIsFav(true);
  };

  if (loading && !pokemon)
    return (
      <PokedexLayout>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#D32F2F" />
        </View>
      </PokedexLayout>
    );

  return (
    <PokedexLayout>
      <View style={{ flex: 1, backgroundColor: mainColor + "10" }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.cardHeader}>
            <Text style={[styles.pkmName, { color: mainColor }]}>
              {pokemon.name}
            </Text>
            <Image
              source={{
                uri: pokemon.sprites.other["official-artwork"].front_default,
              }}
              style={styles.pkmImage}
            />
            <TouchableOpacity
              style={[
                styles.btnFav,
                { backgroundColor: isFav ? "#666" : mainColor },
              ]}
              onPress={añadirAFavoritos}
              disabled={isFav}
            >
              <Ionicons
                name={isFav ? "heart" : "heart-outline"}
                size={26}
                color="white"
              />
              <Text style={styles.btnText}>
                {isFav ? " CAPTURADO" : " AÑADIR A FAVORITOS"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statsBox}>
            <Text style={[styles.sectionTitle, { color: mainColor }]}>
              ESTADÍSTICAS BASE
            </Text>
            {pokemon.stats.map((s: any) => {
              const statColor =
                s.base_stat > 100
                  ? mainColor
                  : s.base_stat > 60
                    ? mainColor + "CC"
                    : mainColor + "88";
              return (
                <View key={s.stat.name} style={styles.statRow}>
                  <Text style={styles.statLabel}>
                    {s.stat.name.replace("-", " ")}
                  </Text>
                  <View style={styles.barContainer}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          width: `${Math.min((s.base_stat / 150) * 100, 100)}%`,
                          backgroundColor: statColor,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.statValue, { color: mainColor }]}>
                    {s.base_stat}
                  </Text>
                </View>
              );
            })}
          </View>

          <View style={styles.evoBox}>
            <Text style={styles.sectionTitle}>LÍNEA EVOLUTIVA</Text>
            {evolutions.map((evo, i) => (
              <TouchableOpacity
                key={i}
                style={styles.evoItem}
                onPress={() => router.push(`/detalle/${evo.name}`)}
              >
                <Image source={{ uri: evo.image }} style={styles.evoImg} />
                <Text
                  style={[
                    styles.evoName,
                    { color: evo.name === pokemon.name ? mainColor : "#333" },
                  ]}
                >
                  {evo.name.toUpperCase()}
                </Text>
                {i < evolutions.length - 1 && (
                  <Ionicons
                    name="chevron-down"
                    size={30}
                    color={mainColor + "40"}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </PokedexLayout>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  cardHeader: { alignItems: "center", paddingVertical: 30 },
  pkmName: {
    fontSize: 40,
    fontWeight: "900",
    textTransform: "capitalize",
    letterSpacing: 2,
  },
  pkmImage: { width: 250, height: 250 },
  btnFav: {
    flexDirection: "row",
    marginTop: 25,
    paddingVertical: 15,
    paddingHorizontal: 35,
    borderRadius: 35,
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.3,
  },
  btnText: { color: "white", fontWeight: "900", fontSize: 16, marginLeft: 10 },

  statsBox: {
    backgroundColor: "white",
    borderRadius: 35,
    padding: 30,
    marginHorizontal: 15,
    marginBottom: 20,
    elevation: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 25,
    textAlign: "center",
    letterSpacing: 1,
  },
  statRow: { flexDirection: "row", alignItems: "center", marginVertical: 10 },
  statLabel: {
    flex: 2.5,
    textTransform: "capitalize",
    fontSize: 14,
    color: "#444",
    fontWeight: "800",
  },
  barContainer: {
    flex: 4,
    height: 16,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    overflow: "hidden",
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  barFill: { height: "100%", borderRadius: 8 },
  statValue: { flex: 1, textAlign: "right", fontWeight: "900", fontSize: 18 },

  evoBox: {
    backgroundColor: "white",
    borderRadius: 35,
    padding: 30,
    marginHorizontal: 15,
    marginBottom: 40,
    elevation: 10,
  },
  evoItem: { alignItems: "center", marginVertical: 15 },
  evoImg: { width: 120, height: 120 },
  evoName: { fontWeight: "900", marginTop: 10, fontSize: 18, letterSpacing: 1 },
});
