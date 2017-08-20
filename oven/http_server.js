exports.HTTPServer = function(oven) {
  function buildMessage(type, payload) {
    return JSON.stringify({
      type: type,
      payload: payload
    });
  }

  const actions = {
    "/hello": { type: "HELLO" },
    "/status": { type: "STATUS" },
    "/start": { type: "STARTED_REFLOW" },
    "/cancel": { type: "CANCELED_REFLOW" },
    "404": { type: "UNKNOWN_ACTION" }
  };

  function sendResp(resp, body, code) {
    resp.writeHead(code || 200, { "Content-Type": "text/json" });
    resp.end(body);
  }

  function onPageRequest(req, res) {
    var http_req = url.parse(req.url, true);
    var respBody = "";
    var respCode = 200;

    switch (http_req.path) {
      case "/hello":
        console.log(actions[http_req.path].type);
        respBody = buildMessage(actions[http_req.path].type, oven.getStatus());
        break;

      case "/status":
        console.log(actions[http_req.path].type);
        respBody = buildMessage(actions[http_req.path].type, oven.getStatus());
        break;

      case "/start":
        console.log(actions[http_req.path].type);
        oven.startReflow();
        respBody = buildMessage(actions[http_req.path].type, oven.getStatus());
        break;

      case "/cancel":
        console.log(actions[http_req.path].type);
        oven.cancelReflow();
        respBody = buildMessage(actions[http_req.path].type, oven.getStatus());
        break;

      default:
        console.log(actions["404"].type);
        respBody = buildMessage(actions["404"].type, {});
        respCode = 404;
    }
    sendResp(res, respBody, respCode);
  }

  var http = require("http");
  http.createServer(onPageRequest).listen(80);
};
