const express = require("express");
const app = express();
const server = require("http").Server(app);
app.set("view engine", "ejs");
app.use(express.static("public"));

const io = require("socket.io")(server, {
    cors: {
        origin: '*'
    }
});

const { ExpressPeerServer, PeerServer } = require("peer");
const pperServer = ExpressPeerServer(server, {
    debug: true
})

app.use("/peerjs", PeerServer);

app.get("/", (req, res) => {
    res.render("index");
});

io.on("connection", (socket) => {
    socket.on("join-room", (roomId, userId, userName) => {
        socket.join(roomId);
        socket.on("message", (message) => {
            io.to(roomId).emit("createMessage", message, userName);
        });
    })
});

server.listen(3030);