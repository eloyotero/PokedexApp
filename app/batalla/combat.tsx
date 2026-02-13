import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getMove } from "../../api/moveApi";
import { getPokemonDetail } from "../../api/pokemonApi";
import { calculateDamage, getTurnOrder } from "../../utils/battleEngine";

export default function CombatScreen() {
  const router = useRouter();
  const { team } = useLocalSearchParams();
  const playerTeam = JSON.parse(team as string);

  const [playerIndex, setPlayerIndex] = useState(0);
  const [player, setPlayer] = useState<any>(playerTeam[0]);
  const [enemy, setEnemy] = useState<any>(null);

  const [playerMoves, setPlayerMoves] = useState<any[]>([]);
  const [enemyMoves, setEnemyMoves] = useState<any[]>([]);
  const [playerHP, setPlayerHP] = useState<number | null>(null);
  const [enemyHP, setEnemyHP] = useState<number | null>(null);

  const [log, setLog] = useState("¡Comienza la batalla!");
  const [playerTeamState, setPlayerTeamState] = useState(playerTeam);
  const [busy, setBusy] = useState(false);
  const [enemyCount, setEnemyCount] = useState(0);
  const [battleOver, setBattleOver] = useState(false);
  const [playerWon, setPlayerWon] = useState(false);

  const playerShake = useRef(new Animated.Value(0)).current;
  const enemyShake = useRef(new Animated.Value(0)).current;

  const playerEntry = useRef(new Animated.Value(1)).current;
  const enemyEntry = useRef(new Animated.Value(1)).current;

  const playerHPAnim = useRef(new Animated.Value(0)).current;
  const enemyHPAnim = useRef(new Animated.Value(0)).current;

  const animate = (value: Animated.Value, to: number, duration = 400) =>
    Animated.timing(value, {
      toValue: to,
      duration,
      useNativeDriver: false,
    }).start();

  const shakeAnim = (value: Animated.Value) =>
    Animated.sequence([
      Animated.timing(value, {
        toValue: 1,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(value, {
        toValue: -1,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(value, {
        toValue: 0,
        duration: 60,
        useNativeDriver: true,
      }),
    ]).start();

  const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

  useEffect(() => setPlayer(playerTeam[playerIndex]), [playerIndex]);

  useEffect(() => {
    if (player) {
      const max = player.stats[0].base_stat;
      setPlayerHP(max);
      playerHPAnim.setValue(max);
      loadMoves(player, setPlayerMoves);
      animate(playerEntry, 0);
    }
  }, [player]);

  useEffect(() => {
    const run = async () => await loadEnemy();
    run();
  }, []);

  async function loadEnemy() {
    if (enemyCount >= 3) {
      setBattleOver(true);
      setPlayerWon(true);
      setLog("¡Entrenador Eloy ha ganado el combate! Eloy ganó 300₽");
      return;
    }

    const id = Math.floor(Math.random() * 151) + 1;
    const data = await getPokemonDetail(String(id));
    const max = data.stats[0].base_stat;

    setEnemy(data);
    setEnemyHP(max);
    enemyHPAnim.setValue(max);
    loadMoves(data, setEnemyMoves);
    setLog(`¡Un ${data.name.toUpperCase()} salvaje apareció!`);
    animate(enemyEntry, 0);
  }

  async function loadMoves(pokemon: any, setter: any) {
    const moves = await Promise.all(
      pokemon.moves.slice(0, 4).map((m: any) => getMove(m.move.url)),
    );
    setter(moves);
  }

  function effectivenessLabel(move: any, attacker: any, defender: any) {
    const r = calculateDamage(attacker, defender, move);
    if (r.effectiveness === 0) return "No afecta";
    if (r.effectiveness > 1) return "Súper eficaz";
    if (r.effectiveness < 1) return "Poco eficaz";
    return "Eficaz";
  }

  async function useMove(move: any) {
    if (battleOver || busy || !enemy || playerHP === null || enemyHP === null)
      return;

    setBusy(true);

    const turn = getTurnOrder(player, enemy);

    if (turn === "player") {
      await attack(player, enemy, move, true);
      if (enemyHP > 0) await attack(enemy, player, null, false);
    } else {
      await attack(enemy, player, null, false);
      if (playerHP > 0) await attack(player, enemy, move, true);
    }

    setBusy(false);
  }

  async function attack(
    attacker: any,
    defender: any,
    move: any,
    isPlayer: boolean,
  ) {
    const usedMove =
      move || enemyMoves[Math.floor(Math.random() * enemyMoves.length)];
    const result = calculateDamage(attacker, defender, usedMove);

    const shakeTarget = isPlayer ? enemyShake : playerShake;
    const hpSetter = isPlayer ? setEnemyHP : setPlayerHP;
    const hpAnim = isPlayer ? enemyHPAnim : playerHPAnim;
    const currentHP = isPlayer ? enemyHP : playerHP;

    shakeAnim(shakeTarget);

    if (result.missed) {
      setLog(`${attacker.name} falló el ataque.`);
      return await wait(600);
    }

    const newHP = Math.max(0, currentHP! - result.damage);
    hpSetter(newHP);
    animate(hpAnim, newHP);

    let msg = `${attacker.name} usó ${usedMove.name}. Daño: ${result.damage}`;
    if (result.effectiveness === 0) msg += " No afecta...";
    else if (result.effectiveness > 1) msg += " ¡Es súper eficaz!";
    else if (result.effectiveness < 1) msg += " No es muy eficaz...";
    else msg += " Es eficaz.";
    if (result.crit) msg += " ¡Golpe crítico!";

    setLog(msg);
    await wait(900);

    if (newHP <= 0) {
      setLog(`¡${defender.name} se debilitó!`);
      await wait(800);

      if (isPlayer) {
        setEnemyCount((c) => {
          const next = c + 1;
          if (next >= 3) {
            setBattleOver(true);
            setPlayerWon(true);
            setLog("¡Entrenador Eloy ha ganado el combate! Eloy ganó 300₽");
            return next;
          }
          loadEnemy();
          return next;
        });
        return;
      }

      if (playerIndex < playerTeam.length - 1) {
        setPlayerIndex((i) => i + 1);
        setLog(`¡Adelante, ${playerTeam[playerIndex + 1].name}!`);
      } else {
        setBattleOver(true);
        setPlayerWon(false);
      }
    }
  }

  if (!enemy || playerHP === null || enemyHP === null)
    return (
      <View style={styles.container}>
        <Text style={{ color: "black" }}>Cargando batalla...</Text>
      </View>
    );

  const hpBar = (anim: Animated.Value, max: number, current: number) => ({
    width: anim.interpolate({
      inputRange: [0, max],
      outputRange: ["0%", "100%"],
    }),
    backgroundColor:
      current / max > 0.5
        ? "#00C853"
        : current / max > 0.2
          ? "#FFD600"
          : "#D50000",
  });

  return (
    <View style={styles.container}>
      {/* ENEMY */}
      <View style={styles.centerBox}>
        <View style={styles.infoBox}>
          <Text style={styles.name}>{enemy.name}</Text>
          <View style={styles.hpBarContainer}>
            <Animated.View
              style={[
                styles.hpBarFill,
                hpBar(enemyHPAnim, enemy.stats[0].base_stat, enemyHP),
              ]}
            />
          </View>
          <Text style={styles.hpText}>
            HP: {enemyHP} / {enemy.stats[0].base_stat}
          </Text>
        </View>

        <Animated.Image
          source={{ uri: enemy.sprites.back_default }}
          style={[
            styles.sprite,
            {
              transform: [
                {
                  translateX: enemyEntry.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 80],
                  }),
                },
                {
                  translateX: enemyShake.interpolate({
                    inputRange: [-1, 1],
                    outputRange: [-6, 6],
                  }),
                },
              ],
            },
          ]}
        />
      </View>

      {/* PLAYER */}
      <View style={styles.centerBox}>
        <Animated.Image
          source={{ uri: player.sprites.front_default }}
          style={[
            styles.sprite,
            {
              transform: [
                {
                  translateX: playerEntry.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -80],
                  }),
                },
                {
                  translateX: playerShake.interpolate({
                    inputRange: [-1, 1],
                    outputRange: [-6, 6],
                  }),
                },
              ],
            },
          ]}
        />

        <View style={styles.infoBox}>
          <Text style={styles.name}>{player.name}</Text>
          <View style={styles.hpBarContainer}>
            <Animated.View
              style={[
                styles.hpBarFill,
                hpBar(playerHPAnim, player.stats[0].base_stat, playerHP),
              ]}
            />
          </View>
          <Text style={styles.hpText}>
            HP: {playerHP} / {player.stats[0].base_stat}
          </Text>
        </View>
      </View>

      {/* TEXT BOX */}
      <View style={styles.textBox}>
        <Text style={styles.text}>{log}</Text>
      </View>

      {/* MENU */}
      {!battleOver && (
        <View style={styles.menu}>
          {playerMoves.map((m, i) => (
            <TouchableOpacity
              key={i}
              style={styles.menuButton}
              onPress={() => useMove(m)}
              disabled={busy || playerHP <= 0}
            >
              <Text style={styles.menuText}>
                {m.name} ({effectivenessLabel(m, player, enemy)})
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* FINAL */}
      {battleOver && (
        <View style={styles.overlay}>
          <View style={styles.overlayBox}>
            <Text style={styles.overlayTitle}>
              {playerWon
                ? "¡Entrenador Eloy ha ganado el combate!"
                : "Has perdido el combate..."}
            </Text>

            {playerWon && (
              <Text style={styles.overlayText}>Eloy ganó 300₽</Text>
            )}

            <TouchableOpacity
              style={styles.overlayButton}
              onPress={() => router.push("/")}
            >
              <Text style={styles.overlayButtonText}>Volver al menú</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },

  centerBox: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
  },

  sprite: { width: 120, height: 120 },

  infoBox: {
    backgroundColor: "#F5F5F5",
    borderRadius: 6,
    padding: 6,
    borderWidth: 2,
    borderColor: "#000",
    minWidth: 180,
    alignItems: "center",
  },

  name: { fontSize: 16, fontWeight: "bold", textTransform: "capitalize" },

  hpBarContainer: {
    width: "100%",
    height: 10,
    backgroundColor: "#BDBDBD",
    borderRadius: 4,
    marginTop: 4,
    overflow: "hidden",
  },

  hpBarFill: { height: "100%" },

  hpText: { fontSize: 12, marginTop: 2, fontFamily: "monospace" },

  textBox: {
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 6,
    marginHorizontal: 10,
    marginBottom: 6,
    height: 80,
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#FFF",
  },

  text: { fontSize: 16, color: "white" },

  menu: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },

  menuButton: {
    backgroundColor: "#FFEB3B",
    padding: 10,
    borderRadius: 6,
    width: "48%",
    borderWidth: 2,
    borderColor: "#F57F17",
  },

  menuText: { fontSize: 16, fontWeight: "bold", textTransform: "capitalize" },

  overlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  overlayBox: {
    backgroundColor: "#4A90E2",
    padding: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "#003366",
    width: "80%",
    alignItems: "center",
  },

  overlayTitle: { color: "white", fontSize: 18, marginBottom: 10 },
  overlayText: { color: "white", fontSize: 16, marginBottom: 20 },

  overlayButton: {
    backgroundColor: "#E0E0E0",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#555",
  },

  overlayButtonText: { color: "black", fontSize: 16 },
});
