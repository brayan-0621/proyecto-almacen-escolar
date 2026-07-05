import { Component, ReactNode } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { logger } from "../services/logger";

type Props = { children: ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    logger.error("Error atrapado por ErrorBoundary", error);
  }

  handleReintentar = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.icono}>⚠️</Text>
          <Text style={styles.titulo}>Algo salió mal</Text>
          <Text style={styles.subtitulo}>
            Ocurrió un error inesperado. Puedes intentar continuar.
          </Text>
          <TouchableOpacity
            style={styles.boton}
            onPress={this.handleReintentar}
          >
            <Text style={styles.botonTexto}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#F4F6F8",
  },
  icono: { fontSize: 48, marginBottom: 12 },
  titulo: { fontSize: 18, fontWeight: "700", color: "#333", marginBottom: 6 },
  subtitulo: {
    fontSize: 13,
    color: "#888",
    textAlign: "center",
    marginBottom: 20,
  },
  boton: {
    backgroundColor: "#2e6da4",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  botonTexto: { color: "#fff", fontWeight: "700" },
});
