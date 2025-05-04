const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');
const { Client } = require('ssh2');

// Create Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Load SSH configuration
let sshConfig;
try {
    sshConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'))).ssh;
} catch (err) {
    console.error('Error loading config.json:', err);
    process.exit(1);
}

// Handle socket connections
io.on('connection', (socket) => {
    console.log('Client connected');

    // Create new SSH connection
    const ssh = new Client();

    // Handle SSH connection
    ssh.on('ready', () => {
        console.log('SSH connection established');
        socket.emit('connection', { status: 'connected' });

        // Create SSH shell
        ssh.shell((err, stream) => {
            if (err) {
                socket.emit('error', { message: 'SSH shell error: ' + err.message });
                return;
            }

            // Send SSH stream data to client
            stream.on('data', (data) => {
                socket.emit('data', data.toString('utf-8'));
            });

            // Handle SSH stream errors
            stream.on('close', () => {
                socket.emit('connection', { status: 'closed' });
                ssh.end();
            });

            // Handle client input
            socket.on('data', (data) => {
                stream.write(data);
            });

            // Handle client resize events
            socket.on('resize', (data) => {
                stream.setWindow(data.rows, data.cols);
            });

            // Handle client disconnect
            socket.on('disconnect', () => {
                console.log('Client disconnected');
                stream.close();
                ssh.end();
            });
        });
    });

    // Handle SSH errors
    ssh.on('error', (err) => {
        console.error('SSH connection error:', err);
        socket.emit('error', { message: 'SSH connection error: ' + err.message });
    });

    // Connect to SSH server
    try {
        const privateKey = fs.readFileSync(sshConfig.privateKeyPath);
        ssh.connect({
            host: sshConfig.host,
            port: sshConfig.port || 22,
            username: sshConfig.username,
            // password: ''
            privateKey: privateKey
        });
    } catch (err) {
        console.error('Error connecting to SSH server:', err);
        socket.emit('error', { message: 'Error connecting to SSH server: ' + err.message });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});