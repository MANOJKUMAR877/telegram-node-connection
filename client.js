const net = require("net");
const readline = require("readline");

// Function to create a telegram message
function createTelegram(distance, magnitude, phase, temperature) {
  const identifier = Buffer.from("MCR", "utf-8");
  const distanceBuffer = Buffer.alloc(8);
  distanceBuffer.writeBigInt64BE(BigInt(distance), 0);
  const magnitudeBuffer = Buffer.alloc(4);
  magnitudeBuffer.writeUInt32BE(magnitude, 0);
  const phaseBuffer = Buffer.alloc(1);
  phaseBuffer.writeInt8(phase, 0);
  const temperatureBuffer = Buffer.alloc(4);
  temperatureBuffer.writeInt32LE(temperature, 0);

  // Concatenate all buffers
  const telegram = Buffer.concat([
    identifier,
    distanceBuffer,
    magnitudeBuffer,
    phaseBuffer,
    temperatureBuffer,
  ]);
  return telegram;
}

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Prompt user for input
rl.question("Enter distance (in millimeters): ", (distance) => {
  rl.question("Enter magnitude (unsigned integer): ", (magnitude) => {
    rl.question("Enter phase (integer): ", (phase) => {
      rl.question("Enter temperature (in Celsius): ", (temperature) => {
        // Create the telegram message with user input
        const telegramMessage = createTelegram(
          parseInt(distance),
          parseInt(magnitude),
          parseInt(phase),
          parseInt(temperature)
        );

        // Connect to the server and send the telegram message
        const client = net.createConnection(
          { port: 12345, host: "127.0.0.1" },
          () => {
            console.log("Connected to server!");
            client.write(telegramMessage);
            rl.close(); // Close the readline interface
          }
        );

        // Handle errors
        client.on("error", (err) => {
          console.error("Error:", err);
          rl.close(); // Close the readline interface
        });

        // Handle closure
        client.on("close", () => {
          console.log("Connection closed");
        });
      });
    });
  });
});
