var http = require('http'),
    socketio = require('socket.io'),
    fs = require('fs'),
    osc = require('osc-min'),
    dgram = require('dgram'),
    remote_osc_ip;


var http_server = http.createServer(function(req, res) {

  fs.readFile(__dirname + '/socketio.html', function(err, data) {

    if(err) {
      res.writeHead(500);
      return res.end('Error loading socket.io.html');
    }

    res.writeHead(200);
    res.end(data);

  });

});

var io = socketio(http_server);

var udp_server = dgram.createSocket('udp4', function(msg, rinfo) {

  var osc_message;
  try {
    osc_message = osc.fromBuffer(msg);
  } catch(err) {
    return console.log('Could not decode OSC message');
  }

  if(osc_message.address != '/socketio') {
    return console.log('Invalid OSC address');
  }

  remote_osc_ip = rinfo.address;

  io.emit('osc', {
    x: parseInt(osc_message.args[0].value) || 0,
    y: parseInt(osc_message.args[1].value) || 0
  });

});

io.on('connection', function(socket) {

  socket.on('browser', function(data) {

    if(! remote_osc_ip) {
      return;
    }

    var osc_msg = osc.toBuffer({
      oscType: 'message',
      address: '/socketio',
      args:[{ 
        type: 'integer',
        value: parseInt(data.x) || 0
      },
      {
        type: 'integer',
        value: parseInt(data.y) || 0
      }]
    });

    udp_server.send(osc_msg, 0, osc_msg.length, 9999, remote_osc_ip);
    console.log('Sent OSC message to %s:9999', remote_osc_ip);

  });

});

http_server.listen(8080);
console.log('Starting HTTP server on TCP port 8080');
udp_server.bind(9998);
console.log('Starting UDP server on UDP port 9998');

