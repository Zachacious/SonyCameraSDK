const Client = require("node-ssdp").Client;
const client = new Client();
const fetch = require("node-fetch");
const stringParserXML = require('xml2js').parseString;
const sony = require('./sonySDK');
console.log('sony--');
// const stringParserXML = new xml2js.Parser();

// poll for data
// once found get data saved - endpoint
// setup listeners

let endpoint = '';

// console.log(ts);
let timer;
client.on("notify", function (test) {
  console.log(test);
  //console.log('Got a notification.')
});

client.on("response", function inResponse(headers, code, rinfo) {
  // console.log(
  //   "Got a response to an m-search:\n%d\n%s\n%s",
  //   code,
  //   JSON.stringify(headers, null, "  "),
  //   JSON.stringify(rinfo, null, "  ")
  // );
  if(code === 200) {
    console.log(`Location: ${headers.LOCATION}`)
    fetch(headers.LOCATION).then(async res => {
      const r = await res.text();
      // const xml = await (new DOMParser()).parseFromString(r, 'text/xml');
      let xmljson;
      stringParserXML(r, (err, result) => {
        xmljson = result;
        endpoint = xmljson.root.device[0]['av:X_ScalarWebAPI_DeviceInfo'][0]['av:X_ScalarWebAPI_ServiceList'][0]['av:X_ScalarWebAPI_Service'][0]['av:X_ScalarWebAPI_ActionList_URL'][0];
        console.log(xmljson.root.device[0]['av:X_ScalarWebAPI_DeviceInfo'][0]['av:X_ScalarWebAPI_ServiceList'][0]['av:X_ScalarWebAPI_Service'][0]['av:X_ScalarWebAPI_ActionList_URL'][0]);
        main();
      });
      // console.log(xml);
    })
  }
  if (timer) clearInterval(timer);
  client.stop();
});

// Or maybe if you want to scour for everything after 5 seconds
timer = setInterval(function () {
  //   client.search("ssdp:all");
  client.search("urn:schemas-sony-com:service:ScalarWebAPI:1");
}, 200);

// And after 10 seconds, you want to stop
// setTimeout(function () {
//   client.stop();
// }, 10000);

const main = async () => {
  // need to check getEvent on these and call at appropriate time
  await sony.makeApiCall(endpoint, sony.startRecMode);
  await sony.makeApiCall(endpoint, sony.setShootModeStill);
  await sony.makeApiCall(endpoint, sony.actTakePicture);
   await sony.makeApiCall(endpoint, sony.stopRecMode);
  // try {
  //   const res = await fetch("http://192.168.122.1:8080/sony/camera", {
  //     method: "POST",
  //     body: JSON.stringify({
  //       method: "stopRecMode",
  //       params: [],
  //       id: 1,
  //       version: "1.0",
  //     }),
  //   });
  //   const jsonres = await res.json();
  //   console.log(jsonres);
  // } catch (err) {
  //   console.log(err);
  // }
};

// main();
