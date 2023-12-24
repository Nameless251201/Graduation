const mysql = require("mysql");
const dotenv = require("dotenv");

dotenv.config();

// Connect to mysql
const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to mySQL");
});

// Create table
const createTable = () => {
  const query =
    "CREATE TABLE IF NOT EXISTS `datasensors` (`id` INT(10) AUTO_INCREMENT PRIMARY KEY, `ss_id` INT(10), `temp` INT(10), `humidity` INT(10), `light` INT(10), `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP);";
  connection.query(query, (err, result) => {
    if (err) throw err;
    console.log("Created table successfully!");
  });
};

// Insert data into table
const insertNewData = (ss_id, temp, humidity, light) => {
  const query =
    "INSERT INTO datasensors (ss_id, temp, humidity, light) VALUES (?, ?, ?, ?);";
  connection.query(
    query,
    [ss_id, temp, humidity, light],
    (err, result) => {
      if (err) throw err;
      console.log("Inserted successfully");
      console.log(result);
    }
  );
};

// Send data to client
const sendDataToClient = (io, checkSentData, counttt) => {
  var createdAt;
  var newDataTemp;
  var newDataHumidity;
  var newDataLight;
  const query = "SELECT * FROM datasensors ORDER BY ID DESC limit 1;";
  connection.query(query, (err, result) => {
    if (err) throw err;
    console.log("Selected successfully");

    result.forEach((value) => {
      createdAt = value.created_at;
      newDataTemp = value.temp;
      newDataHumidity = value.humidity;
      newDataLight = value.light;
      console.log(
        createdAt +
          " " +
          value.temp +
          " " +
          value.humidity +
          " " +
          value.light
      );

      io.sockets.emit("send-update-data-sensors", {
        id: value.id,
        temp: value.temp,
        humidity: value.humidity,
        light: value.light,
        created_at: value.created_at,
        checkSentData: checkSentData,
        counttt: counttt,
      });
    });
  });
};

// Get all data
const getAllData = async () => {
  try {
    const response = await new Promise((resolve, reject) => {
      const query =
        "SELECT datasensors.id, datasensors.ss_id, sensors.name , datasensors.temp, datasensors.humidity, datasensors.light, sensors.location, datasensors.created_at FROM sensors INNER JOIN datasensors ON sensors.id=datasensors.ss_id ORDER BY datasensors.created_at DESC;";
      connection.query(query, (err, result) => {
        if (err) reject(new Error(err.message));
        resolve(result);
      });
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

// Search data by name sensor
const searchByName = async (input) => {
  try {
    const response = await new Promise((resolve, reject) => {
      const query = `
        SELECT datasensors.id, datasensors.ss_id, sensors.name , datasensors.temp, datasensors.humidity, datasensors.light, sensors.location, datasensors.created_at
        FROM sensors
        INNER JOIN datasensors ON sensors.id = datasensors.ss_id
        WHERE sensors.location LIKE ?
        ORDER BY datasensors.created_at DESC;`;

      const searchTerm = `%${input}%`; // Sử dụng biểu thức chính quy để tìm kiếm một phần của tên

      connection.query(query, [searchTerm], (err, result) => {
        if (err) reject(new Error(err.message));
        resolve(result);
      });
    });

    return response;
  } catch (error) {
    console.log(error);
  }
};

// Delete data sensor
const deleteDataSensor = async (id) => {
  try {
    id = parseInt(id, 10);
    const response = await new Promise((resolve, reject) => {
      const query = "DELETE FROM datasensors WHERE id = ?";

      connection.query(query, [id], (err, result) => {
        if (err) reject(new Error(err.message));
        resolve(result);
      });
    });

    return response.affectedRows === 1 ? true : false;
  } catch (error) {
    console.log(error);
  }
};

// Update data sensor by id
const updateNameById = async (id, name, location) => {
  try {
    id = parseInt(id, 10);
    const response = await new Promise((resolve, reject) => {
      const query = "UPDATE sensors SET name = ?, location = ? WHERE id = ?";

      connection.query(query, [name, location, id], (err, result) => {
        if (err) reject(new Error(err.message));
        resolve(result);
      });
    });
    return response.affectedRows === 1 ? true : false;
  } catch (error) {
    console.log(error);
  }
};

// Get last data
const getLastData = async () => {
  try {
    const response = await new Promise((resolve, reject) => {
      const query = "SELECT * FROM datasensors ORDER BY ID DESC limit 1;";

      connection.query(query, (err, result) => {
        if (err) reject(new Error(err.message));
        resolve(result);
      });
    });

    return response;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createTable,
  insertNewData,
  sendDataToClient,
  getAllData,
  searchByName,
  deleteDataSensor,
  updateNameById,
  getLastData,
};
