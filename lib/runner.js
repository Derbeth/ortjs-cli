'use strict';

const Ort = require('ort'),
    fs = require('fs'),
    os = require('os'),
    readline = require('readline');

function createReadStream(input) {
    return input == '-' ? process.stdin : fs.createReadStream(input);
}

function createWriteStream(output) {
    return output == '-' ? process.stdout : fs.createWriteStream(output);
}

var runner = function(input, output, options, callback) {
    const ort = new Ort(options);
    const writeStream = createWriteStream(output);
    const rl = readline.createInterface({
        input: createReadStream(input),
        output: writeStream,
        terminal: false
    });
    rl.on('line', function(line) {
        writeStream.write(ort.fix(line));
        writeStream.write(os.EOL);
    });
    rl.on('close', function() {
        if (writeStream != process.stdout) {
            writeStream.end();
        }
        rl.close();
        if (callback !== undefined) {
            callback();
        }
    });
}

module.exports = runner;
