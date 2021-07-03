const Client = require("node-ssdp").Client;
const client = new Client();
const fetch = require("node-fetch");
const stringParserXML = require("xml2js").parseString;
const bodies = require("./sonySDK");
const EventEmitter = require("events");
// const eventEmitter = new ee();

let sony = {};

// events ===============================================

sony.events = new EventEmitter();
sony.evt = {
  pollingInterval: 1000,
  interval: null,
};

sony.startPollingEvents = async () => {
  sony.evt.interval = setInterval(async () => {
    try {
      const res = await sony.makeApiCall(bodies.getEvent);
      const events = res.result;
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  }, sony.evt.pollingInterval);
};

//CONNECTION =============================================

sony.connection = {
  timer: null,
  timeoutTimer: null,
  connected: false,
  connecting: false,
  endpoint: "",
  interval: 200,
  timeLimit: 10000,
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
          if (sony.connection.timer) clearInterval(sony.connection.timer);
          if (sony.connection.timeoutTimer)
            clearTimeout(sony.connection.timeoutTimer);
          client.stop();
          sony.connection.connected = true;
          sony.events.emit("sony-connected");
        });
      });
    } catch (err) {
      console.log("Error fetching connection data as json");
      console.log(err);
      sony.connection.connected = false;
      sony.events.emit("sony-disconnected");
    }
  }
});

sony.pollConnection = async () => {
  sony.connecting = true;
  sony.connection.timer = setInterval(function () {
    console.log("Searching for camera connection...");
    client.search("urn:schemas-sony-com:service:ScalarWebAPI:1");
  }, sony.connection.interval);

  sony.connection.timeoutTimer = setTimeout(() => {
    clearTimeout(sony.connection.timer);
    client.stop();
    console.log("Timeout - Connection not found");
    sony.connection.timer = null;
    sony.connection.connecting = false;
    sony.connection.connected = false;
    sony.events.emit("sony-disconnected");
  }, sony.connection.timeLimit);
};

//=============================================================================

sony.makeApiCall = async (body) => {
  const endpoint = sony.connection.endpoint;
  try {
    const res = await fetch(`${endpoint}/camera`, {
      method: "POST",
      body: JSON.stringify(body),
    });
    const jsonres = await res.json();
    return jsonres;
  } catch (err) {
    console.log(err);
  }
};

// Methods for shooting stills
sony.beginShootMode = async () => {
  let ret = { error: null, data: null };
  let calls = await sony.makeApiCall(bodies.getAvailableApiList);
  calls = calls.result[0];
  if (!calls.includes("startRecMode")) {
    ret.error = "startRecMode not available";
    return ret;
  }

  const res = await sony.makeApiCall(bodies.startRecMode);

  console.log(res.result[0]);
  if (res.result[0] === 0) {
    ret.data = "Success";
    return ret;
  }
};

sony.endShootMode = async () => {
  let ret = { error: null, data: null };
  let calls = await sony.makeApiCall(bodies.getAvailableApiList);
  calls = calls.result[0];
  if (!calls.includes("stopRecMode")) {
    ret.error = "stopRecMode not available";
    return ret;
  }

  const res = await sony.makeApiCall(bodies.stopRecMode);
  console.log(res.result[0]);
  if (res.result[0] === 0) {
    ret.data = "Success";
    return ret;
  }
};

sony.getEventProperty = async (prop, events) => {
  const evtProperty = events.find((p) => {
    if (p) return p.type === prop;
  });
  return evtProperty;
};

sony.getCameraStatus = async () => {
  const eventData = await sony.makeApiCall(bodies.getEvent);
  const res = await sony.getEventProperty("cameraStatus", eventData.result);
  if (!res) return "UNKNOWN";
  return res.cameraStatus;
};

sony.takePicture = async () => {
  let ret = { error: null, data: null };
  let res;

  const camStatus = await sony.getCameraStatus();

  // Not sure why this must be called here...
  // may need to delay after startrecmode
  await sony.makeApiCall(bodies.getEvent);

  let calls = await sony.makeApiCall(bodies.getAvailableApiList);
  calls = calls.result[0];

  if (camStatus !== "IDLE") {
    if (!calls.includes("awaitTakePicture")) {
      ret.error = "awaitTakePicture not available";
      return ret;
    }
    res = await sony.makeApiCall(bodies.awaitTakePicture);
  } else {
    if (!calls.includes("actTakePicture")) {
      ret.error = "takePicture not available";
      return ret;
    }

    res = await sony.makeApiCall(bodies.actTakePicture);
  }

  console.log(res.result[0]);
  if (res.result[0] === 0) {
    ret.data = "Success";
    return ret;
  }
};

sony.startLiveView = async () => {
  let ret = { error: null, data: null };
  let res;

  const camStatus = await sony.getCameraStatus();

  // Not sure why this must be called here...
  await sony.makeApiCall(bodies.getEvent);

  let calls = await sony.makeApiCall(bodies.getAvailableApiList);
  calls = calls.result[0];
  console.log(calls);

  if (camStatus !== "IDLE") {
    console.log("Camera not idle");
  } else {
    if (!calls.includes("startLiveview")) {
      ret.error = "startLiveVIew not available";
      return ret;
    }

    res = await sony.makeApiCall(bodies.startLiveview);
  }

  // console.log(res);
  if (res.result[0]) {
    ret.data = res.result;
    return ret;
  }
};

sony.endLiveView = async () => {
  let ret = { error: null, data: null };
  let res;

  const camStatus = await sony.getCameraStatus();

  // Not sure why this must be called here...
  await sony.makeApiCall(bodies.getEvent);

  let calls = await sony.makeApiCall(bodies.getAvailableApiList);
  calls = calls.result[0];
  console.log(calls);

  if (camStatus !== "IDLE") {
    console.log("Camera not idle");
    ret.error = "Camera not idle";
    return ret;
  } else {
    if (!calls.includes("endLiveview")) {
      ret.error = "endLiveVIew not available";
      return ret;
    }

    res = await sony.makeApiCall(bodies.endLiveview);
  }

  // console.log(res);
  if (res.result[0]) {
    ret.data = res.result;
    return ret;
  }
};

module.exports = sony;
