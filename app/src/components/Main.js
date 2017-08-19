import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ActionButton } from "react-native-material-ui";
import { connect } from "react-redux";
import { startReflow, cancelReflow, getStatus } from "../redux/actions";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});

const mapStateToProps = ({ app: { reflowing } }) => ({ reflowing });

const buttonMap = reflowing =>
  (reflowing
    ? { icon: "stop", style: { container: { backgroundColor: "red" } } }
    : {
        icon: "play-arrow",
        style: { container: { backgroundColor: "green" } }
      });

@connect(mapStateToProps, { startReflow, cancelReflow })
export default class MainPage extends Component {
  state = { reflowing: false };

  startReflow = () => {
    const { startReflow } = this.props;
    startReflow();
  };

  cancelReflow = () => {
    const { cancelReflow } = this.props;
    cancelReflow();
  };

  render() {
    const { reflowing } = this.props;

    const buttonProps = buttonMap(reflowing);
    return (
      <View style={styles.container}>
        <View
          style={{ justifyContent: "center", flex: 4, flexDirection: "row" }}
        >
          <Text>Main</Text>
        </View>
        <ActionButton
          onPress={reflowing ? this.cancelReflow : this.startReflow}
          {...buttonProps}
        />
      </View>
    );
  }
}
