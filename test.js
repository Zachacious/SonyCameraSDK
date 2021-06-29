const Client = require("node-ssdp").Client;
const client = new Client();
const fetch = require("node-fetch");
const stringParserXML = require("xml2js").parseString;
const sony = require("./sony");
const ee = require("events");
const eventEmitter = new ee();

sony.pollConnection();

sony.events.on("sony-connected", async () => {
  console.log("connected");
  console.log(await sony.beginShootMode());
  console.log(await sony.takePicture());
  console.log(await sony.endShootMode());
});

// check for connection
// const timer = setInterval(async () => {
//   await sony.pollConnection();
//   if (sony.connection.connected) {
//     console.log(await sony.beginShootMode());
//     console.log(await sony.takePicture());
//     console.log(await sony.endShootMode());
//     clearInterval(timer);
//   }
// }, sony.connection.timeLimit);
