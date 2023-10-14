// NoteDetailScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("notes.db");

export default function NoteDetailScreen({ route, navigation }) {
  const [note, setNote] = useState({ id: 0, title: "" });

  useEffect(() => {
    if (route.params?.note) {
      setNote(route.params.note);
    }
  }, [route.params?.note]);

  const updateNote = () => {
    db.transaction(
      (tx) => {
        tx.executeSql("UPDATE notes SET title = ? WHERE id = ?", [
          note.title,
          note.id,
        ]);
      },
      null,
      () => {
        navigation.goBack();
        // You can also trigger a refresh of the notes list here if needed.
      }
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        value={note.title}
        onChangeText={(newText) => setNote({ ...note, title: newText })}
      />
      <Pressable style={styles.button} onPress={updateNote}>
        <Text style={styles.buttonText}>Update</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    margin: 20,
    borderWidth: 1,
    width: "80%",
    padding: 10,
    borderColor: "#ccc",
  },
  button: {
    padding: 10,
    margin: 5,
    backgroundColor: "orange",
  },
  buttonText: {
    fontWeight: "bold",
    color: "white",
  },
});
