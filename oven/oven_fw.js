var wifi = require("Wifi");


var toasterState = {on: false, reflowStage: -1, tempInterval: null};

function connectThermocouple(){
  SPI1.setup({ miso:D12, sck:D14, baud:1000000 });
  var max=require("MAX31855").connect(SPI1,D4);
  return max;
 }

var thermocouple = connectThermocouple();

console.log(thermocouple.getTemp());


function onPageRequest(req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end("<h1> Connect with MobileApp </h1>");
}




function connectCallback(err){
   if(!err){
     console.log("connected? info=",wifi.getIP());
     wifi.save();
     if(!toasterState.on) {console.log("toaster is off!");}
     var server = require('ws').createServer(onPageRequest);
      server.listen(80);
      server.on("websocket", function(ws) {
        ws.on('close', function() {
          console.log("Connection closed");
        });

        ws.on('handshake', function() {
          console.log("Handshake Success");
        });

        /*
        ws.on('ping', function() {
          console.log("Got a ping");
        });

        ws.on('pong', function() {
          console.log("Got a pong");
        });
         */
         ws.on('message', function(msg) { 
           switch(msg.type){
             case "START_REFLOW":
               toasterState = {on: true, reflowStage: 0};
               break;
             default:
               console.log("Unknown Message Type");
               console.log("[WS] "+JSON.stringify(msg));
            }
         });
         //ws.send("Hello from Espruino!");
     });
   } else {
      console.log(err);
    }
}



// connect to wifi, and start listening for commands...
wifi.connect("*********", {password:"*********"}, connectCallback);

/*
setInterval(function(){
  if(toasterState.on){
    console.log("Toaster is on!");
  } else {
    console.log("Toaster is off!");
  }
}, 5000);
*/