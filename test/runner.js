const exec = require('child_process').exec,
    expect = require('chai').expect,
    runner = require('../lib/runner'),
    fs = require('fs');

describe("runner", function() {
    describe("from file to file", function() {
        afterEach(function() {
            fs.unlink('/tmp/test-in.txt');
            fs.unlink('/tmp/test-out.txt');
        });

        it("saves corrected input", function(done) {
            fs.writeFileSync('/tmp/test-in.txt', "4-ro godzinny\n8-mio osobowy\n", 'utf8');
            runner('/tmp/test-in.txt', '/tmp/test-out.txt', {}, function() {
                expect(fs.readFileSync('/tmp/test-out.txt', {encoding: 'utf8'}))
                    .to.equal("4-godzinny\n8-osobowy\n");
                done();
            });

        });
    });

    xdescribe("using Windows EOL and encoding", function() {
        afterEach(function() {
            fs.unlink('/tmp/test-out2.txt');
        });

        it("maintains EOL and encoding", function(done) {
            runner('test/win-input.txt', '/tmp/test-out2.txt', {encoding: 'CP1250'}, function() {
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
