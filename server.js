const net = require("net");

const server = net.createServer((socket) => {
  console.log("Client connected");

  socket.on("data", (data) => {
    console.log("Received data:", data);
    const receivedData = Buffer.from(
     data,
      "hex"
    );

    // Destructure the received data
    const [identifier, distanceBuffer, magnitudeBuffer, phaseBuffer, temperatureBuffer] = [
        receivedData.slice(0, 3).toString(), // Convert the first 3 bytes to string for identifier
        receivedData.slice(3, 11), // Distance buffer (8 bytes)
        receivedData.slice(11, 15), // Magnitude buffer (4 bytes)
        receivedData.slice(15, 16), // Phase buffer (1 byte)
        receivedData.slice(16, 20) // Temperature buffer (4 bytes)
      ];
      
      // Convert buffer values to respective data types
      const distance = BigInt(distanceBuffer.readBigUInt64BE());
      const magnitude = magnitudeBuffer.readUInt32BE();
      const phase = phaseBuffer.readInt8();
      const temperature = temperatureBuffer.readInt32LE();
      
      // Log the destructured components
      console.log('Identifier:', identifier);
      console.log('Distance:', distance);
      console.log('Magnitude:', magnitude);
      console.log('Phase:', phase);
      console.log('Temperature:', temperature);

    // Parse the received data according to the telegram message format
    // and extract the values for distance, magnitude, phase, and temperature.
  });

  socket.on("end", () => {
    console.log("Client disconnected");
  });
});

server.on("error", (err) => {
  console.error("Server error:", err);
});

server.listen(12345, "0.0.0.0", () => {
  console.log("Server started and listening on port 12345");
});
