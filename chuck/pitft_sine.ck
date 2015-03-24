SinOsc s => dac;
1 => s.gain;

// SENDING
OscOut xmit;
xmit.dest( "10.0.1.11", 9998 );
xmit.start( "/pitft" );
"connect" => xmit.add;
xmit.send();


// RECEIVING
OscIn oin;
OscMsg msg;
9999 => oin.port;
oin.addAddress( "/pitft/sine, ii" );

// infinite time-loop
while( true )
{
    
    while(oin.recv(msg))
    {
        msg.getInt(0) => Std.mtof => s.freq;
        msg.getInt(1) / 127.0 => s.gain;
    }
    
    10::ms => now;
}
