const Client = require("node-ssdp").Client;
const client = new Client();
const fetch = require("node-fetch");
const stringParserXML = require("xml2js").parseString;
const sony = require("./sony");

// Or maybe if you want to scour for everything after 5 seconds
timer = setInterval(async () => {
  await sony.pollConnection();
}, 200);
