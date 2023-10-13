import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList, Pressable } from "react-native";
import { Entypo } from "@expo/vector-icons";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("notes.db");

export default function NotesScreen({ navigation, route }) {
  const [notes, setNotes] = useState([]);

  function refreshNotes() {
    db.transaction((tx) => {
      tx.executeSql(
        "select * from notes",
        null,
        (_, { rows: { _array } }) => setNotes(_array),
        (_, error) => console.log("Error: ", error)
      );
    });
  }

  useEffect(() => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS
            notes
            (id INTEGER PRIMARY KEY AUTOINCREMENT,
              title TEXT,
              done INT);
            `
        );
      },
      null,
      refreshNotes
    );
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={addNote}>
          <Entypo
            name="new-message"
            size={24}
            color="black"
            style={{ marginRight: 20 }}
          />
        </Pressable>
      ),
    });
  });

  useEffect(() => {
    if (route.params?.text) {
      db.transaction(
        (tx) => {
          tx.executeSql("insert into notes (done, title) values (0, ?)", [
            route.params.text,
          ]);
        },
        null,
        refreshNotes
      );
    }
  }, [route.params?.text]);

  function addNote() {
    navigation.navigate("Add Note");
  }

  function deleteNotes(id) {
    db.transaction(
      (tx) => {
        tx.executeSql("DELETE FROM notes WHERE id = ?", [id]);
      },
      null,
      refreshNotes
    );
  }

  function renderItem({ item }) {
    return (
      <View
        style={{
          padding: 10,
          paddingTop: 20,
          paddingBottom: 20,
          borderBottomColor: "#ccc",
          borderBottomWidth: 1,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ textAlign: "left", fontSize: 16 }}>{item.title}</Text>
        <Pressable onPress={() => deleteNotes(item.id)}>
          <Entypo name="trash" size={24} color="blue" />
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        style={{ width: "100%" }}
        data={notes}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffc",
    alignItems: "center",
    justifyContent: "center",
  },
});
