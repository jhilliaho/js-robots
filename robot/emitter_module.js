// Node.js Module to calculate relative motor speeds by target angle for 3WD omniwheel robot
//
// Jani Hilliaho 2016

"use strict"

exports.moduleState = {};


const EventEmitter = require('events');
const util = require('util');

function ProgramEmitter() {
  EventEmitter.call(this);
}

util.inherits(ProgramEmitter, EventEmitter);

const newProgramEmitter = new ProgramEmitter();

newProgramEmitter.on('event', () => {
  console.log('an event occurred!');
});

newProgramEmitter.on('event1', () => {
  console.log('an event1 occurred!');
});

newProgramEmitter.emit('event');
newProgramEmitter.emit('event1');


