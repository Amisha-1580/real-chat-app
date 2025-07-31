const socket = io();
let currentRoom = '';
let username = '';

// Join a room with username and room name
function joinRoom() {
    const room = document.getElementById('roomInput').value.trim();
    const name = document.getElementById('usernameInput').value.trim();

    if (room && name) {
        currentRoom = room;
        username = name;

        // ✅ Send both room and username to server
        socket.emit('joinRoom', { room, username });

        document.getElementById('chat').style.display = 'block';
        document.getElementById('joinArea').style.display = 'none';
    }
}

// Send a chat message
function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();

    if (message) {
        socket.emit('chatMessage', {
            room: currentRoom,
            sender: username,
            message: message
        });

        input.value = '';
    }
}

// Show typing indicator
document.getElementById('messageInput').addEventListener('input', () => {
    socket.emit('typing', { room: currentRoom, sender: username });
});

// Display incoming messages
socket.on('message', ({ sender, message }) => {
    const messages = document.getElementById('messages');
    const p = document.createElement('p');

    // Add class for styling own vs others' messages
    if (sender === 'System') {
        p.classList.add('system');
        p.innerHTML = `<em>${message}</em>`;
    } else {
        p.classList.add(sender === username ? 'own' : 'other');
        p.innerHTML = `<strong>${sender}:</strong> ${message}`;
    }

    messages.appendChild(p);
    messages.scrollTop = messages.scrollHeight;
});

// Show who is typing
socket.on('showTyping', sender => {
    const typing = document.getElementById('typing');
    typing.innerText = `${sender} is typing...`;

    clearTimeout(window.typingTimeout);
    window.typingTimeout = setTimeout(() => {
        typing.innerText = '';
    }, 2000);
});
