me.dir() + "/kick.aif" => string kick_file;
me.dir() + "/snare.aif" => string snare_file;
me.dir() + "/hat.aif" => string hat_file;
me.dir() + "/clave.aif" => string clave_file;

SndBuf kick => dac;
SndBuf snare => dac;
SndBuf hat => dac;
SndBuf clave => dac;

kick_file => kick.read;
snare_file => snare.read;
hat_file => hat.read;
clave_file => clave.read;

// SENDING
OscOut xmit;
xmit.dest( "10.0.1.11", 9998 );
xmit.start( "/pitft/button" );
1 => xmit.add;
"kick.aif" => xmit.add;
xmit.send();
xmit.start( "/pitft/button" );
2 => xmit.add;
"snare.aif" => xmit.add;
xmit.send();
xmit.start( "/pitft/button" );
3 => xmit.add;
"hat.aif" => xmit.add;
xmit.send();
xmit.start( "/pitft/button" );
4 => xmit.add;
"clave.aif" => xmit.add;
xmit.send();

// RECEIVING
OscIn oin;
OscMsg msg;
9999 => oin.port;
oin.addAddress( "/pitft/sample, i" );

while ( true )
{
    
    while(oin.recv(msg))
    {

        if(msg.getInt(0) == 1) {
          0 => kick.pos;
          kick.length() => now;
        } else if(msg.getInt(0) == 2) {
          0 => snare.pos;
          snare.length() => now;
        } else if(msg.getInt(0) == 3) {
          0 => hat.pos;
          hat.length() => now;
        } else if(msg.getInt(0) == 4) {
          0 => clave.pos;
          clave.length() => now;
        }

    }
    
}
