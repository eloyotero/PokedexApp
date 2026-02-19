import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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

export default function SelectorScreen() {
  const router = useRouter();
  const { limit } = useLocalSearchParams();
  const maxSelected = parseInt(limit as string) || 1;

  const [pokemons, setPokemons] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPokemons()
      .then((res) => setPokemons(res.results))
      .finally(() => setLoading(false));
  }, []);

  const toggleSelect = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      if (selectedIds.length < maxSelected) {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  const handleConfirm = () => {
    if (selectedIds.length === maxSelected) {
      // Mandamos al combate. Usamos el primer seleccionado para la pelea actual.
      router.push({
        pathname: "/batalla/combat",
        params: {
          idPlayer: selectedIds[0],
          idRival: Math.floor(Math.random() * 151) + 1,
        },
      });
    }
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
      <View style={styles.container}>
        <Text style={styles.title}>SELECCIONA TU EQUIPO</Text>
        <Text style={styles.subtitle}>
          Elegidos: {selectedIds.length} de {maxSelected}
        </Text>

        <FlatList
          data={pokemons}
          numColumns={3}
          keyExtractor={(item) => item.name}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => {
            const id = parseInt(
              item.url.split("/").filter(Boolean).pop() || "0",
            );
            const isSelected = selectedIds.includes(id);
            const img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

            return (
              <TouchableOpacity
                style={[styles.card, isSelected && styles.cardSelected]}
                onPress={() => toggleSelect(id)}
              >
                <Image source={{ uri: img }} style={styles.image} />
                <Text style={styles.name}>{item.name}</Text>
              </TouchableOpacity>
            );
          }}
        />

        <TouchableOpacity
          style={[
            styles.btnConfirm,
            selectedIds.length < maxSelected && styles.btnDisabled,
          ]}
          onPress={handleConfirm}
          disabled={selectedIds.length < maxSelected}
        >
          <Text style={styles.btnText}>¡A COMBATIR!</Text>
        </TouchableOpacity>
      </View>
    </PokedexLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 15,
    color: "#666",
    fontWeight: "600",
  },
  card: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#eee",
    elevation: 2,
  },
  cardSelected: { borderColor: "#ef5350", backgroundColor: "#ffebee" },
  image: { width: 70, height: 70 },
  name: {
    fontSize: 11,
    textTransform: "capitalize",
    fontWeight: "bold",
    marginTop: 5,
  },
  btnConfirm: {
    backgroundColor: "#333",
    padding: 18,
    borderRadius: 15,
    marginTop: 10,
    alignItems: "center",
    elevation: 4,
  },
  btnDisabled: { backgroundColor: "#bbb" },
  btnText: { color: "white", fontWeight: "bold", fontSize: 18 },
});
