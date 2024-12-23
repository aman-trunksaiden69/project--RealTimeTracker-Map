const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
//to run socket.io we need http server-
const socketIO = require('socket.io');


const server = http.createServer(app);
const io = socketIO(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

//receive msg-
io.on("connection", function(socket){
    socket.on("send-location", function(data){
      //send msg to all-
      io.emit("recieve-location", {id: socket.id, ...data})
    })
    //disconnect map-
    socket.on("disconnect", function(){
        //send msg-
        io.emit("user-disconnected", socket.id)
    })
});

app.get("/", function(req, res){
    res.render("index.ejs")
});

server.listen(3000, () => {
    console.log("Server is running on port 3000");
});