from socketIO_client import SocketIO, LoggingNamespace

with SocketIO('--', 3000, LoggingNamespace) as socketIO:
    socketIO.emit('connection')
    socketIO.emit('radarData', {'x': 'asd'})
    socketIO.wait(seconds=1)
    print("working")