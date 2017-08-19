import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});

export default class HistoryPage extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>History</Text>
      </View>
    );
  }
}
