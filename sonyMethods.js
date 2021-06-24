const Client = require("node-ssdp").Client;
const client = new Client();
const fetch = require("node-fetch");
const stringParserXML = require("xml2js").parseString;
const sony = require("./sonySDK");

sony.connection = {
  timer: null,
  timeoutTimer: null,
  connected: false,
  connecting: false,
  endpoint: "",
  interval: 200,
  timeLimit: 5000,
};
sony.deviceInfo = {
  raw: null,
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
          sony.connection.endpoint =
            xmljson.root.device[0]["av:X_ScalarWebAPI_DeviceInfo"][0][
              "av:X_ScalarWebAPI_ServiceList"
            ][0]["av:X_ScalarWebAPI_Service"][0][
              "av:X_ScalarWebAPI_ActionList_URL"
            ][0];
          console.log(
            xmljson.root.device[0]["av:X_ScalarWebAPI_DeviceInfo"][0][
              "av:X_ScalarWebAPI_ServiceList"
            ][0]["av:X_ScalarWebAPI_Service"][0][
              "av:X_ScalarWebAPI_ActionList_URL"
            ][0]
          );
          sony.connection.connecting = false;
          if (timer) clearInterval(timer);
          client.stop();
        });
      });
    } catch (err) {
      console.log("Error fetching connection data as json");
      console.log(err);
    }
  }
});

sony.pollConnection = async () => {
  sony.connecting = true;
  sony.connection.timer = setInterval(function () {
    client.search("urn:schemas-sony-com:service:ScalarWebAPI:1");
  }, sony.connection.interval);

  sony.connectionTimeoutTimer = setTimeout(() => {
    clearTimeout(sony.connectionTimer);
    sony.connectionTimer = null;
    sony.connection.connecting = false;
  }, sony.connection.timeLimit);
};
