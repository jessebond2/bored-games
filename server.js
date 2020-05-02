const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const nextHandler = nextApp.getRequestHandler()

// fake DB
const messages = []
let userCount = 0
let users = {}

// socket.io server
io.on('connection', (socket) => {
  console.log(`A user connected! Users: ${userCount}`)

  socket.on('newUser', (data) => {
    users[data.value] = true
    userCount++

    socket.broadcast.emit(`message::${data.room}`, {
      id: data.id,
      value: `New user connected: ${data.id}`,
    })
  })

  socket.on('message', (data) => {
    console.log('received msg', data)
    messages.push(data)
    socket.broadcast.emit(`message::${data.room}`, data)
  })

  socket.on('disconnect', (data) => {
    userCount--
    console.log('A user disconnected', userCount, data)
    io.emit('a user disconnected')
  })
})

nextApp.prepare().then(() => {
  app.get('/messages', (req, res) => {
    res.json(messages)
  })

  app.get('*', (req, res) => {
    return nextHandler(req, res)
  })

  server.listen(3000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
})
