const net = require("net");

// Create a TCP server
const server = net.createServer((socket) => {
  console.log("Client connected");

  // Handle incoming data
  socket.on("data", (data) => {
    console.log("Received telegram message:", data);
    // Parse telegram message
    const identifier = data.slice(0, 3).toString("utf-8");
    const distance = Number(data.readBigInt64BE(3));
    const magnitude = data.readUInt32BE(11);
    const phase = data.readInt8(15);
    const temperature = data.readInt32LE(16);

    // Display parsed data
    // console.log("Identifier:", identifier);
    // console.log("Distance:", distance);
    // console.log("Magnitude:", magnitude);
    // console.log("Phase:", phase);
    // console.log("Temperature:", temperature);
    const value = [
      {
        Identifier: identifier.toString(),
        Distance: distance,
        Magnitude: magnitude,
        Phase: phase,
        Temperature: temperature,
      },
    ];
   
    console.table(value);
  });

  // Handle closure
  socket.on("close", () => {
    console.log("Client disconnected");
  });
});

// Start the server
server.listen(12345, "127.0.0.1", () => {
  console.log("Server is listening on port 12345");
});

// Handle server errors
server.on("error", (err) => {
  console.error("Server error:", err);
});
