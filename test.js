const assert = require('assert');
const { getStepInterval, TRACKS } = require('./app.js');
console.log('🧪 Testing BeatForge Drum Machine...');
assert(TRACKS.length === 4, '4 drum tracks present');
assert(Math.round(getStepInterval(120)) === 125, '120 BPM 16th note timing is 125ms');
console.log('✅ BeatForge Drum Machine test passed!');
