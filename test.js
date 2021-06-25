const Client = require("node-ssdp").Client;
const client = new Client();
const fetch = require("node-fetch");
const stringParserXML = require("xml2js").parseString;
const sony = require("./sony");

// let endpoint = '';

// console.log(ts);
// let timer;
// client.on("notify", function (test) {
//   console.log(test);
//   //console.log('Got a notification.')
// });

// client.on("response", function inResponse(headers, code, rinfo) {
//   if(code === 200) {
//     console.log(`Location: ${headers.LOCATION}`)
//     fetch(headers.LOCATION).then(async res => {
//       const r = await res.text();
//       // const xml = await (new DOMParser()).parseFromString(r, 'text/xml');
//       let xmljson;
//       stringParserXML(r, (err, result) => {
//         xmljson = result;
//         endpoint = xmljson.root.device[0]['av:X_ScalarWebAPI_DeviceInfo'][0]['av:X_ScalarWebAPI_ServiceList'][0]['av:X_ScalarWebAPI_Service'][0]['av:X_ScalarWebAPI_ActionList_URL'][0];
//         console.log(xmljson.root.device[0]['av:X_ScalarWebAPI_DeviceInfo'][0]['av:X_ScalarWebAPI_ServiceList'][0]['av:X_ScalarWebAPI_Service'][0]['av:X_ScalarWebAPI_ActionList_URL'][0]);
//         main();
//       });
//       // console.log(xml);
//     })
//   }
//   if (timer) clearInterval(timer);
//   client.stop();
// });

// Or maybe if you want to scour for everything after 5 seconds
timer = setInterval(async () => {
  await sony.pollConnection();
  //   client.search("ssdp:all");
  // await client.search("urn:schemas-sony-com:service:ScalarWebAPI:1");
}, 200);

// const main = async () => {
// need to check getEvent on these and call at appropriate time
// console.log(await sony.makeApiCall(endpoint, sony.getAvailableApiList));
// console.log(await sony.makeApiCall(endpoint, sony.getVersions));
// console.log(await sony.makeApiCall(endpoint, sony.getMethodTypes));
// console.log(await sony.makeApiCall(endpoint, sony.startRecMode));
// // console.log(await sony.makeApiCall(endpoint, sony.getEvent));
// console.log(await sony.makeApiCall(endpoint, sony.setShootModeStill));
// // console.log(await sony.makeApiCall(endpoint, sony.getEvent));
// console.log(await sony.makeApiCall(endpoint, sony.actTakePicture));
// // console.log(await sony.makeApiCall(endpoint, sony.getEvent));
// console.log(await sony.makeApiCall(endpoint, sony.stopRecMode));
// // console.log(await sony.makeApiCall(endpoint, sony.getEvent));
// };
