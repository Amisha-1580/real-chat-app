const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

// Handle WebSocket connections
io.on('connection', socket => {
    console.log('✅ A user connected');

    // Join a specific chat room
    socket.on('joinRoom', room => {
        socket.join(room);
        console.log(`📌 User joined room: ${room}`);
        socket.to(room).emit('message', {
            sender: 'System',
            message: '🔔 A user joined the room.'
        });
    });

    // Receive chat message and broadcast it to the room
    socket.on('chatMessage', (data) => {
        // ✅ Properly forward both message and sender
        io.to(data.room).emit('message', {
            sender: data.sender,
            message: data.message
        });
    });

    // Typing indicator
    socket.on('typing', (data) => {
        socket.to(data.room).emit('showTyping', data.sender);
    });

    // Disconnect
    socket.on('disconnect', () => {
        console.log('❌ A user disconnected');
    });
});

// Start server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
