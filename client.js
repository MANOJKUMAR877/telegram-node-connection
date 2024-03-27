const net = require("net");

// Function to construct a telegram message according to the specified format
function constructTelegram(distance, magnitude, phase, temperature) {
  // Convert components to Buffer objects
  const identifier = Buffer.from("MCR");
  const distanceBuffer = Buffer.alloc(8);
  distanceBuffer.writeBigInt64BE(BigInt(distance), 0);
  const magnitudeBuffer = Buffer.alloc(4);
  magnitudeBuffer.writeUInt32BE(magnitude, 0);
  const phaseBuffer = Buffer.alloc(1);
  phaseBuffer.writeInt8(phase, 0);
  const temperatureBuffer = Buffer.alloc(4);
  temperatureBuffer.writeInt32LE(temperature, 0);

  // Concatenate buffers to construct the telegram message
  const telegramMessage = Buffer.concat([
    identifier,
    distanceBuffer,
    magnitudeBuffer,
    phaseBuffer,
    temperatureBuffer,
  ]);

  return telegramMessage;
}

// Create a TCP socket and connect to the server
const client = net.createConnection({ host: "0.0.0.0", port: 12345 }, () => {
  console.log("Connected to server");
  sendData(); // Send data immediately after connection
  setInterval(sendData, 5000); // Send data every 5 seconds
});

// Function to send telegram message to the server
function sendData() {
  // Construct the telegram message
  const distance = 12345678901234; // Example distance in millimeters
  const magnitude = 987654321; // Example magnitude
  const phase = 127; // Example phase
  const temperature = 25; // Example temperature in Celsius

  const telegramMessage = constructTelegram(
    distance,
    magnitude,
    phase,
    temperature
  );

  // Send the telegram message to the server
  client.write(telegramMessage);
}

// Handle errors
client.on("error", (err) => {
  console.error("Error:", err);
});

// Handle connection close
client.on("close", () => {
  console.log("Connection closed");
});
