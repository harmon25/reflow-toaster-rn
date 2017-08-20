import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { connect } from "react-redux";
import { BottomNavigation, ActionButton } from "react-native-material-ui";
import { navigateTo, loadSettings } from "./src/redux/actions";
import { Provider } from "react-redux";
import { compose, applyMiddleware, createStore } from "redux";
import { COLOR, ThemeProvider, Toolbar } from "react-native-material-ui";
import { AppLoading, Font, Constants } from "expo";
import createSagaMiddleware from "redux-saga";
import { AsyncStorage } from "react-native";

import MainPage from "./src/components/Main";
import SettingsPage from "./src/components/Settings";
import HistoryPage from "./src/components/History";
import SocketContainer from "./src/SocketContainer";
import appReducer from "./src/redux/reducers";
import rootSaga from "./src/redux/sagas";
import {
  editSetting,
  ovenConnected,
  ovenDisconnected,
  socketError
} from "./src/redux/actions";
const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  appReducer,
  undefined,
  applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(rootSaga);

//store.dispatch(loadSettings());
/*
const routes = {
  main: {
    RouteComponent: MainPage,
    navLabel: "Main",
    navIcon: "home",
    name: "main",
    index: 0
  },
  settings: {
    RouteComponent: SettingsPage,
    navLabel: "Settings",
    navIcon: "settings",
    name: "settings",
    index: 2
  },
  history: {
    RouteComponent: HistoryPage,
    navLabel: "History",
    navIcon: "history",
    name: "history",
    index: 1
  }
};
*/
const routes = {
  main: {
    RouteComponent: MainPage,
    navLabel: "Main",
    navIcon: "home",
    name: "main",
    index: 0
  },
  settings: {
    RouteComponent: SettingsPage,
    navLabel: "Settings",
    navIcon: "settings",
    name: "settings",
    index: 1
  }
};

const navActions = navigateTo =>
  Object.keys(routes)
    .map(r => ({ ...routes[r] }))
    .sort((a, b) => {
      return a.index - b.index;
    })
    .map(r =>
      <BottomNavigation.Action
        style={{ container: { flex: 1 } }}
        key={r.name}
        icon={r.navIcon}
        label={r.navLabel}
        onPress={() => navigateTo(r.name)}
      />
    );

const mapStateToProps = ({ app: { activePage } }) => ({ activePage });

@connect(mapStateToProps, { navigateTo })
class App extends React.Component {
  render() {
    const { activePage, navigateTo } = this.props;
    const navItems = navActions(navigateTo);
    const { RouteComponent } = routes[activePage];

    return (
      <ThemeProvider>
        <View style={styles.container}>
          <Toolbar leftElement="whatshot" centerElement="Reflow Controller" />
          <RouteComponent />

          <BottomNavigation
            style={{
              container: {
                alignItems: "center"
              }
            }}
            active={activePage}
            hidden={false}
          >
            {navItems}
          </BottomNavigation>
        </View>
      </ThemeProvider>
    );
  }
}

function connectSocket(oven_ip, dispatch) {
  var ws = new WebSocket(`ws://${oven_ip}/my_websocket`);
  ws.onopen = () => {
    dispatch(ovenConnected(ws));
  };

  ws.onmessage = e => {
    const action = JSON.parse(e.data);
    dispatch(action);
  };

  ws.onerror = e => {
    dispatch(socketError(e.message));
    //console.log(e.message);
  };

  ws.onclose = e => {
    dispatch(ovenDisconnected());
    //console.log(e.code, e.reason);
  };
}

export default class AppRoot extends React.Component {
  state = { loaded: false };
  async componentDidMount() {
    await Font.loadAsync({
      Roboto: require("./assets/fonts/roboto/Roboto-Regular.ttf"),
      MaterialIcons: require("./node_modules/react-native-vector-icons/Fonts/MaterialIcons.ttf")
    });
    const ovenIP = await AsyncStorage.getItem("@Settings:ovenIP");
    store.dispatch(editSetting("ovenIP", ovenIP));

    this.setState({ loaded: true });
  }

  render() {
    const { loaded } = this.state;

    return (
      <Provider store={store}>
        {loaded ? <App /> : <AppLoading />}
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Constants.statusBarHeight
  }
});
