const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const dotenv = require("dotenv");
const {
  createTable,
  insertNewData,
  sendDataToClient,
  getAllData,
  searchByName,
  deleteDataSensor,
  updateNameById,
  getLastData,
} = require("./db");
const path = require("path");
const { HTML_TEMPLATE } = require("./mail/mail-template");
const { sendMail } = require("./mail/mailer");

// set up environment
dotenv.config();

app.use(express.json());

app.use(express.static("client"));

app.get("/dashboard", (req, res) => {
  res.sendFile("./client/views/dashboard.html", { root: __dirname });
});

app.get("/statistics", (req, res) => {
  res.sendFile("./client/views/statistics.html", { root: __dirname });
});

io.on("connection", (socket) => {
  console.log("New Ws connection");
});

// Get all data sensors
app.get("/get-all-data", (req, res) => {
  const result = getAllData();

  result
    .then((data) => res.json({ data: data }))
    .catch((err) => console.log(err));
});

// Search data by name
app.get("/search/:name", (req, res) => {
  const { name } = req.params;

  const result = searchByName(name);

  result
    .then((data) => res.json({ data: data }))
    .catch((err) => console.log(err));
});

// Delete data by id
app.delete("/delete/:id", (req, res) => {
  const { id } = req.params;

  const result = deleteDataSensor(id);

  result
    .then((data) => res.json({ success: data }))
    .catch((err) => console.log(err));
});

// Update data by id
app.put("/update", (req, res) => {
  const { id, name, location } = req.body;
  console.log(req.body);
  const result = updateNameById(id, name, location);

  result
    .then((data) => res.json({ success: data }))
    .catch((err) => console.log(err));
});

// Get last data sensor
app.get("/get-last-data", (req, res) => {
  const result = getLastData();

  result
    .then((data) => res.json({ data: data }))
    .catch((err) => console.log(err));
});

server.listen(process.env.PORT, () =>
  console.log(`Server listening on port: ${process.env.PORT}`)
);

// Create Table
createTable();

let check = 0;
let averageTemp = 0;
let averageHumidity = 0;
let checkTurnOff = 0;
let counttt = 0;
let countt = 0;

const mqtt = require("mqtt");

// Connect to mqtt
const options = {
  clientID: process.env.CLIENTID,
  username: process.env.USERNAME_MQTT,
  password: process.env.PASSWORD_MQTT,
  host: process.env.HOST_MQTT,
  port: process.env.PORT_MQTT,
};
// mosquitto_sub -h broker.mqttdashboard.com -t place/data/sensors
// initialize the MQTT client
const client = mqtt.connect(options);

// setup the callbacks
client.on("connect", function () {
  console.log("Connected to MQTT");
});

client.on("error", function (error) {
  console.log(error);
});

// subscribe to topic 'my/test/topic'
client.subscribe("place/data/sensors");

client.on("message", function (topic, message) {
  // called each time a message is received
  console.log("message is " + message);
  console.log("topic is " + topic);

  check++;
  countt++;

  if ((countt === 20 && checkTurnOff === 1)) {
    checkTurnOff = 0;
    counttt = 1;
    countt = 0;
  }

  const data = JSON.parse(message);

  const getRandom = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const newDataTemp = Math.round(data.temperature);
  const newDataHumidity = Math.round(data.humidity);
  const newDataLight = Math.round(data.light);

  averageTemp += parseFloat(data.temperature.toFixed(2));
  averageHumidity += newDataHumidity;

  let ss_id = getRandom(1, 5);
  let checkSentData = 0;

  if (check === 5) {
    let sentTemp = averageTemp / 5;
    let sentHumidity = averageHumidity / 5;
    let newSentTemp = parseFloat(sentTemp.toFixed(2));

    if (checkTurnOff === 0) {
      if (sentTemp > 33) {
        const message = `Hi, the temperature and humidity values are ${newSentTemp}°C and ${sentHumidity}% respectively. The fan is being turned on!`;
        const optionsForMail = {
          from: "<sender@gmail.com>",
          to: "user@gmail.com",
          subject:
            "Send the temperature and humidity values of the surrounding environment",
          text: message,
          html: HTML_TEMPLATE(message),
        };
        sendMail(optionsForMail, (info) => {
          console.log("Email sent successfully");
          console.log("MESSAGE ID: ", info.messageId);
        });
        client.publish("turn-led1", "on");
        checkSentData = 1;
      } else if (sentTemp < 25) {
        const message = `Hi, the temperature and humidity values are ${sentTemp} and ${sentHumidity} respectively. The fireplace is being turned on!`;
        const optionsForMail = {
          from: "<sender@gmail.com>",
          to: "user@gmail.com",
          subject:
            "Send the temperature and humidity values of the surrounding environment",
          text: message,
          html: HTML_TEMPLATE(message),
        };
        sendMail(optionsForMail, (info) => {
          console.log("Email sent successfully");
          console.log("MESSAGE ID: ", info.messageId);
        });
        client.publish("turn-led2", "on");
        checkSentData = 2;
      }
    }

    averageHumidity = 0;
    averageTemp = 0;
    check = 0;
  }

  // Insert new data into database
  insertNewData(ss_id, newDataTemp, newDataHumidity, newDataLight);

  // Send data to client
  sendDataToClient(io, checkSentData, counttt);

  counttt = 0;
});

io.on("connection", function (socket) {
  console.log(socket.id + " connected");
  socket.on("disconnect", function () {
    console.log(socket.id + " disconnected");
  });

  socket.on("Led1", function (data) {
    if (data == "on") {
      console.log("Led1 ON");
      client.publish("turn-led1", "on");
    } else if (data == "off") {
      console.log("Led1 OFF");
      client.publish("turn-led1", "off");
    } else if (data == "offff") {
      checkTurnOff = 1;
      console.log("Led1 OFF");
      client.publish("turn-led1", "off");
    }
  });

  socket.on("Led2", function (data) {
    if (data == "on") {
      console.log("Led2 ON");
      client.publish("turn-led2", "on");
    } else if (data == "off") {
      console.log("Led2 OFF");
      client.publish("turn-led2", "off");
    } else if (data == "offff") {
      checkTurnOff = 1;
      console.log("Led2 OFF");
      client.publish("turn-led2", "off");
    }
  });
});
