var fs = require('fs');
var crypto = require('crypto');

// var CHUNK_SIZE = 1024 * 1024; //10 * 1024 * 1024, // 10MB
//     buffer = Buffer.alloc(CHUNK_SIZE),
//     filePath = '/Users/farsheed/Documents/MyApps/FileChunk/assets/pins.csv';

// fs.open(filePath, 'r', function (err, fd) {
//     if (err) throw err;

//     function readNextChunk() {
//         fs.read(fd, buffer, 0, CHUNK_SIZE, null, function (err, nread) {
//             if (err) throw err;

//             console.log("nread: ", nread);
            
//             if (nread === 0) {
//                 // done reading file, do any necessary finalization steps

//                 fs.close(fd, function (err) {
//                     if (err) throw err;
//                 });
//                 return;
//             }

//             var data;
//             if (nread < CHUNK_SIZE) {
//                 data = buffer.slice(0, nread);
//                 console.log("Buffer Data: ", data);
//             }
//             else {
//                 data = buffer;
//                 console.log("Data: ", data);
//             }

//             // do something with `data`, then call `readNextChunk();`
//         });
//     }
//     readNextChunk();
// });


var data = '';
var index = 0;
var baseChunkFileToWrite = '/Users/farsheed/Documents/MyApps/FileChunk/assets/output/';
var hashDBFile = '/Users/farsheed/Documents/MyApps/FileChunk/assets/output/';

var readStream = fs.createReadStream('/Users/farsheed/Documents/MyApps/FileChunk/assets/word.docx', {
    highWaterMark: 1 * 1024,
    encoding: 'utf8'
});

readStream.on('data', function (chunk) {
    data += chunk;
    console.log('chunk Data : ');
    console.log(chunk); // your processing chunk logic will go here
    // fs.writeFileSync(baseChunkFileToWrite + index + ".csv", chunk);
    var hash = crypto.createHash('md5').update(chunk).digest('hex');
    fs.appendFileSync(hashDBFile + '_hashDbV' + '3' + '.txt', index + ',' + hash + '\n');
    index++;

}).on('end', function () {
    // console.log('###################');
    // console.log(data);
    // here you see all data processed at end of file
});