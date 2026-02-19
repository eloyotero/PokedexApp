import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import PokedexLayout from "../../components/PokedexLayout";

export default function VictoriaScreen() {
  const router = useRouter();
  return (
    <PokedexLayout>
      <View style={styles.container}>
        <View style={styles.box}>
          <Text style={styles.txt}>¡VICTORIA!</Text>
          <Text style={styles.sub}>Entrenador Eloy ganó ¥300</Text>
        </View>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => router.replace("/batalla")}
        >
          <Text style={styles.btnTxt}>VOLVER</Text>
        </TouchableOpacity>
      </View>
    </PokedexLayout>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
  },
  box: {
    backgroundColor: "#2196F3",
    padding: 40,
    borderRadius: 20,
    alignItems: "center",
  },
  txt: { color: "white", fontSize: 40, fontWeight: "bold" },
  sub: { color: "white", marginTop: 10, fontSize: 18 },
  btn: {
    marginTop: 30,
    padding: 15,
    backgroundColor: "#333",
    borderRadius: 10,
  },
  btnTxt: { color: "white", fontWeight: "bold" },
});
