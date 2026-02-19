import { usePathname, useRouter } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function PokedexLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // Si estamos en la raíz (el menú), no mostramos el botón volver
  const esMenuPrincipal = pathname === "/" || pathname === "/(tabs)";

  return (
    <SafeAreaView style={styles.contenedorRojo}>
      <View style={styles.marco}>
        <View style={styles.pantalla}>
          {!esMenuPrincipal && (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.btnVolver}
            >
              <Text style={styles.txtVolver}>{"< VOLVER"}</Text>
            </TouchableOpacity>
          )}

          {children}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedorRojo: { flex: 1, backgroundColor: "#D32F2F" },
  marco: { flex: 1, padding: 12, borderWidth: 8, borderColor: "#b71c1c" },
  pantalla: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 15,
    padding: 10,
    borderWidth: 3,
    borderColor: "#333",
  },
  btnVolver: {
    backgroundColor: "#333",
    padding: 6,
    borderRadius: 5,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  txtVolver: { color: "white", fontWeight: "bold", fontSize: 11 },
});
