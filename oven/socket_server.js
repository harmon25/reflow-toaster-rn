exports.socketServer = function(oven) {
  function onPageRequest(req, res) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h1> Connect with MobileApp </h1>");
  }

  function onClose() {
    console.log("Connection closed");
  }

  function buildMessage(type, payload) {
    return JSON.stringify({
      type: type,
      payload: payload
    });
  }

  function onMessageWithSocket(ws) {
    return function onMessage(msg) {
      var jsonMsg = JSON.parse(msg);
      switch (jsonMsg.type) {
        case "START_REFLOW":
          oven.startReflow();
          var response = (response = buildMessage("STARTED_REFLOW", {}));
          ws.send(response);
          break;

        case "CANCEL_REFLOW":
          oven.cancelReflow();
          var response = (response = buildMessage("CANCELED_REFLOW", {}));
          ws.send(response);
          break;

        case "GET_STATUS":
          oven.getStatus();
          var response = (response = buildMessage("STATUS", oven.getStatus()));
          ws.send(response);
          break;

        default:
          var response = (response = buildMessage("ERROR", {
            msg: "UNKNOWN MESSAGE TYPE"
          }));
          ws.send(response);
          console.log("Unknown Message Type");
          console.log("[WS] " + JSON.stringify(msg));
      }
    };
  }

  function onClientConnect(ws) {
    ws.on("close", onClose);
    ws.on("message", onMessageWithSocket(ws));
  }

  var server = require("ws").createServer(onPageRequest);

  server.listen(80);

  server.on("websocket", onClientConnect);
};
