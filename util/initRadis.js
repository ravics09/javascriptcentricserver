const redis = require("redis");

const client = redis.createClient();

client.connect();

// client.on("connect", function () {
//   console.log("Connected!");
// });

// client.on("ready", function () {
//     console.log(" Client connected to redis and ready to use");
//   });

// client.on("error", (error) => {
//   console.log("Error while connect to redis",error.message);
//   client.quit();
// });

// client.on("end", (error) => {
//     console.log("Client disconnected from redis");
//   });

process.on("SIGINT",()=>{
    client.quit();
})

module.exports = client ;
