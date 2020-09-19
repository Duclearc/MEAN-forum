const http = require('http');
const app = require('./app');
const debug = require('debug')('MEAN-forum-server')

//make sure the port number is valid
const normalizePort = val => {
    var port = parseInt(val, 10);
    if (isNaN(port)) {
        //named pipe
        return val;
    }
    if (port >= 0) {
        //port number is valid
        return port;
    }
    return false;
}

//check for errors, log them and exit from server
const onError = error => {
    if (error.syscall !== "listen") {
        throw error;
    }
    const bind = typeof addr === "string" ? "pipe" + addr : "port" + port;
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(brind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
};

//log message reassuring that it's listening for incoming requests
const onListening = () => {
    const addr = server.address();
    const bind = typeof addr === "string" ? "pipe" + addr : "port" + port; 
    debug("Listening on " + bind);
};

//set up port, if none is provided, use 3000
const port = normalizePort(process.env.PORT || "3000");

//tell express to use the server port
app.set('port', port);

//start a server connected to the express app
const server = http.createServer(app);

//set up listeners
server.on("error", onError); //in case of an error
server.on("listening", onListening); //for my peace of mind
server.listen(port); //listen on provided port