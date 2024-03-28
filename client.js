const net = require('net');
const readline = require('readline');

// Function to create a telegram message
function createTelegram(distance, magnitude, phase, temperature) {
    const identifier = Buffer.from("MCR", 'utf-8');
    const distanceBuffer = Buffer.alloc(8);
    distanceBuffer.writeBigInt64BE(BigInt(distance), 0);
    const magnitudeBuffer = Buffer.alloc(4);
    magnitudeBuffer.writeUInt32BE(magnitude, 0);
    const phaseBuffer = Buffer.alloc(1);
    phaseBuffer.writeInt8(phase, 0);
    const temperatureBuffer = Buffer.alloc(4);
    temperatureBuffer.writeInt32LE(temperature, 0);

    // Concatenate all buffers
    const telegram = Buffer.concat([identifier, distanceBuffer, magnitudeBuffer, phaseBuffer, temperatureBuffer]);
    return telegram;
}

// Function to validate input value
function validateInput(value, minValue, maxValue, errorMessage) {
    if (isNaN(value) || value < minValue || value > maxValue) {
        throw new Error(errorMessage);
    }
}

// Function to prompt user for input
function prompt(question) {
    return new Promise((resolve, reject) => {
        rl.question(question, (input) => {
            resolve(input);
        });
    });
}

// Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Main function to collect input and send telegram message
async function main() {
    try {
        const distance = parseInt(await prompt('Enter distance (in millimeters): '));
        validateInput(distance, 0, Number.MAX_SAFE_INTEGER, 'Distance must be a non-negative integer within the range of 0 to ' + Number.MAX_SAFE_INTEGER + '.');

        const magnitude = parseInt(await prompt('Enter magnitude (unsigned integer): '));
        validateInput(magnitude, 0, 4294967295, 'Magnitude must be a non-negative integer within the range of 0 to 4294967295.');

        const phase = parseInt(await prompt('Enter phase (integer): '));
        validateInput(phase, -128, 127, 'Phase must be an integer within the range of -128 to 127.');

        const temperature = parseInt(await prompt('Enter temperature (in Celsius): '));
        validateInput(temperature, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, 'Temperature must be an integer.');

        // Create the telegram message with user input
        const telegramMessage = createTelegram(distance, magnitude, phase, temperature);

        // Connect to the server and send the telegram message
        const client = net.createConnection({ port: 12345, host: '127.0.0.1' }, () => {
            console.log('Connected to server!');
            client.write(telegramMessage);
            rl.close(); // Close the readline interface
        });

        // Handle errors
        client.on('error', (err) => {
            console.error('Error:', err);
            rl.close(); // Close the readline interface
        });

        // Handle closure
        client.on('close', () => {
            console.log('Connection closed');
        });
    } catch (error) {
        console.error('Error:', error.message);
        rl.close(); // Close the readline interface
    }
}

// Call the main function
main();
