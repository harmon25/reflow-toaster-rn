import { combineReducers, applyMiddleware, compose } from "redux";
import {
  NAVIGATE,
  EDIT_SETTING,
  NEW_ALERT,
  CLEAR_ALERT,
  LOADED_SETTINGS,
  OVEN_CONNECTED,
  OVEN_DISCONNECTED,
  SOCKET_ERROR,
  STARTED_REFLOW,
  STATUS,
  CANCELED_REFLOW
} from "../constants";

/**
 * 
 */
const initialAlert = { message: null, type: null };
const initialState = {
  activePage: "main",
  alert: initialAlert,
  connected: false,
  ovenSocket: null,
  socketError: null,
  currentTemp: null,
  currentState: null,
  reflowing: false
};

function appReducer(state = initialState, action) {
  switch (action.type) {
    case NAVIGATE:
      return { ...state, activePage: action.payload.page };

    case NEW_ALERT:
      return { ...state, alert: action.payload };

    case CLEAR_ALERT:
      return { ...state, alert: initialAlert };

    case OVEN_CONNECTED:
      return { ...state, connected: true, ovenSocket: action.payload.socket };

    case OVEN_DISCONNECTED:
      return { ...state, connected: false, ovenSocket: null };

    case SOCKET_ERROR:
      return { ...state, socketError: action.payload.error };

    case STARTED_REFLOW:
      return { ...state, reflowing: true };

    case CANCELED_REFLOW:
      return { ...state, reflowing: false };

    case STATUS:
      return {
        ...state,
        currentState: action.payload.state,
        currentTemp: action.payload.temp
      };

    default:
      return state;
  }
}

const initialSettings = { ovenIP: null, loaded: false };

function settingsReducer(state = initialSettings, action) {
  switch (action.type) {
    case EDIT_SETTING:
      const { payload } = action;
      return { ...state, [payload.setting]: payload.value };

    case LOADED_SETTINGS:
      return { ...state, loaded: true };

    default:
      return state;
  }
}

export default combineReducers({ app: appReducer, settings: settingsReducer });
