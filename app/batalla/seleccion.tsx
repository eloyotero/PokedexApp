import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type SimplePokemon = {
  id: number;
  name: string;
};

export default function BattleSelectionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const sizeParam = params.size;

  const sizeValue = Array.isArray(sizeParam) ? sizeParam[0] : sizeParam;
  const maxSelection = sizeValue ? Number(sizeValue) : 3;

  const [pokemonList, setPokemonList] = useState<SimplePokemon[]>([]);
  const [selected, setSelected] = useState<SimplePokemon[]>([]);

  useEffect(() => {
    loadPokemon();
  }, []);

  useEffect(() => {
    setSelected([]);
  }, [sizeValue]);

  async function loadPokemon() {
    try {
      const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
      const data = await res.json();

      const simple: SimplePokemon[] = data.results.map(
        (p: any, index: number) => ({
          id: index + 1,
          name: p.name,
        }),
      );

      setPokemonList(simple);
    } catch (e) {
      console.log("Error cargando lista para batalla:", e);
    }
  }

  function toggleSelect(p: SimplePokemon) {
    const exists = selected.find((s) => s.id === p.id);

    if (exists) {
      setSelected(selected.filter((s) => s.id !== p.id));
      return;
    }

    if (selected.length >= maxSelection) return;

    setSelected([...selected, p]);
  }

  function startBattle() {
    if (selected.length !== maxSelection) return;

    router.replace({
      pathname: "/batalla/combat",
      params: {
        team: JSON.stringify(selected),
        size: String(maxSelection),
      },
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Elige {maxSelection} Pokémon</Text>

      <FlatList
        data={pokemonList}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => {
          const isSelected = selected.some((s) => s.id === item.id);

          return (
            <TouchableOpacity
              style={[styles.row, isSelected && styles.rowSelected]}
              onPress={() => toggleSelect(item)}
            >
              <Text style={styles.rowText}>
                #{item.id} {item.name.toUpperCase()}
              </Text>
              {isSelected && <Text style={styles.check}>✔</Text>}
            </TouchableOpacity>
          );
        }}
      />

      <Text style={styles.counter}>
        {selected.length} / {maxSelection}
      </Text>

      <TouchableOpacity
        style={[
          styles.startButton,
          selected.length !== maxSelection && styles.startButtonDisabled,
        ]}
        disabled={selected.length !== maxSelection}
        onPress={startBattle}
      >
        <Text style={styles.startText}>Empezar batalla</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.replace("/batalla")}
      >
        <Text style={styles.backText}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#333",
    marginBottom: 8,
  },
  rowSelected: {
    backgroundColor: "#4CAF50",
  },
  rowText: {
    color: "white",
    fontSize: 16,
  },
  check: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  counter: {
    color: "white",
    textAlign: "center",
    marginVertical: 10,
  },
  startButton: {
    backgroundColor: "#4A90E2",
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#003366",
  },
  startButtonDisabled: {
    backgroundColor: "#555",
    borderColor: "#444",
  },
  startText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    backgroundColor: "#555",
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#333",
    marginTop: 15,
    marginBottom: 20,
  },
  backText: {
    color: "white",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
  },
});
