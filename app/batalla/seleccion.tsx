import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity
} from "react-native";
import { getPokemons } from "../../api/pokemonApi";
import PokedexLayout from "../../components/PokedexLayout";

export default function SeleccionScreen() {
  const router = useRouter();
  const { maxSelected } = useLocalSearchParams();
  const limite = Number(maxSelected);
  const [pokemons, setPokemons] = useState<any[]>([]);
  const [seleccionados, setSeleccionados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPokemons()
      .then((res) => setPokemons(res.results))
      .finally(() => setLoading(false));
  }, []);

  const manejarSeleccion = (pokemon: any) => {
    const yaEsta = seleccionados.find((p) => p.name === pokemon.name);
    if (yaEsta)
      setSeleccionados(seleccionados.filter((p) => p.name !== pokemon.name));
    else if (seleccionados.length < limite)
      setSeleccionados([...seleccionados, pokemon]);
  };

  if (loading)
    return (
      <PokedexLayout>
        <ActivityIndicator style={{ flex: 1 }} />
      </PokedexLayout>
    );

  return (
    <PokedexLayout>
      <Text style={styles.titulo}>
        ELIGE TU EQUIPO ({seleccionados.length}/{limite})
      </Text>
      <FlatList
        data={pokemons}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              seleccionados.find((p) => p.name === item.name) &&
                styles.cardActive,
            ]}
            onPress={() => manejarSeleccion(item)}
          >
            <Text style={styles.pkmName}>{item.name.toUpperCase()}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        style={[
          styles.btn,
          seleccionados.length !== limite && { backgroundColor: "#ccc" },
        ]}
        disabled={seleccionados.length !== limite}
        onPress={() =>
          router.push({
            pathname: "/batalla/combat",
            params: { equipo: JSON.stringify(seleccionados) },
          })
        }
      >
        <Text style={styles.btnTxt}>CONFIRMAR EQUIPO</Text>
      </TouchableOpacity>
    </PokedexLayout>
  );
}

const styles = StyleSheet.create({
  titulo: { textAlign: "center", fontSize: 20, fontWeight: "bold", margin: 20 },
  card: {
    padding: 15,
    backgroundColor: "white",
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cardActive: { borderColor: "#4caf50", backgroundColor: "#e8f5e9" },
  pkmName: { fontWeight: "bold" },
  btn: {
    backgroundColor: "#D32F2F",
    padding: 20,
    margin: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  btnTxt: { color: "white", fontWeight: "bold" },
});
