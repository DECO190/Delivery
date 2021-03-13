// https://socket.io/docs/v3/migrating-from-2-x-to-3-0/#Add-a-clear-distinction-between-the-Manager-query-option-and-the-Socket-query-option

const crypto = require('crypto');
const bcrypt = require('bcrypt');

const express = require('express');
const path = require('path');

const bodyParser = require('body-parser')

const pages = require('./pages.js')

const db = require('./database/db.js')

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static('public'))
app.set('views', path.join(__dirname, 'views'))
app.engine('html', require('ajs').renderFile)
app.set('view engine', 'html')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())



var authorizedConnections = {}
app.get('/', pages.index)
app.get('/menu', pages.menu)
app.get('/login', pages.login)
app.get('/register', pages.register)
app.post('/createuser', pages.createUser)
app.post('/loginUser', pages.loginUser)
app.get('/verifyAsk', pages.verifyAsk)
app.get('/followAsk', pages.followAskRender)
app.get('/getAsk', pages.getAsk)
app.get('/admin', pages.admin)
app.get('/askInfo', pages.askInfo)
app.get('/getUserInfo', pages.getUserInfo)
app.post('/generateRequire', pages.generateRequire)
app.post('/attAsk', pages.attAsk)
app.post('/consent', pages.consent)

let connections = []

io.on('connection', async socket => {
    console.log('===============================================')
    console.log(socket.id)
    console.log(socket.handshake.query.password, socket.handshake.query.username)
    console.log(connections)
    console.log(socket.handshake.query.password == 'coco de galinha' && socket.handshake.query.username == 'restaurante do deco')
    function newRequest(data) {
        console.log('chegou na função')
        console.log(socket.handshake.query.password)
        socket.broadcast.emit('getRequest', data)
    }
    
    if (socket.handshake.query.password == 'coco de galinha' && socket.handshake.query.username == 'restaurante do deco') {
        connections.push(socket.id)
        
    } else if ( await connections.includes(socket.id)) {
        await console.log(connections)

    } else {
        console.log(connections, '>>>> desc ')
        console.log('desconectou')
        socket.disconnect()
    }
    app.post('/makeSocketRequire', (req, res) => {
        console.log(req.body)
        newRequest(JSON.parse(req.body.request))
        res.send('')
    })

});

server.listen(5500); 

///////////////////////////////////////////////////////////////////////////////////////////////////
// tirar o stringfy do generaterequire > coloquei isso so para teste com o insomnia 
//////////////////////////////////////////////////////////////////////////////////////////////////