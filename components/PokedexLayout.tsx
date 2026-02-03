import { StyleSheet, View } from "react-native";

export default function PokedexLayout({ children }: any) {
  return (
    <View style={styles.container}>
      <View style={styles.pokedex}>
        <View style={styles.header}>
          <View style={styles.bigCircle} />
          <View style={styles.smallCirclesRow}>
            <View
              style={[styles.smallCircle, { backgroundColor: "#ff5f52" }]}
            />
            <View
              style={[styles.smallCircle, { backgroundColor: "#ffeb3b" }]}
            />
            <View
              style={[styles.smallCircle, { backgroundColor: "#4caf50" }]}
            />
          </View>
        </View>

        <View style={styles.screen}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#b71c1c",
    justifyContent: "center",
    alignItems: "center",
  },
  pokedex: {
    width: "92%",
    height: "92%",
    backgroundColor: "#d32f2f",
    borderRadius: 16,
    padding: 12,
    borderWidth: 3,
    borderColor: "#7f0000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  bigCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#bbdefb",
    borderWidth: 3,
    borderColor: "#0d47a1",
    marginRight: 12,
  },
  smallCirclesRow: {
    flexDirection: "row",
    gap: 6,
  },
  smallCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "white",
  },
  screen: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 12,
    borderWidth: 2,
    borderColor: "#9e9e9e",
  },
});
