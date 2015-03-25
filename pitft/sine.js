var pitft = require('pitft'),
    touch = require('pitft-touch'),
    fb = pitft('/dev/fb1', true),
    xMax = fb.size().width,
    yMax = fb.size().height,
    osc = require('osc-min'),
    dgram = require('dgram'),
    remote;

fb.clear();

function s(value, fromMin, fromMax, toMin, toMax) {
  var percent = (value - fromMin) / (fromMax - fromMin);
  return (percent * (toMax - toMin) + toMin);
}

// listen for OSC messages and print them to the console
var udp = dgram.createSocket('udp4', function(msg, rinfo) {
  remote = rinfo.address;
  fb.color(0, 0, 1);
  fb.rect(0, 0, xMax, yMax, true);
  fb.blit();
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
    address: '/pitft/sine',
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
console.log('Make sure to send connect message from example OSC patch');

var waiting;
touch('/dev/input/touchscreen', function(err, data) {

  send(data.x,data.y);

  if(waiting)
    return;

  waiting = setTimeout(function() { clearInterval(waiting); waiting = null; }, 100);

  fb.color(0, 0, 1);
  fb.rect(0, 0, xMax, yMax, true);
  fb.image(data.x - 80, data.y - 80, __dirname + '/logo.png');
  fb.blit();

});
