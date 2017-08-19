import React, { Component } from "react";
import { connect } from "react-redux";
import { makeAlert, navigateTo } from "./redux/actions";
import { Alert } from "react-native";
import { AppLoading } from "expo";

function connectSocket(oven_ip, dispatch) {
  var ws = new WebSocket(`ws://${oven_ip}/my_websocket`);
  ws.onopen = () => {
    // connection opened
    ws.send("something"); // send a message
  };

  ws.onmessage = e => {
    // a message was received
    dispatch(e.data);
    console.log(e.data);
  };

  ws.onerror = e => {
    // an error occurred
    console.log(e.message);
  };

  ws.onclose = e => {
    // connection closed
    console.log(e.code, e.reason);
  };

  //return ws;
}

const mapStateToProps = ({ settings: { loaded, ovenIP } }) => ({
  ovenIP,
  loaded
});
