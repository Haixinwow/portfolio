const express = require('express')
const app = express();
const port = 3456;
const http = require("http");
const server = http.createServer(app);

const { Server } = require("socket.io")
const io = new Server(server, {
    maxHttpBufferSize: 1e8
});

app.use(express.static(__dirname));

let users = [];
let rooms = [];
let bans = [];

rooms.push({ room: "Main", isPrivate: false });
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client.html');
})

function getUsersInRoom(room) {
    let names = [];
    users.forEach(element => {
        if (element.room == room) {
            names.push(element.name);
        }
    });
    return names;
}

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

// Attach our Socket.IO server to our HTTP server to listen
io.sockets.on("connection", function(socket) {
    socket.on('join', function(data) {
        // This callback runs when a new Socket.IO connection is established.
        let room = data["room"];
        let id = socket.id;
        let name = id;

        io.sockets.to(id).emit("initialize_name", id);
        users.push({ id: id, name: name, room: room });
        socket.join(room);
        io.sockets.to(room).emit("join_message_to_client", name);
        let roomUsers = getUsersInRoom(room);
        io.sockets.to(room).emit("update_room_users", roomUsers);
        io.sockets.emit("update_room_list", rooms);
    });

    socket.on('message_to_server', function(data) {
        // This callback runs when the server receives a new message from the client.
        console.log("message: " + data["message"]); // log it to the Node.JS output
        console.log("room: " + data["roomName"]);
        io.sockets.to(data["roomName"]).emit("message_to_client", { message: data["message"], user: data["user"] }) // broadcast the message to other users
    });

    socket.on('message_with_image_to_server', function(data) {
        // This callback runs when the server receives a new message from the client.
        console.log("message w image: " + data["message"]); // log it to the Node.JS output
        console.log("room image: " + data["roomName"]);

        io.sockets.to(data["roomName"]).emit("message_with_image_to_client", { message: data["message"], user: data["user"], image: data["image"] }) // broadcast the message to other users
    });

    socket.on("private_message", function(data) {
        io.sockets.to(data["userID"]).emit("private_message_to_client", { message: data["message"], user: data["user"] }) // broadcast the message to other user
    });

    socket.on('change_username', function(data) {
        // This callback runs when the server receives a new name change from the client.
        let userData = users.find(element => element.id == socket.id);
        if (userData) {
            let checkRepeat = users.find(element => element.name == data["user"]);
            if (!checkRepeat && (data["user"] != "")) {
                //update username in array
                userData.name = data["user"];
                //update userlist
                let room = userData.room;
                let roomUsers = getUsersInRoom(room);
                io.sockets.to(room).emit("update_room_users", roomUsers);
            } else {
                socket.emit("error_message", { message: "repeating username" });
            }
        }
    });

    socket.on('room_create', function(data) {
        // This callback runs when the server receives a new room from the client.
        let room = data["roomName"];
        let checkRoom = rooms.find(element => element.room == room);
        if (!checkRoom) { //not a duplicate room name
            socket.leave(data["prevRoom"]);
            socket.join(room);
            let userData = users.find(element => element.id == socket.id);
            if (userData) {
                prevRoom = userData.room;
                userData.room = data["roomName"];
            }
            rooms.push({ room: room, isPrivate: false, owner: socket.id });
            socket.emit("new_room_to_client", { name: room }); // broadcast the room to other users
            let prevRoomUsers = getUsersInRoom(prevRoom);
            let roomUsers = getUsersInRoom(room);
            io.sockets.to(room).emit("update_room_users", roomUsers);
            io.sockets.to(prevRoom).emit("update_room_users", prevRoomUsers);
            io.sockets.emit("update_room_list", rooms);
        } else {
            //room already exist
            console.log("repeating room name");
            socket.emit("error_message", { message: "repeating room name" });
        }
    });

    socket.on('room_join', function(data) {
        //this callback runs when the user requests to change their current room
        let room = data["roomName"];
        let checkRoom = rooms.find(element => element.room == room);
        let checkBan = bans.find(element => element.ban_user == socket.id);
        if (checkBan) {
            checkBan = checkBan.room == room;
        }
        let checkIfPassword = false;
        if (checkRoom && !checkBan) {
            checkIfPassword = checkRoom.hasOwnProperty('password');
        } else if (checkBan) {
            socket.emit("error_message", { message: "you are banned from this room" });
            return;
        } else {
            console.log("room doesn't exist");
            socket.emit("error_message", { message: "join public room error" });
            return;
        }
        if (checkRoom && !checkIfPassword) { //room exists and is public
            socket.leave(data["prevRoom"]);
            socket.join(room);
            let userData = users.find(element => element.id == socket.id);
            let prevRoom;
            if (userData) {
                prevRoom = userData.room;
                userData.room = room;
            }
            let prevRoomUsers = getUsersInRoom(prevRoom);
            let roomUsers = getUsersInRoom(room);
            io.sockets.to(room).emit("join_message_to_client", data["name"]);
            io.sockets.to(room).emit("update_room_users", roomUsers);
            io.sockets.to(prevRoom).emit("update_room_users", prevRoomUsers);
            console.log("joined room name: " + room);
            socket.emit("update_title", { room: room });
        } else {
            console.log("public room doesn't exist");
            socket.emit("error_message", { message: "join public room error" });
        }
    });

    socket.on('private_room_create', function(data) {
        let room = data["roomName"];
        let checkRoom = rooms.find(element => element.room == room);
        let password = data["password"];
        if (!checkRoom && password != "") {
            socket.leave(data["prevRoom"]);
            let user = data["user"];
            socket.join(room);
            let userData = users.find(element => element.id == socket.id);
            let prevRoom;
            if (userData) {
                prevRoom = userData.room;
                userData.room = room;
            }
            console.log("private room created: " + room + " password: " + password + " owner: " + user);
            rooms.push({ room: room, isPrivate: true, owner: socket.id, password: password });
            socket.emit("new_private_room_to_client", { name: room }); // broadcast the room to other users
            let prevRoomUsers = getUsersInRoom(prevRoom);
            let roomUsers = getUsersInRoom(room);
            io.sockets.to(room).emit("update_room_users", roomUsers);
            io.sockets.to(prevRoom).emit("update_room_users", prevRoomUsers);
            io.sockets.emit("update_room_list", rooms);

        } else {
            //repeating room 
            console.log("repeating room name");
            socket.emit("error_message", { message: "repeating room name or unusable password" });
        }
    })

    socket.on('private_room_join', function(data) {
        let room = data["roomName"];
        let password = data["password"];
        let checkRoom = rooms.find(element => element.room == room);
        let checkBan = bans.find(element => element.ban_user == socket.id);
        if (checkBan) {
            checkBan = checkBan.room == room;
        }
        if (checkBan) {
            socket.emit("error_message", { message: "you are banned from this room" });
            return;
        }
        if (checkRoom && (checkRoom.password == password)) {
            socket.leave(data["prevRoom"]);
            socket.join(room);
            console.log(room);
            console.log("room joined");
            let userData = users.find(element => element.id == socket.id);
            let prevRoom;
            if (userData) {
                prevRoom = userData.room;
                userData.room = room;
            }
            let prevRoomUsers = getUsersInRoom(prevRoom);
            let roomUsers = getUsersInRoom(room);
            io.sockets.to(room).emit("update_room_users", roomUsers);
            io.sockets.to(prevRoom).emit("update_room_users", prevRoomUsers);
            socket.emit("update_title", { room: room });
        } else {
            //erro message: wrong room name or password
            console.log("wrong room name or password");
            socket.emit("error_message", { message: "wrong room name or password" });
        }
    });

    socket.on('kick_user', function(data) {
        let room = data["roomName"];
        let findRoom = rooms.find(element => element.room == room);
        let checkOwner = (findRoom.owner == socket.id);
        let checkIfExist = users.find(element => element.name);
        if (checkOwner && checkIfExist) {
            let find_id = users.findIndex(element => element.name == data["user"]);
            let socketID = users[find_id].id;
            let kicked_user_socket = io.sockets.sockets.get(socketID);
            console.log(socketID);
            kicked_user_socket.leave(socketID.room);
            kicked_user_socket.join('Main');
            kicked_user_socket.emit("update_title", { room: "Main" });
            let userData = users.find(element => element.id == kicked_user_socket.id);
            let prevRoom;
            if (userData) {
                prevRoom = room; 
                userData.room = "Main";
            }
            let prevRoomUsers = getUsersInRoom(prevRoom);
            let roomUsers = getUsersInRoom("Main");
            io.sockets.to(room).emit("update_room_users", roomUsers);
            io.sockets.to(prevRoom).emit("update_room_users", prevRoomUsers);
        }
    })

    socket.on('ban_user', function(data) {
        let room = data["roomName"];
        let findRoom = rooms.find(element => element.room == room);
        let checkOwner = (findRoom.owner == socket.id);
        let checkIfExist = users.find(element => element.name);
        if (checkOwner && checkIfExist) {
            let find_id = users.findIndex(element => element.name == data["user"]);
            let socketID = users[find_id].id;
            let kicked_user_socket = io.sockets.sockets.get(socketID);
            console.log("test" + socketID);
            kicked_user_socket.leave(socketID.room);
            console.log("banned user id: " + socketID);
            kicked_user_socket.join('Main');
            kicked_user_socket.emit("update_title", { room: "Main" });
            bans.push({ room: room, ban_user: socketID });
            let userData = users.find(element => element.id == kicked_user_socket.id);
            let prevRoom;
            if (userData) {
                prevRoom = room;
                userData.room = "Main";
            }
            let prevRoomUsers = getUsersInRoom(prevRoom);
            let roomUsers = getUsersInRoom("Main");
            io.sockets.to(room).emit("update_room_users", roomUsers);
            io.sockets.to(prevRoom).emit("update_room_users", prevRoomUsers);
        }
    })

    socket.on('disconnect', () => {
        //get users room before disconnect to update userlist
        let userData = users.find(element => element.id == socket.id);
        let room;
        if (userData) {
            room = userData.room;
        }

        //remove user from list of users
        let index = users.findIndex(element => element.id == socket.id);
        if (index > -1) {
            users.splice(index, 1);
        }

        //update user display
        let roomUsers = getUsersInRoom(room);
        io.sockets.to(room).emit("update_room_users", roomUsers);
    })
});