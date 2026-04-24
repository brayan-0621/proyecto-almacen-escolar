import { Href, useRouter } from "expo-router";
import { useState } from "react";
import { ImageBackground, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "../styles/fab.styles";
import FabButton from "./FabButton";
import MenuItem from "./MenuItem";

export default function FAB() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const goTo = (route: Href) => {
    setOpen(false);
    router.push(route);
  };

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
                <MenuItem text="Compras" onPress={() => goTo("/compra")} />
                <MenuItem text="Ventas" onPress={() => goTo("/venta")} />
                <MenuItem text="Cliente" onPress={() => goTo("/clientes")} />
                <MenuItem
                  text="Proveedores"
                  onPress={() => goTo("/proveedores")}
                />
              </View>
            </View>
          </ImageBackground>
        </Pressable>
      )}

      <View style={[styles.fabContainer, { bottom: insets.bottom + 55 }]}>
        <FabButton open={open} onPress={() => setOpen(!open)} />
      </View>
    </>
  );
}
