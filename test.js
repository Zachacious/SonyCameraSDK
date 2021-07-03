const Client = require("node-ssdp").Client;
const client = new Client();
const fetch = require("node-fetch");
const stringParserXML = require("xml2js").parseString;
const sony = require("./sony");
const ee = require("events");
const eventEmitter = new ee();

sony.pollConnection();

const sleep = async (timeMS) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      return resolve();
    }, timeMS);
  });
};

sony.events.on("sony-connected", async () => {
  // console.log(await sony.endLiveView());
  // sleep(1000);
  // console.log(await sony.endShootMode());
  // sleep(1000);

  // console.log("connected");
  // console.log(await sony.beginShootMode());
  // // sleep(2000);
  // console.log(await sony.startLiveView());
  // // console.log(await sony.takePicture());
  // sleep(1000);
  // console.log(await sony.endLiveView());
  // sleep(1000);
  // console.log(await sony.endShootMode());
  console.log(await sony.startPollingEvents());
});

sony.events.off("sony-disconnected", async () => {
  console.log("Camera disconnected");
});
