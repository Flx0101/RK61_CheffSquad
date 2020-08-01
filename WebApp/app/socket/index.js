const stream = (socket) => {
    socket.on('subscribe', (data) => {
        socket.join(data.room);
        socket.join(data.socketId);

        //Inform other members in the room of new user's arrival
        if (socket.adapter.rooms[data.room].length > 1) {
            console.log("SocketId: " + data.socketId);
            socket.to(data.room).emit('new user', { socketId: data.socketId });
        }
    });

}
module.exports = stream;