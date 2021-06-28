const Client = require("node-ssdp").Client;
const client = new Client();
const fetch = require("node-fetch");
const stringParserXML = require("xml2js").parseString;
const sony = require("./sony");

sony.pollConnection();

// check for connection
timer = setInterval(async () => {
  await sony.pollConnection();
  if (sony.connection.connected) {
    await sony.beginShootMode();
  }
}, sony.connection.timeLimit);
