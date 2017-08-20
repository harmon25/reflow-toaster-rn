import React, { Component } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { ActionButton, Card, Subheader } from "react-native-material-ui";
import { connect } from "react-redux";
import { startReflow, cancelReflow, getStatus } from "../redux/actions";
import {
  AnimatedGaugeProgress,
  GaugeProgress
} from "react-native-simple-gauge";

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
  currentTemp,
  currentState
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
    const { reflowing, connected, currentTemp = 20, currentState } = this.props;
    const fill = Math.round(currentTemp) / 250 * 100;
    const buttonProps = buttonMap(reflowing);
    return (
      <View style={styles.container}>
        <Subheader text={currentState || "Waiting..."} />
        <View style={styles.container2}>
          <AnimatedGaugeProgress
            size={250}
            width={20}
            fill={fill}
            rotation={90}
            cropDegree={90}
            tintColor="#4682b4"
            backgroundColor="#b0c4de"
            strokeCap="circle"
          />
          <Text>
            {currentTemp ? Math.round(currentTemp) + "°C" : "Waiting..."}
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
