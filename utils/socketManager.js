const socketIO = require('socket.io');

let io;

function init(server) {
    io = socketIO(server, {
        cors: {
            origin: '*'
        }
    });

    io.on('connection', socket => {
        console.log('User connected:', socket.id);

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });

    return io;
}

function getIO() {
    if (!io) throw new Error("Socket.io not initialized");
    return io;
}

module.exports = { init, getIO };
