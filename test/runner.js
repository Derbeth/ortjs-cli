const exec = require('child_process').exec,
    expect = require('chai').expect,
    runner = require('../lib/runner'),
    fs = require('fs');

describe("runner", function() {
    describe("from file to file", function() {
        afterEach(function() {
            fs.unlink('/tmp/test-in.txt', rethrow);
            fs.unlink('/tmp/test-out.txt', rethrow);
        });

        it("saves corrected input", function(done) {
            fs.writeFileSync('/tmp/test-in.txt', "4-ro letni książe\n8-mio osobowy\n", 'utf8');
            runner('/tmp/test-in.txt', '/tmp/test-out.txt', {}, function() {
                expect(fs.readFileSync('/tmp/test-out.txt', {encoding: 'utf8'}))
                    .to.equal("4-letni książę\n8-osobowy\n");
                done();
            });

        });
    });

    describe("using Windows EOL and encoding", function() {
        afterEach(function() {
            fs.unlink('/tmp/test-out2.txt', rethrow);
        });

        it("maintains EOL and encoding", function(done) {
            runner('test/win-input.txt', '/tmp/test-out2.txt', {encoding: 'cp1250'}, function() {
                exec('diff -u /tmp/test-out2.txt test/win-output.txt', {}, (error, stdout) => {
                    if (error) {
                        throw new Error(`Diffing failed\n${stdout}`);
                    }
                    expect(stdout.toString('utf8')).to.equal('');
                    done();
                });
            });
        });
    });
});

function rethrow (err) {
    if (err) throw err;
}
