import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="dashboard" options={{ title: "Inicio" }} />
      <Tabs.Screen name="productos" options={{ title: "Productos" }} />
      <Tabs.Screen name="movimientos" options={{ title: "Movimientos" }} />
    </Tabs>
  );
}
