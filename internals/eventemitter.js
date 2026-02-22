const EventEmitter = require('events');

const emitter = new EventEmitter();


emitter.on ('Logger', (arg) => { 
    console.log('Logger event received:', arg);
});

emitter.emit('Logger', { id:1, url: 'http://example.com' },);

module.exports.emitter = emitter;