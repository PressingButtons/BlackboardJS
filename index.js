'use strict';
const express = require('express');
const path = require('path');
const bp = require('body-parser');
const exphbs = require('express-handlebars');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.port || 3001;
//app variables
const rooms = {count: 0, sessions: {}};
//methods
const create_room = name => {
  rooms.sessions[name] = {active: true };
  rooms.count++;
  syslog(`Room "${name}" created.`)
}

const destroy_room = name => {
  if (!rooms.sessions[name]) return;
  delete rooms.sessions[name];
  rooms.count++;
  syslog(`Room ${name} created`);
}

const render_createroom = ( req, res, next ) => {
  res.render('create_room')
}

const render_blackboard = ( req, res, next ) => {
  if( rooms.sessions.hasOwnProperty( req.params.id )) {
    res.render('blackboard');
  } else {
    res.status(404);
    res.render('404', { url : req.url });
  }
}

const syslog = function(...args ) {
  console.log(new Date().toLocaleString(), args );
}

//middlewares
app.engine('.hbs', exphbs({ extname: '.hbs', defaultLayout: 'main'}));
app.set('view engine', '.hbs');

app.use(bp.urlencoded({extended:false}));
app.use(bp.json());

app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/code', express.static(path.join(__dirname, 'code')));
app.use('/jquery', express.static(path.join(__dirname, '/node_modules/jquery/dist/jquery.slim.min.js')));
app.use('/socket-io', express.static(path.join(__dirname, '/node_modules/socket.io/client-dist/socket.io.js')));

//routing
const onpost_roomregistration = ( req, res, next ) => {
  create_room( req.body.room );
  res.redirect('/Blackboard/room_' + req.body.room );
}

const redirect_createRoom = ( req, res, next ) => {
  res.redirect('/Blackboard/create-room');
}

//gets
app.get('/', redirect_createRoom );
app.get('/Blackboard', redirect_createRoom );
app.get('/Blackboard/create-room', render_createroom );
app.get('/Blackboard/room_:id', render_blackboard );
//posts
app.post('/room_registration', onpost_roomregistration );
//server listening
const onServerListen = err => {
  if( err ) throw err;
  console.log(`Blackboard Server Initialized on port ${PORT}.`);
}

http.listen( PORT, onServerListen );


//sockets

const onSocketConnection = socket => {
  
}

io.on('connection', onSocketConnection );
