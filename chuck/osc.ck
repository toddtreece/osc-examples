// SENDING
OscOut xmit;
xmit.dest( "127.0.0.1", 9998 );
xmit.start( "/print/chuck" );
"testing" => xmit.add;
5 => xmit.add;
32.93 => xmit.add;
xmit.send();

xmit.start( "/socketio" );
50 => xmit.add;
55 => xmit.add;
xmit.send();

// RECEIVING
OscIn oin;
OscMsg msg;
9999 => oin.port;
oin.addAddress( "/print/x, i" );
oin.addAddress( "/print/y, i" );
oin.addAddress( "/print/many, sfi" );
oin.addAddress( "/socketio, ii" );

while ( true )
{
    while(oin.recv(msg))
    {
        chout <= msg.address <= " ";
        for(int n; n < msg.numArgs(); n++)
        {
            if(msg.typetag.charAt(n) == 'i')
                chout <= msg.getInt(n) <= " ";
            else if(msg.typetag.charAt(n) == 'f')
                chout <= msg.getFloat(n) <= " ";
            else if(msg.typetag.charAt(n) == 's')
                chout <= msg.getString(n) <= " ";
        }
        chout <= IO.nl();
    }

}
