const sw = new Stopwatch();

function Stopwatch() {
	
let startTime, endTime, running, duration = 0;


this.start = function () {
	
	if (running === true)
		throw new Error('Stopwatch has already started');

    running = true;

    startTime = new Date();

};




this.stop = function () {
    
    if ( running === false)
        throw new Error ('Stopwatch is not started');
    
    running = false; 
    
    endTime = new Date();
    
    secondes = (endTime.getTime() - startTime.getTime()) / 1000;
    duration += secondes;
    
};

this.reset = function () {
    
    running = undefined;

    startTime = null ;
    endTime = null;
    duration = 0;

};


Object.defineProperty(this, 'duration', { 

	
	get: function() { return duration; } 

 });


}

sw.start();

duration = 0;

console.log(duration);
console.log(sw.duration);

setTimeout(function() {
sw.stop();

let finalDuration = sw.duration;

    console.log('Duration: ' + finalDuration + ' seconds');
}, 2000);

setTimeout(function() {

    console.log(duration);
console.log(sw.duration);

sw.reset();

    console.log('Duration after reset: ' + sw.duration + ' seconds');
}, 2001);

setTimeout(function() {
sw.start();

}, 2002);

setTimeout(function() {
sw.stop();

let finalDuration = sw.duration;

    console.log('Duration after restart: ' + finalDuration + ' seconds');
}, 4002);
