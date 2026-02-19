import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PokedexLayout from "../../components/PokedexLayout";

const TABLA_TIPOS: any = {
  fire: {
    grass: 2,
    ice: 2,
    bug: 2,
    steel: 2,
    water: 0.5,
    fire: 0.5,
    rock: 0.5,
    dragon: 0.5,
  },
  water: { fire: 2, ground: 2, rock: 2, water: 0.5, grass: 0.5, dragon: 0.5 },
  grass: {
    water: 2,
    ground: 2,
    rock: 2,
    fire: 0.5,
    grass: 0.5,
    poison: 0.5,
    flying: 0.5,
    bug: 0.5,
    steel: 0.5,
    dragon: 0.5,
  },
  electric: {
    water: 2,
    flying: 2,
    electric: 0.5,
    grass: 0.5,
    dragon: 0.5,
    ground: 0,
  },
  normal: { rock: 0.5, steel: 0.5, ghost: 0 },
};

const TYPE_COLORS: any = {
  fire: "#FF4422",
  water: "#3399FF",
  grass: "#77CC55",
  electric: "#FFCC33",
  psychic: "#FF5599",
  ice: "#66CCFF",
  dragon: "#7766EE",
  ghost: "#6666BB",
  normal: "#AAAA99",
  fighting: "#BB5544",
  poison: "#AA5599",
  ground: "#E2C56A",
  flying: "#8899FF",
  bug: "#AABB22",
  rock: "#BBAA66",
  steel: "#AAAABB",
  fairy: "#EE99EE",
};

export default function CombatScreen() {
  const { modo } = useLocalSearchParams();
  const router = useRouter();

  const [equipo, setEquipo] = useState<any[]>([]);
  const [intentos, setIntentos] = useState(0);
  const [enCombate, setEnCombate] = useState(false);
  const [combateFinalizado, setCombateFinalizado] = useState(false);
  const [turnoBloqueado, setTurnoBloqueado] = useState(false);

  const [pkmRival, setPkmRival] = useState<any>(null);
  const [hpPropia, setHpPropia] = useState(100);
  const [hpRival, setHpRival] = useState(100);
  const [pkmActualIndex, setPkmActualIndex] = useState(0);
  const [log, setLog] = useState("");
  const [mensajeFinal, setMensajeFinal] = useState("");

  const animPlayer = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const animRival = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const opacityPlayer = useRef(new Animated.Value(1)).current;
  const opacityRival = useRef(new Animated.Value(1)).current;

  const cerrarCombate = () => {
    setEnCombate(false);
    setCombateFinalizado(false);
    setMensajeFinal("");
    setHpPropia(100);
    setHpRival(100);
    setLog("");
    setTurnoBloqueado(false);
  };

  const animacionAtaque = (isPlayer: boolean) => {
    const animValue = isPlayer ? animPlayer : animRival;
    Animated.sequence([
      Animated.timing(animValue, {
        toValue: { x: isPlayer ? 30 : -30, y: isPlayer ? -20 : 20 },
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animValue, {
        toValue: { x: 0, y: 0 },
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animacionRecibirDaño = (isPlayer: boolean) => {
    const opacityValue = isPlayer ? opacityPlayer : opacityRival;
    Animated.sequence([
      Animated.timing(opacityValue, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(opacityValue, {
        toValue: 1,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(opacityValue, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(opacityValue, {
        toValue: 1,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const getEficaciaTexto = (tipoAtk: string) => {
    const mult = TABLA_TIPOS[tipoAtk]?.[pkmRival?.type] || 1;
    if (mult === 0) return "(No Eficaz)";
    if (mult === 0.5) return "(Poco Eficaz)";
    if (mult === 1) return "(Eficaz)";
    if (mult === 1.5) return "(Buen Eficaz)";
    if (mult >= 2) return "(Supereficaz)";
    return "(Eficaz)";
  };

  const generarAleatorios = async () => {
    if (intentos >= 2) return;
    try {
      const cantidad = parseInt(modo as string);
      const nuevosPokes = [];
      for (let i = 0; i < cantidad; i++) {
        const id = Math.floor(Math.random() * 151) + 1;
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = await res.json();
        nuevosPokes.push({
          name: data.name,
          image: data.sprites.other["official-artwork"].front_default,
          type: data.types[0].type.name,
          speed: data.stats[5].base_stat,
          moves: data.moves
            .slice(0, 4)
            .map((m: any) => ({
              name: m.move.name,
              type: data.types[0].type.name,
            })),
        });
      }
      setEquipo(nuevosPokes);
      setIntentos((prev) => prev + 1);
    } catch (e) {
      console.error(e);
    }
  };

  const iniciarCombate = async () => {
    const idRival = Math.floor(Math.random() * 151) + 1;
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${idRival}`);
    const data = await res.json();
    setPkmRival({
      name: data.name,
      type: data.types[0].type.name,
      image: data.sprites.other["official-artwork"].front_default,
      speed: data.stats[5].base_stat,
    });
    setEnCombate(true);
  };

  const atacar = (move: any) => {
    if (combateFinalizado || turnoBloqueado) return;
    setTurnoBloqueado(true);
    animacionAtaque(true);

    setTimeout(() => {
      const mult = TABLA_TIPOS[move.type]?.[pkmRival.type] || 1;
      const crit = Math.random() < 0.15;
      const miss = Math.random() < 0.1;

      if (miss) {
        setLog(
          `${equipo[pkmActualIndex].name.toUpperCase()} falló el ataque...`,
        );
      } else {
        animacionRecibirDaño(false);
        const daño = Math.floor(
          (Math.random() * 10 + 15) * mult * (crit ? 1.5 : 1),
        );
        const nuevaHpR = Math.max(0, hpRival - daño);
        setHpRival(nuevaHpR);
        setLog(
          `${equipo[pkmActualIndex].name.toUpperCase()} usó ${move.name.toUpperCase()}! (-${daño})`,
        );
        if (nuevaHpR <= 0) {
          setTimeout(() => {
            setCombateFinalizado(true);
            setMensajeFinal("Entrenador Eloy ganó 300 ¥");
          }, 800);
          return;
        }
      }

      setTimeout(() => {
        animacionAtaque(false);
        setTimeout(() => {
          const resRivalMiss = Math.random() < 0.1;
          if (resRivalMiss) {
            setLog(`¡${pkmRival.name.toUpperCase()} enemigo falló el ataque!`);
          } else {
            animacionRecibirDaño(true);
            const dañoR = Math.floor(Math.random() * 12 + 10);
            const nuevaHpP = Math.max(0, hpPropia - dañoR);
            setHpPropia(nuevaHpP);
            setLog(
              `¡${pkmRival.name.toUpperCase()} enemigo atacó! (-${dañoR})`,
            );
            if (nuevaHpP <= 0) {
              setTimeout(() => {
                setCombateFinalizado(true);
                setMensajeFinal("Entrenador Eloy fue derrotado");
              }, 500);
            }
          }
          setTurnoBloqueado(false);
        }, 500);
      }, 1000);
    }, 300);
  };

  if (enCombate) {
    return (
      <PokedexLayout>
        <View style={styles.arena}>
          {combateFinalizado && (
            <View style={styles.cartelFinal}>
              <Text style={styles.textoCartel}>{mensajeFinal}</Text>
              <TouchableOpacity
                style={styles.btnCerrarCartel}
                onPress={cerrarCombate}
              >
                <Text style={styles.btnCerrarText}>CERRAR</Text>
              </TouchableOpacity>
            </View>
          )}
          <Animated.View
            style={[
              styles.rivalSide,
              {
                transform: animRival.getTranslateTransform(),
                opacity: opacityRival,
              },
            ]}
          >
            <View style={styles.pkmWrapper}>
              <Image source={{ uri: pkmRival.image }} style={styles.pkmImg} />
              <View style={styles.statusMini}>
                <View style={styles.hpBarContainer}>
                  <View
                    style={[
                      styles.hpFill,
                      {
                        width: `${hpRival}%`,
                        backgroundColor: hpRival < 30 ? "#ff4444" : "#4caf50",
                      },
                    ]}
                  />
                </View>
                <Text style={styles.hpNumber}>{hpRival}/100</Text>
              </View>
            </View>
          </Animated.View>
          <Animated.View
            style={[
              styles.playerSide,
              {
                transform: animPlayer.getTranslateTransform(),
                opacity: opacityPlayer,
              },
            ]}
          >
            <View style={styles.pkmWrapper}>
              <Image
                source={{ uri: equipo[pkmActualIndex].image }}
                style={styles.pkmImg}
              />
              <View style={styles.statusMini}>
                <View style={styles.hpBarContainer}>
                  <View
                    style={[
                      styles.hpFill,
                      {
                        width: `${hpPropia}%`,
                        backgroundColor: hpPropia < 30 ? "#ff4444" : "#4caf50",
                      },
                    ]}
                  />
                </View>
                <Text style={styles.hpNumber}>{hpPropia}/100</Text>
              </View>
            </View>
          </Animated.View>
        </View>
        <View style={styles.console}>
          <Text style={styles.log}>{log}</Text>
          <View style={styles.gridAtaques}>
            {equipo[pkmActualIndex].moves.map((m: any, i: number) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.ataqueCard,
                  {
                    backgroundColor: TYPE_COLORS[m.type] || "#777",
                    opacity: turnoBloqueado ? 0.6 : 1,
                  },
                ]}
                onPress={() => atacar(m)}
                disabled={combateFinalizado || turnoBloqueado}
              >
                <Text style={styles.ataqueTexto}>{m.name.toUpperCase()}</Text>
                <Text style={styles.eficaciaTexto}>
                  {getEficaciaTexto(m.type)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </PokedexLayout>
    );
  }

  return (
    <PokedexLayout>
      <View style={styles.previa}>
        <Text style={styles.title}>EQUIPO SELECCIONADO</Text>
        <TouchableOpacity
          style={styles.btnGen}
          onPress={generarAleatorios}
          disabled={intentos >= 2}
        >
          <Text style={styles.btnGenText}>CAMBIAR EQUIPO ({intentos}/2)</Text>
        </TouchableOpacity>

        <ScrollView
          contentContainerStyle={styles.teamGrid}
          showsVerticalScrollIndicator={false}
        >
          {equipo.map((p, i) => (
            <View key={i} style={styles.miniCard}>
              <Image source={{ uri: p.image }} style={styles.previaImg} />
              <Text style={styles.miniName}>{p.name.toUpperCase()}</Text>
            </View>
          ))}
        </ScrollView>

        {equipo.length > 0 && (
          <TouchableOpacity style={styles.btnStart} onPress={iniciarCombate}>
            <Text style={styles.btnStartText}>¡EMPEZAR COMBATE!</Text>
          </TouchableOpacity>
        )}
      </View>
    </PokedexLayout>
  );
}

const styles = StyleSheet.create({
  arena: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
    justifyContent: "center",
  },
  rivalSide: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 40,
  },
  playerSide: { flexDirection: "row", justifyContent: "flex-start" },
  pkmWrapper: { alignItems: "center", width: "35%" },
  pkmImg: { width: 140, height: 140 },
  statusMini: { width: "100%", marginTop: 5, alignItems: "center" },
  hpBarContainer: {
    height: 5,
    width: "100%",
    backgroundColor: "#eee",
    borderRadius: 2,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#333",
  },
  hpFill: { height: "100%" },
  hpNumber: { fontSize: 8, color: "#333", fontWeight: "bold", marginTop: 1 },
  console: {
    backgroundColor: "#333",
    padding: 15,
    borderTopWidth: 4,
    borderColor: "#000",
    minHeight: 280,
  },
  log: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 15,
    height: 40,
  },
  gridAtaques: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  ataqueCard: {
    width: "48%",
    paddingVertical: 18,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  ataqueTexto: { color: "white", fontWeight: "bold", fontSize: 14 },
  eficaciaTexto: {
    color: "white",
    fontWeight: "900",
    fontSize: 12,
    marginTop: 2,
  },
  cartelFinal: {
    position: "absolute",
    top: "35%",
    left: "10%",
    right: "10%",
    zIndex: 100,
    backgroundColor: "rgba(0,0,0,0.95)",
    padding: 30,
    borderRadius: 15,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFCC33",
    elevation: 15,
  },
  textoCartel: {
    color: "white",
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 20,
  },
  btnCerrarCartel: {
    backgroundColor: "#FFCC33",
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 8,
  },
  btnCerrarText: { fontWeight: "bold", color: "black", fontSize: 16 },
  previa: { flex: 1, padding: 20, alignItems: "center" },
  title: {
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  btnGen: {
    backgroundColor: "#444",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  btnGenText: { color: "white", fontWeight: "bold" },
  teamGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingBottom: 20,
  },
  miniCard: {
    width: "90%",
    backgroundColor: "#f9f9f9",
    borderRadius: 20,
    alignItems: "center",
    padding: 20,
    marginBottom: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#eee",
  },
  previaImg: { width: 140, height: 140, resizeMode: "contain" }, // MUCHO MÁS GRANDE
  miniName: {
    fontSize: 18,
    fontWeight: "900",
    marginTop: 10,
    color: "#222",
    letterSpacing: 1,
  },
  btnStart: {
    backgroundColor: "#D32F2F",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 10,
    width: "100%",
    borderBottomWidth: 5,
    borderBottomColor: "#8B0000",
  },
  btnStartText: { color: "white", fontWeight: "bold", fontSize: 22 },
});
