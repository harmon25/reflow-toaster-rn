import React, { Component } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { ActionButton } from "react-native-material-ui";
import { connect } from "react-redux";
import { startReflow, cancelReflow, getStatus } from "../redux/actions";

var { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#fff"
  },
  container2: {
    flex: 1,
    width: width,
    alignItems: "center",
    justifyContent: "center"
  }
});

const mapStateToProps = ({
  app: { reflowing, connected, currentTemp, currentState }
}) => ({
  reflowing,
  connected,
  currentTemp
});

const buttonMap = reflowing =>
  reflowing
    ? { icon: "stop", style: { container: { backgroundColor: "red" } } }
    : {
        icon: "play-arrow",
        style: { container: { backgroundColor: "green" } }
      };

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
    const { reflowing, connected, currentTemp, currentState } = this.props;

    const buttonProps = buttonMap(reflowing);
    return (
      <View style={styles.container}>
        <View>
          <Text>
            {connected ? "Connected!" : "Not Connected!"}
          </Text>
        </View>

        <View style={styles.container2}>
          <Text>
            Temp Gauge! {currentTemp}
          </Text>
        </View>

        <View
          style={{
            width: width - width * 0.5,
            height: 50,
            backgroundColor: "powderblue"
          }}
        >
          <Text>
            {currentState}
          </Text>
        </View>
        <ActionButton
          onPress={reflowing ? this.cancelReflow : this.startReflow}
          {...buttonProps}
        />
      </View>
    );
  }
}
