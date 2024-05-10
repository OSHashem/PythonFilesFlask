// Using ES Module syntax
import express from 'express';
import fetch from 'node-fetch';
import { spawn } from 'child_process';

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

// Function to start the Python server
function startPythonServer() {
    const pythonServer = spawn('python', ['./python.py'], {
        cwd: 'C:/Users/Lenovo/Desktop/Python To JS/PythonFilesFlask', // Update the path as necessary
        detached: true,
        stdio: 'inherit'
    });

    pythonServer.on('error', err => {
        console.log('Failed to start Python server:', err);
    });

    pythonServer.on('close', code => {
        console.log(`Python server process exited with code ${code}`);
    });

    console.log(`Python server started with PID: ${pythonServer.pid}`);
    pythonServer.unref(); // Allows the Python server to remain active independently
}

// Route to send data to Python and get a response
app.get('/send-to-python', async (req, res) => {
    const dataToSend = { data: 'Sample data from Node.js' };
    // startPythonServer();

    try {
        const response = await fetch('http://127.0.0.1:5000/process-data', {
            method: 'POST',
            body: JSON.stringify(dataToSend),
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const dataFromPython = await response.json(); // Receive the response from Python
        res.status(200).json({
            message: 'Received response from Python',
            pythonResponse: dataFromPython
        });
    } catch (error) {
        console.error('Error communicating with Python server:', error);
        res.status(500).json({ error: 'Failed to communicate with Python server' });
    }
});

// Start the Node.js server
app.listen(3000, () => {
    console.log('Node.js server running on http://localhost:3000');
    startPythonServer();
});
