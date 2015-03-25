var pitft = require('pitft'),
    touch = require('pitft-touch'),
    fb = pitft('/dev/fb1'),
    util = require('util'),
    xMax = fb.size().width,
    yMax = fb.size().height,
    osc = require('osc-min'),
    dgram = require('dgram'),
    remote;

fb.clear();

var buttons = [];
var button_tpl = {
  x: 0,
  y: 0,
  w: parseInt(xMax / 2),
  h: parseInt(yMax / 2),
  name: 'NOT SET',
  id: 0,
  pressed: false
};

for(var i = 0; i < 2; i++) {

  for(var j = 0; j < 2; j++) {

    var btn = {};
    util._extend(btn, button_tpl);

    btn.x = btn.w * j;
    btn.y = btn.h * i;
    btn.id = buttons.length;
    buttons.push(btn);
 
  }

}


// listen for OSC messages and print them to the console
var udp = dgram.createSocket('udp4', function(msg, rinfo) {

  remote = rinfo.address;

  try {
    msg = osc.fromBuffer(msg);
  } catch(err) {
    return console.log('Could not decode OSC message');
  }

  if(msg.address != '/pitft/button')
    return;

  buttons[msg.args[0].value - 1].name = msg.args[1].value;
  draw();

});

function send(id) {

  // we don't have the remote address yet
  if(! remote)
    return;

  if(isNaN(id))
    return;

  var midi = osc.toBuffer({
    oscType: 'message',
    address: '/pitft/sample',
    args: [{
      type: 'integer',
      value: id + 1
    }]
  });

  udp.send(midi, 0, midi.length, 9999, remote);

}

udp.bind(9998);
console.log('Listening for OSC messages on port 9998');
console.log('Make sure to send connect message from example OSC patch');

var waiting;

touch('/dev/input/touchscreen', function(err, data) {

  if(waiting)
    return;

  waiting = setTimeout(function() { clearInterval(waiting); waiting = null; }, 200);

  if(! data.touch)
    return;
    
  send(getId(data));
  draw(data);
  setTimeout(draw, 200);

});


function getId(data) {

  if(! data)
    return;

  for(var i = 0; i < buttons.length; i++) {

    var button = buttons[i];

    if(data.x < button.x)
      continue; 
 
    if(data.y < button.y)
      continue;

    if(data.x > button.x + button.w)
      continue;

    if(data.y > button.y + button.h)
      continue;

    return button.id;

  }

}

function draw(data) {

  var id = getId(data);

  for(var i = 0; i < buttons.length; i++) {
  
    var button = buttons[i];

    if (button.id == id)
      fb.color(0, 1, 0);
    else
      fb.color(0, 0.8, 0);

    fb.rect(button.x, button.y, button.w, button.h, true);
    fb.color(0, 0, 0);
    fb.font('fantasy', 18, true);
    fb.line(xMax /2, 0, xMax / 2, yMax, 2);
    fb.line(0, yMax / 2, xMax, yMax / 2, 2);
    fb.text(button.x + button.w / 2, button.y + button.h / 2, button.name, true); 
     
  }

  fb.blit();

}

