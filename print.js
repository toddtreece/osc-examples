var osc = require('osc-min'),
    dgram = require('dgram'),
    remote;

// listen for OSC messages and print them to the console
var udp = dgram.createSocket('udp4', function(msg, rinfo) {

  // save the remote address
  remote = rinfo.address;

  try {
    console.log(osc.fromBuffer(msg));
  } catch (err) {
    console.log('Could not decode OSC message');
  }

});

// setinterval callback
function send() {

  // we don't have the remote address yet
  if(! remote)
    return;

  // build message with a few different OSC args
  var many = osc.toBuffer({
    oscType: 'message',
    address: '/print/many',
    args: [{
      type: 'string',
      value: 'testing'
    },
    {
      type: 'float',
      value: 3.14
    },
    {
      type: 'integer',
      value: 200
    }]
  });

  // build x message with single arg
  var x = osc.toBuffer({
    oscType: 'message',
    address: '/print/x',
    args: [{
      type: 'integer',
      value: 50
    }]
  });

  // build y message with single arg
  var y = osc.toBuffer({
    oscType: 'message',
    address: '/print/y',
    args: [{
      type: 'integer',
      value: 20
    }]
  });

  // send a bunch of args to the address that sent the last message to us
  udp.send(many, 0, many.length, 9999, remote);

  // send x and y messages
  udp.send(x, 0, x.length, 9999, remote);
  udp.send(y, 0, y.length, 9999, remote);

  console.log('Sent OSC message to %s:%d', remote, 9999);

}

// send message every second
setInterval(send, 1000);

udp.bind(9998);
console.log('Listening for OSC messages on port 9998');
