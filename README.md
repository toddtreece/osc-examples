# node.js osc examples

## Installation

The examples require the latest stable version of node.js (>= v0.12.0) to be installed.

```
$ git clone https://github.com/toddtreece/osc-examples.git && cd osc-examples
$ npm install
```

### Cycling '74 Max

If you would like to test the examples with Max, you will need to download and install the latest version of Max [from Cycling '74's website][1].

### PureData

If you are interested in the PureData examples, you will need to download and install the latest version of [Pd-Extended][2].

### ChucK

If you would like to use Chuck with the examples, you will need to download and install lastest version of the command line executable or miniAudicle from [Princeton's website][3].

## Included Examples

* `print.js` - prints received messages from the Max, Pd, or Chuck OSC examples. Also sends messages back one every second.
* `socketio.js` - demonstrates communicating through OSC with a web browser in real time using socket.io using node.js to translate messages to and from Max, Pd, or Chuck.

### Raspberry Pi PiTFT Examples

To demonstrate working with remotely connected hardware, there are a couple examples that make use of a Raspberry Pi and a [PiTFT touchscreen module][4].


#### Installation on a Raspberry Pi

```
$ git clone https://github.com/toddtreece/osc-examples.git
$ cd osc-examples/pitft
$ npm install
```

#### PiTFT Examples

* `sine.js' - sends out X & Y of touches as MIDI pitch and velocity values. Top left of the screen is 0 pitch 0 velocty, and bottom right is 127 pitch & 127 velocity. Use with the pitft_sine example in Max, Pd, or Chuck on your workstation.
* `sample.js` - creates a grid of 4 buttons that will trigger samples loaded with the pitft_sample example in Max, Pd, or Chuck on your workstation.


[1]: https://cycling74.com/downloads
[2]: https://puredata.info/downloads/pd-extended
[3]: http://chuck.cs.princeton.edu/release
[4]: https://www.adafruit.com/search?q=pitft
