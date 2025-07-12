const express = require('express')
const app = express()

// socket.io setup
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server, { pingInterval: 2000, pingTimeout: 5000 })


const port = 3000
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})
const players = {}
io.on('connection', (socket)=>{
    console.log('a user connected')
    players[socket.id] = {
        x: 100,
        y: 100,
        name:"",
        dir: "none"
    }
    socket.on('disconnect', (reason) => {
        console.log("a user disconnected due to " + reason)
        delete players[socket.id]
        io.emit('updatePlayers', players)
    })
    socket.on('move',(direction) =>{
        players[socket.id].dir = direction;
        if(players[socket.id].x == 0){
            
        }
        if(direction == "left"){
            players[socket.id].x --;
        }
        if(direction == "right"){
            players[socket.id].x++;
        }
        if(direction == "up"){
            players[socket.id].y--;
        }
        if(direction == "down"){
            players[socket.id].y++;
        }

        io.emit("updatePlayers",players)
    })
    socket.on('Named',(name) =>{
        players[socket.id].name = name;
        io.emit("updatePlayers",players)
    })
    socket.on('noMove', (direction)=>{
        players[socket.id].dir = direction;
        io.emit("updatePlayers",players)
    })
    io.emit("updatePlayers",players)
})
server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })