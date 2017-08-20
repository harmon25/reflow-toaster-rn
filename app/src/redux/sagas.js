import { AsyncStorage } from "react-native";
import { select, take, call, put, spawn, takeEvery } from "redux-saga/effects";
import { delay } from "redux-saga";
import { LOAD_SETTINGS, PERSIST_SETTINGS } from "./constants";
import { editSetting, settingsLoaded, getStatus } from "./actions";
import axios from "axios";

const getBaseURI = ({ settings: { ovenIP } }) => "http://" + ovenIP;

export function* ovenSaga() {
  while (true) {
    try {
      const command = yield take([
        "GET_STATUS",
        "CANCEL_REFLOW",
        "START_REFLOW"
      ]);
      const baseURI = yield select(getBaseURI);
      console.log("sending: ", command);
      const { data } = yield call(axios.get, baseURI + command.payload.path);
      console.log("response: ", data);
      yield put(data);
    } catch (e) {
      console.log(e);
    }
  }
}

const getOvenIP = ({ settings: { ovenIP } }) => ovenIP;

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
  const ovenIP = yield select(getOvenIP);
  console.log("Persisting:");
  console.log(ovenIP);
  yield call(AsyncStorage.setItem, "@Settings:ovenIP", ovenIP);
}

export function* pollState() {
  while (true) {
    yield delay(2500);
    yield put(getStatus());
  }
}

export default function* rootSaga() {
  yield spawn(pollState);
  yield spawn(ovenSaga);
  yield takeEvery(LOAD_SETTINGS, loadSettings);
  yield takeEvery(PERSIST_SETTINGS, persistenceSettings);
}
