import { StyleSheet, TextInput, TextInputProps } from "react-native";

type Props = TextInputProps & {
  placeholder: string;
};

export default function FormInput({ placeholder, ...rest }: Props) {
  return (
    <TextInput
      placeholder={placeholder}
      style={styles.input}
      placeholderTextColor="#999"
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
});
