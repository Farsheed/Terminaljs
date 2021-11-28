var rolling = require('rolling-hash');
var fs = require('fs');
var file = '/Users/farsheed/Documents/MyApps/FileChunk/assets/pins.csv';
var hashDBFile = '/Users/farsheed/Documents/MyApps/FileChunk/assets/output/';
var versionNo = process.argv[2];
 
var rh = rolling('md5', 1024);
var index = 0;

fs.writeFileSync(hashDBFile + '_hashDbV' + versionNo + '.txt', '');

rh.on('hash', function (h) {
    console.log("hash: ", h.toString('hex'));

    fs.appendFileSync(hashDBFile + '_hashDbV' + versionNo + '.txt', index + ',' + h.toString('hex') + '\n');
    index++;
});
fs.createReadStream(file).pipe(rh);
