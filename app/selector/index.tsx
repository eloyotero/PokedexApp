import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getPokemonDetail } from "../../api/pokemonApi";

export default function SelectorScreen() {
  const router = useRouter();
  const [team, setTeam] = useState<any[]>([]);

  async function addRandomPokemon() {
    if (team.length >= 3) return;

    const id = Math.floor(Math.random() * 151) + 1;
    const data = await getPokemonDetail(String(id));

    setTeam((prev) => [...prev, data]);
  }

  function startBattle() {
    router.push({
      pathname: "/batalla/combat",
      params: { team: JSON.stringify(team) },
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecciona tu equipo (3 Pokémon)</Text>

      <ScrollView contentContainerStyle={styles.list}>
        {team.map((p, i) => (
          <View key={i} style={styles.card}>
            <Image
              source={{ uri: p.sprites.front_default }}
              style={styles.sprite}
            />
            <Text style={styles.name}>{p.name.toUpperCase()}</Text>

            <View style={styles.typesRow}>
              {p.types.map((t: any, idx: number) => (
                <View
                  key={idx}
                  style={[
                    styles.typeChip,
                    { backgroundColor: typeColor(t.type.name) },
                  ]}
                >
                  <Text style={styles.typeText}>{t.type.name}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      {team.length < 3 && (
        <TouchableOpacity style={styles.addButton} onPress={addRandomPokemon}>
          <Text style={styles.addText}>AÑADIR POKÉMON ALEATORIO</Text>
        </TouchableOpacity>
      )}

      {team.length === 3 && (
        <TouchableOpacity style={styles.startButton} onPress={startBattle}>
          <Text style={styles.startText}>COMENZAR BATALLA</Text>
        </TouchableOpacity>
      )}
    </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  list: { alignItems: "center", gap: 20 },
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
  typesRow: { flexDirection: "row", gap: 10, marginTop: 10 },
  typeChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  typeText: { color: "white", fontWeight: "bold" },
  addButton: {
    backgroundColor: "#4A90E2",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    borderWidth: 2,
    borderColor: "#003366",
  },
  addText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  startButton: {
    backgroundColor: "#FFEB3B",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    borderWidth: 2,
    borderColor: "#F57F17",
  },
  startText: {
    color: "black",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
});
