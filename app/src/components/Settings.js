import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TextField } from "react-native-material-textfield";
import { connect } from "react-redux";
import { editSetting, persistSettings } from "../redux/actions";

const mapStateToProps = ({ settings: { ovenIP } }) => ({ ovenIP });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});

@connect(mapStateToProps, { editSetting, persistSettings })
export default class SettingsPage extends Component {
  render() {
    const { ovenIP, editSetting, persistSettings } = this.props;
    return (
      <View style={styles.container}>
        <Text>Settings</Text>
        <View style={{ width: 150 }}>
          <TextField
            value={ovenIP || ""}
            onChangeText={val => {
              editSetting("ovenIP", val);
              persistSettings();
            }}
            label="Oven IP"
          />
        </View>
      </View>
    );
  }
}
