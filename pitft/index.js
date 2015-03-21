var pitft = require('pitft'),
    touch = require('pitft-touch'),
    fb = pitft('/dev/fb1');

fb.clear();

function s(value, fromMin, fromMax, toMin, toMax) {
  var percent = (value - fromMin) / (fromMax - fromMin);
  return (percent * (toMax - toMin) + toMin);
}

var xMax = fb.size().width;
var yMax = fb.size().height;

var osc = require('osc-min'),
    dgram = require('dgram'),
    remote;

// listen for OSC messages and print them to the console
var udp = dgram.createSocket('udp4', function(msg, rinfo) {
  remote = rinfo.address;
});

function send(x,y) {

  // we don't have the remote address yet
  if(! remote)
    return;

  x = s(x, 0, xMax, 30, 100);
  y = s(y, 0, yMax, 0, 127);

  // build message with a few different OSC args
  var midi = osc.toBuffer({
    oscType: 'message',
    address: '/pitft',
    args: [{
      type: 'integer',
      value: x
    },
    {
      type: 'integer',
      value: y
    }]
  });

  udp.send(midi, 0, midi.length, 9999, remote);

}

udp.bind(9998);
console.log('Listening for OSC messages on port 9998');

var waiting;
touch('/dev/input/touchscreen', function(err, data) {

  if(waiting) {
    return;
  }

  waiting = setTimeout(function() { clearInterval(waiting); waiting = null; }, 100);
  fb.clear();

  var r = 0,
      g = 0,
      b = 0;

  g = s(data.x, 0, xMax, 0, 1);
  b = s(data.y, 0, yMax, 0, 1);

  send(data.x,data.y);

  fb.color(r, g, b);
  fb.rect(0, 0, xMax, yMax, true);
  fb.image(parseInt(xMax / 2) - 80 , parseInt(yMax / 2) - 80, __dirname + '/logo.png');

});
