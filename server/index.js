let cors = require('cors');
const express = require('express');
const app = express();

app.get('/', (req,res)=>{
    res.send('Server on...');
});

let router = require('./routes/restapi.js');

// app.use(express.static(path.join(__dirname, '../public')))
//app.use('/',home);



app.use(cors());

let bodyParser = require('body-parser');
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

app.use('/api/v1',router);



// WebSocket (Socket.io) Setup

let server = require('http').Server(app);
let io = require('socket.io')(server);



require('./services/serverSocketService')(io);


server.listen(3000);
server.on('error', (err)=>{
    throw err;
});
