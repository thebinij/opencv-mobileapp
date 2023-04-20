import { StyleSheet, Text, Pressable } from "react-native";

export default function Button({ onPress, children }) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#5793EC",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  text: {
    textAlign: "center",
    color: "white",
  },
});
