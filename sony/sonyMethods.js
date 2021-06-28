const Client = require("node-ssdp").Client;
const client = new Client();
const fetch = require("node-fetch");
const stringParserXML = require("xml2js").parseString;
// const sony = require("./sonySDK");

let sony = {};

sony.connection = {
  timer: null,
  timeoutTimer: null,
  connected: false,
  connecting: false,
  endpoint: "",
  interval: 200,
  timeLimit: 2000,
};
sony.deviceInfo = {
  raw: null,
  name: "",
  type: "",
  id: "",
};

client.on("response", function inResponse(headers, code, rinfo) {
  if (code === 200) {
    try {
      fetch(headers.LOCATION).then(async (res) => {
        const r = await res.text();

        stringParserXML(r, (err, result) => {
          if (err) {
            console.log(err);
          }
          sony.deviceInfo.raw = result;
          sony.deviceInfo.name =
            sony.deviceInfo.raw.root.device[0].friendlyName[0];
          sony.deviceInfo.type =
            sony.deviceInfo.raw.root.device[0].deviceType[0];
          sony.deviceInfo.id = sony.deviceInfo.raw.root.device[0].UDN[0];
          console.log(sony.deviceInfo);
          sony.connection.endpoint =
            sony.deviceInfo.raw.root.device[0][
              "av:X_ScalarWebAPI_DeviceInfo"
            ][0]["av:X_ScalarWebAPI_ServiceList"][0][
              "av:X_ScalarWebAPI_Service"
            ][0]["av:X_ScalarWebAPI_ActionList_URL"][0];
          sony.connection.connecting = false;
          if (timer) clearInterval(timer);
          client.stop();
          sony.connection.connected = true;
        });
      });
    } catch (err) {
      console.log("Error fetching connection data as json");
      console.log(err);
      sony.connection.connected = false;
    }
  }
});

sony.pollConnection = async () => {
  sony.connecting = true;
  sony.connection.timer = setInterval(function () {
    console.log("Searching for camera connection...");
    client.search("urn:schemas-sony-com:service:ScalarWebAPI:1");
  }, sony.connection.interval);

  sony.connectionTimeoutTimer = setTimeout(() => {
    clearTimeout(sony.connectionTimer);
    console.log("Timeout - Connection not found");
    sony.connection.timer = null;
    sony.connection.connecting = false;
    sony.connection.connected = false;
  }, sony.connection.timeLimit);
};

module.exports = sony;
