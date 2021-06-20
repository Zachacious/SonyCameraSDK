const Client = require("node-ssdp").Client;
const client = new Client();
const fetch = require("node-fetch");

// client.on("response", function (headers, statusCode, rinfo) {
//   console.log("Got a response to an m-search.");
// });

// search for a service type
// const t = client
//   .search("urn:schemas-sony-com:service:ScalarWebAPI:1")
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// Or get a list of all services on the network
// const ts = client.search("ssdp:all").then((res) => {
//   console.log("list all ssdp");
//   console.log(res);
// });

// console.log(ts);
let timer;
client.on("notify", function () {
  //console.log('Got a notification.')
});

client.on("response", function inResponse(headers, code, rinfo) {
  console.log(
    "Got a response to an m-search:\n%d\n%s\n%s",
    code,
    JSON.stringify(headers, null, "  "),
    JSON.stringify(rinfo, null, "  ")
  );
  if (timer) clearInterval(timer);
  client.stop();
});

// Or maybe if you want to scour for everything after 5 seconds
timer = setInterval(function () {
  //   client.search("ssdp:all");
  client.search("urn:schemas-sony-com:service:ScalarWebAPI:1");
}, 5000);

// And after 10 seconds, you want to stop
// setTimeout(function () {
//   client.stop();
// }, 10000);

const main = async () => {
  try {
    const res = await fetch("http://192.168.122.1:8080/sony/camera", {
      method: "POST",
      body: JSON.stringify({
        method: "stopRecMode",
        params: [],
        id: 1,
        version: "1.0",
      }),
    });
    const jsonres = await res.json();
    console.log(jsonres);
  } catch (err) {
    console.log(err);
  }
};

// main();
