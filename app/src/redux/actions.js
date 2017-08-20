import {
  NAVIGATE,
  NEW_ALERT,
  CLEAR_ALERT,
  EDIT_SETTING,
  PERSIST_SETTINGS,
  LOAD_SETTINGS,
  LOADED_SETTINGS,
  OVEN_CONNECTED,
  OVEN_DISCONNECTED,
  START_REFLOW,
  CANCEL_REFLOW,
  GET_STATUS
} from "./constants";

export const startReflow = () => ({
  type: START_REFLOW,
  payload: { path: "/start" }
});
export const cancelReflow = () => ({
  type: CANCEL_REFLOW,
  payload: { path: "/cancel" }
});
export const getStatus = () => ({
  type: GET_STATUS,
  payload: { path: "/status" }
});

export const ovenConnected = () => ({
  type: OVEN_CONNECTED,
  payload: {}
});
export const ovenDisconnected = () => ({ type: OVEN_DISCONNECTED });

export const navigateTo = page => ({ type: NAVIGATE, payload: { page } });
export const settingsLoaded = () => ({ type: LOADED_SETTINGS });
export const loadSettings = () => ({ type: LOAD_SETTINGS, payload: {} });
export const persistSettings = () => ({ type: PERSIST_SETTINGS, payload: {} });

export const makeAlert = (message, type = "warning") => ({
  type: NEW_ALERT,
  payload: { message, type }
});

export const editSetting = (key, value) => ({
  type: EDIT_SETTING,
  payload: { setting: key, value }
});

export const clearAlert = () => ({
  type: clearAlert,
  payload: {}
});
