import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { isFavorite, toggleFavorite } from "../../utils/favorites";

export default function PokemonDetail() {
  const { name } = useLocalSearchParams();
  const router = useRouter();

  const [pokemon, setPokemon] = useState<any>(null);
  const [fav, setFav] = useState(false);

  useEffect(() => {
    loadPokemon();
  }, [name]);

  async function loadPokemon() {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const data = await res.json();
    setPokemon(data);

    const f = await isFavorite(data);
    setFav(f);
  }

  async function toggleFavPress() {
    const nowFav = await toggleFavorite(pokemon);
    setFav(nowFav);
  }

  if (!pokemon) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ fontSize: 20 }}>Cargando...</Text>
      </View>
    );
  }

  const mainType = pokemon.types[0].type.name;
  const bgColor = typeBackground(mainType);

  return (
    <ScrollView style={[styles.container, { backgroundColor: bgColor }]}>
      <Text style={styles.title}>
        #{pokemon.id} {pokemon.name.toUpperCase()}
      </Text>

      <View style={styles.imagesRow}>
        <Image
          source={{ uri: pokemon.sprites.front_default }}
          style={styles.sprite}
        />
        <Image
          source={{ uri: pokemon.sprites.back_default }}
          style={styles.sprite}
        />
      </View>

      <View style={styles.typesRow}>
        {pokemon.types.map((t: any, i: number) => (
          <View
            key={i}
            style={[
              styles.typeChip,
              { backgroundColor: typeColor(t.type.name) },
            ]}
          >
            <Text style={styles.typeText}>{t.type.name}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.section}>Stats</Text>

      {pokemon.stats.map((s: any, i: number) => {
        const value = s.base_stat;
        const percent = Math.min(value / 150, 1);
        const barColor =
          value < 50 ? "#FF5252" : value < 90 ? "#FFCA28" : "#66BB6A";

        return (
          <View key={i} style={{ marginBottom: 12 }}>
            <Text style={styles.statLabel}>{s.stat.name.toUpperCase()}</Text>

            <View style={styles.statBarBackground}>
              <View
                style={[
                  styles.statBarFill,
                  {
                    width: `${percent * 100}%`,
                    backgroundColor: barColor,
                  },
                ]}
              />
            </View>

            <Text style={styles.statValue}>{value}</Text>
          </View>
        );
      })}

      <TouchableOpacity style={styles.favButton} onPress={toggleFavPress}>
        <Text style={styles.favText}>
          {fav ? "⭐ Quitar de favoritos" : "☆ Añadir a favoritos"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>Volver</Text>
      </TouchableOpacity>
    </ScrollView>
  );
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

function typeBackground(type: string) {
  const backgrounds: any = {
    fire: "#FF8A65",
    water: "#4FC3F7",
    grass: "#81C784",
    electric: "#FFF176",
    ice: "#80DEEA",
    fighting: "#E57373",
    poison: "#BA68C8",
    ground: "#D7CCC8",
    flying: "#B39DDB",
    psychic: "#F48FB1",
    bug: "#DCE775",
    rock: "#BCAAA4",
    ghost: "#9575CD",
    dragon: "#9575CD",
    dark: "#8D6E63",
    steel: "#B0BEC5",
    fairy: "#F8BBD0",
    normal: "#E0E0E0",
  };
  return backgrounds[type] || "#DDD";
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "white",
    textAlign: "center",
    marginBottom: 20,
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },

  imagesRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginBottom: 20,
  },

  sprite: { width: 120, height: 120 },

  typesRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 25,
  },

  typeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  typeText: {
    color: "white",
    fontWeight: "bold",
    textTransform: "capitalize",
  },

  section: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    marginBottom: 15,
  },

  statLabel: {
    color: "white",
    fontSize: 14,
    marginBottom: 3,
  },

  statBarBackground: {
    width: "100%",
    height: 12,
    backgroundColor: "#333",
    borderRadius: 6,
    overflow: "hidden",
  },

  statBarFill: {
    height: "100%",
    borderRadius: 6,
  },

  statValue: {
    color: "white",
    fontSize: 14,
    marginTop: 2,
    textAlign: "right",
    fontWeight: "bold",
  },

  favButton: {
    backgroundColor: "#FFD700",
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
    borderWidth: 2,
    borderColor: "#B8860B",
  },

  favText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },

  backButton: {
    backgroundColor: "#4A90E2",
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
    borderWidth: 2,
    borderColor: "#003366",
    marginBottom: 40,
  },

  backText: {
    textAlign: "center",
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
