var spheron = require('spheron');
var _ = require('underscore');
var sphero = spheron.sphero();
var spheroPort = findPortArg();//'/dev/rfcomm1';//rfcomm0
var COLORS = spheron.toolbelt.COLORS;

sphero.on('open', function() {
	console.log('opened');
	setInterval(function(){
		var randomColor = getRandomColor();
		console.log('set rand color', randomColor);
		sphero.setRGB(randomColor, false);
	}, 5 * 1000);
//	sphero.setRGB(getRandomColor(), false);
});

sphero.on('error', function(err) {console.log('error', err);quit();});
sphero.on('close', function() {console.log('closed');});
sphero.on('end', function() {console.log('ended');});
sphero.on('oob', function() {console.log('oob', arguments);});
sphero.on('message', function() {console.log('message', arguments);});
sphero.on('notification', function() {console.log('notification', arguments);});


function getRandomColor(){
	var arr = [
		COLORS.BLACK,
		COLORS.BLUE,
		COLORS.GREEN,
		COLORS.ORANGE,
		COLORS.PINK,
		COLORS.PURPLE,
		COLORS.RED,
		COLORS.WHITE,
		COLORS.YELLOW
	];
	return arr[Math.floor(Math.random()*arr.length)];
}

var control = {
	HEADING_LEFT:		270,
	HEADING_RIGHT:		90,
	HEADING_FORWARD:	0,
	HEADING_REVERSE:	180,
	forward: function(speed){
		sphero.setRGB(COLORS.GREEN, false);//best way to DEBUG ! colored commands
		this.roll(speed ? speed : 0.5, this.HEADING_FORWARD, 0);
	},
	reverse: function(speed){
		sphero.setRGB(COLORS.RED, false);//best way to DEBUG ! colored commands
		this.roll(speed ? speed : 0.5, this.HEADING_REVERSE, 0);
	},
	right: function(speed){
		sphero.setRGB(COLORS.WHITE, false);//best way to DEBUG ! colored commands
		this.roll(speed ? speed : 0.5, this.HEADING_RIGHT, 0);
	},
	left: function(speed){
		sphero.setRGB(COLORS.BLUE, false);//best way to DEBUG ! colored commands
		this.roll(speed ? speed : 0.5, this.HEADING_LEFT, 0);
	},
	roll:function(speed, handling, delay){
		sphero.roll2(speed ? speed : 0.5, handling ? handling : this.HEADING_FORWARD, delay ? delay : 0);
		return this;
	},
	/**
	 * Create a series of command to result a circle movement.
	 * @param radius
	 */
	circle: function(radius){
		var delay = 0;
		var angle = 0;

		while(angle < 360){
			this.roll(0.3, angle, delay);

			angle += 10;
			delay += 1;
		}
	},
	stop: function(){
		sphero.roll(0,sphero.heading||0,0);
	}
}

function quit(){
	console.log("Exiting");
	control.stop();
	process.exit(1);
}

function findPortArg(){
	var result = '';
	process.argv.forEach(function (val, index, array) {
		if ( val.indexOf('/dev') == 0 ){
			result = val;
			return false;
		}
		return true;
	});
	return result;
}

console.log('Node: trying to connect to port ' + spheroPort);
sphero.open(spheroPort);
