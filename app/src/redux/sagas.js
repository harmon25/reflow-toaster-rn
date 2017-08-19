import { AsyncStorage } from "react-native";
import { select, take, call, put, spawn, takeEvery } from "redux-saga/effects";
import { LOAD_SETTINGS, PERSIST_SETTINGS } from "./constants";
import { editSetting, settingsLoaded } from "./actions";

const getSocket = ({ app: { ovenSocket } }) => ovenSocket;

export function* socketSaga() {
  while (true) {
    const command = yield take(["GET_STATUS", "CANCEL_REFLOW", "START_REFLOW"]);
    const socket = yield select(getSocket);
    if (socket) {
      console.log("sending: ", command);
      socket.send(JSON.stringify(command));

      const response = yield take([
        "STATUS",
        "CANCELED_REFLOW",
        "STARTED_REFLOW"
      ]);
      console.log("response: ", response);
    }
  }
}

const getOpenIP = ({ settings: { ovenIP } }) => ovenIP;

export function* loadSettings(action) {
  const ovenIP = yield call(AsyncStorage.getItem, "@Settings:ovenIP");
  if (ovenIP) {
    console.log("Loaded:");
    console.log(ovenIP);
    yield put(editSetting("ovenIP", ovenIP));
  }
  yield put(settingsLoaded());
}

export function* persistenceSettings(action) {
  const ovenIP = yield select(getOpenIP);
  console.log("Persisting:");
  console.log(ovenIP);
  yield call(AsyncStorage.setItem, "@Settings:ovenIP", ovenIP);
}

export default function* rootSaga() {
  yield spawn(socketSaga);
  yield takeEvery(LOAD_SETTINGS, loadSettings);
  yield takeEvery(PERSIST_SETTINGS, persistenceSettings);
}
