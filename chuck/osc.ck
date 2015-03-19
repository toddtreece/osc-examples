// SENDING
OscOut xmit;
xmit.dest( "127.0.0.1", 9998 );
xmit.start( "/test/chuck" );
"testing" => xmit.add;
5 => xmit.add;
32.93 => xmit.add;
xmit.send();

// RECEIVING
OscIn oin;
OscMsg msg;
9999 => oin.port;
oin.addAddress( "/test/x, i" );
oin.addAddress( "/test/y, i" );
oin.addAddress( "/test/many, sfi" );

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
