function startUp() {
  var wifi = require("Wifi");
  var Clock = require("clock").Clock;

  var HTTPServer = require("./http_server").HTTPServer;
  var ReflowOven = require("./reflow_oven").reflowOven;
  var WIFI_SSID = "*********";
  var WIFI_PSK = "*********";

  // SPI1 is global, and works inside oven without passing it through
  SPI1.setup({ miso: D12, sck: D14, baud: 1000000 });
  // make sure oven is off?
  digitalWrite(D2, false);

  var oven = new ReflowOven(D4, D2);

  function onWifiConnectCallback(err) {
    if (!err) {
      console.log("Metwork IP: ", wifi.getIP().ip);
      // pass oven through to socket server to control
      HTTPServer(oven);
    } else {
      console.log(err);
    }
  }
  // connect to wifi, and start listening for commands...
  wifi.connect(WIFI_SSID, { password: WIFI_PSK }, onWifiConnectCallback);
}

E.on("init", startUp);
save();
