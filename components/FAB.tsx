import { Href, useRouter } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function FAB() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const goTo = (route: Href) => {
    setOpen(false);
    router.push(route);
  };

  const { width } = Dimensions.get("window");
  const size = width * 0.16;

  return (
    <>
      {open && (
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <ImageBackground
            source={require("../assets/bg-menu.jpg")}
            style={styles.background}
            resizeMode="cover"
          >
            <View style={styles.darkLayer}>
              <View style={styles.menu}>
                <Text style={styles.section}>Navegación</Text>
                <MenuItem
                  text="Inicio"
                  onPress={() => goTo("/(tabs)/dashboard")}
                />
                <MenuItem
                  text="Productos"
                  onPress={() => goTo("/(tabs)/productos")}
                />
                <MenuItem
                  text="Movimientos"
                  onPress={() => goTo("/(tabs)/movimientos")}
                />

                <Text style={styles.section}>Acciones</Text>
                <MenuItem
                  text="Registrar Entrada"
                  onPress={() => goTo("/registrar-entrada")}
                />
                <MenuItem
                  text="Registrar Salida"
                  onPress={() => goTo("/registrar-salida")}
                />
                <MenuItem
                  text="Nuevo Cliente"
                  onPress={() => goTo("/form-cliente")}
                />
                <MenuItem
                  text="Nuevo Proveedor"
                  onPress={() => goTo("/form-proveedor")}
                />
              </View>
            </View>
          </ImageBackground>
        </Pressable>
      )}

      <View style={[styles.fabContainer, { bottom: insets.bottom + 55 }]}>
        <TouchableOpacity
          style={[
            styles.fab,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}
          onPress={() => setOpen(!open)}
        >
          <Text style={styles.icon}>{open ? "–" : "+"}</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

function MenuItem({ text, onPress }: any) {
  return (
    <TouchableOpacity style={styles.option} onPress={onPress}>
      <Text style={styles.optionText}>{text}</Text>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 10,
  },

  background: {
    width: "100%",
    height: "100%",
  },

  darkLayer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 80,
  },

  menu: {
    width: "88%",
  },

  section: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 10,
    marginTop: 15,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  option: {
    backgroundColor: "#ffffff",
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderRadius: 16,
    marginBottom: 14,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    borderLeftWidth: 6,
    borderLeftColor: "#B5C99A",

    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },

  optionText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#333",
  },

  arrow: {
    color: "#B5C99A",
    fontSize: 20,
    fontWeight: "bold",
  },

  fabContainer: {
    position: "absolute",
    right: 20,
    zIndex: 20,
  },

  fab: {
    backgroundColor: "#f4a261",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },

  icon: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
  },
});
