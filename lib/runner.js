'use strict';

const Ort = require('ort'),
    fs = require('fs'),
    iconv = require('iconv-lite'),
    readline = require('readline');

function createReadStream(input, encoding) {
    const stream = input === '-' ? process.stdin : fs.createReadStream(input);
    return stream.pipe(iconv.decodeStream(encoding || 'utf8'));
}

function createWriteStream(output) {
    return output === '-' ? process.stdout : fs.createWriteStream(output);
}

function findEol(encoding) {
    if (encoding !== undefined && encoding.match(/^(cp|win)/i)) {
        return "\r\n";
    } else {
        return "\n";
    }
}

var runner = function(input, output, options, callback) {
    const ort = new Ort(options);
    const writeStream = createWriteStream(output);
    const eol = findEol(options.encoding);
    const rl = readline.createInterface({
        input: createReadStream(input, options.encoding),
        output: writeStream,
        terminal: false
    });
    rl.on('line', function(line) {
        writeStream.write(iconv.encode(ort.fix(line), options.encoding || 'utf8'));
        writeStream.write(eol);
    });
    rl.on('close', function() {
        if (writeStream !== process.stdout) {
            writeStream.end();
        }
        rl.close();
        if (callback !== undefined) {
            callback();
        }
    });
}

module.exports = runner;
