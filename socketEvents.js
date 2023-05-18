const socketEvents = (socket, io) => {
  socket.on('message', (data) => {
    io.emit('message', data)
  })

  socket.on('service-compilation', (data) => {
    io.emit('service-compilation', data)
  })
}

module.exports = socketEvents
