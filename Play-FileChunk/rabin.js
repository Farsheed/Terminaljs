// require and create an instance
var rabin = require('rabin')();

// pipe some data in
var rs = fs.createReadStream('/Users/farsheed/Documents/MyApps/FileChunk/assets/pins.csv');
rs.pipe(rabin);

// handle output chunks
rabin.on('data', function (chunk) {
    // chunks are created by taking your input data
    // and splitting on each rabin fingerprint found
    console.log(chunk);
});