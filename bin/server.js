const app = require('../app')
const http = require('http')
const PORT = process.env.PORT || 3000
const socketIo = require("socket.io")

const server = http.createServer(app)
const io = socketIo(server)

io.on("connection", (socket) => {
    console.log('new client connected')
    // if (interval) {
    //     clearInterval(interval)
    // }
    // interval = setInterval(() => getApiAndEmit(socket), 1000)

    socket.on('Client', (data) => {
        io.emit('Server', data)
    })
    socket.on("disconnect", () => {
        console.log("Client disconnected")
        // clearInterval(interval)
    })
})

server.listen(PORT, () => {
    console.log('I love U ', PORT)
})
