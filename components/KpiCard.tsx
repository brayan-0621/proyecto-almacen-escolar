import { Text, View } from "react-native";
import { cardWidth, styles } from "../styles/dashboard.styles";

type Props = {
  label: string;
  value: string;
  icon: string;
  color: string;
};

export default function KpiCard({ label, value, icon, color }: Props) {
  return (
    <View
      style={[styles.kpiCard, { borderLeftColor: color, width: cardWidth }]}
    >
      <Text style={styles.kpiIcon}>{icon}</Text>
      <Text style={styles.kpiValue}>{value}</Text>
      <Text style={styles.kpiLabel}>{label}</Text>
    </View>
  );
}
