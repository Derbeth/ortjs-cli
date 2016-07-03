const execSync = require('child_process').execSync,
    expect = require('chai').expect;

const runOrt = function (args) {
    return execSync('bin/ortjs ' + args, {encoding: 'utf8'});
}

var runOrtForInput = function(input, args) {
    args = args || '';
    return execSync(`echo "${input}" | bin/ortjs ${args} - -`, {encoding: 'utf8'});
}

describe("bin/ortjs", function() {
    describe("--help", function() {
        it("shows some help", function() {
            expect(runOrt('--help')).to.contain('--encoding');
        });
    });
    describe("from stdin to stdout", function() {
        it("prints corrected input line by line", function() {
            expect(runOrtForInput('4-ro godzinny\\n8-mio osobowy'))
                .to.equal("4-godzinny\n8-osobowy\n");
        });
    });
    describe("--typography", function() {
        it("is accepted", function() {
            expect(runOrtForInput('a - b', '--no-typography'))
                .to.equal("a - b\n");
        });
    });
});
