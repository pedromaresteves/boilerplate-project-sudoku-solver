const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
    test("Solve a puzzle with valid puzzle string", function (done) {
        const puzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
        chai.request(server).post("/api/solve").send({ puzzle: puzzle }).then(res => {
            assert.equal(res.body.solution, '769235418851496372432178956174569283395842761628713549283657194516924837947381625')
            done();
        });
    });
    test("Get error if no puzzle string is sent", function (done) {
        chai.request(server).post("/api/solve").send({ puzzle: '' }).then(res => {
            assert.deepEqual(res.body, { error: 'Required field missing' })
            done();
        });
    });
    test("Get error if invalid characters are sent", function (done) {
        const invalidCharactersPuzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.A";
        chai.request(server).post("/api/solve").send({ puzzle: invalidCharactersPuzzle }).then(res => {
            assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' })
            done();
        });
    });
    test("Get error if puzzle string has not the correct length", function (done) {
        const notCorrectLengthPuzzle = "9";
        chai.request(server).post("/api/solve").send({ puzzle: notCorrectLengthPuzzle }).then(res => {
            assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' })
            done();
        });
    });
    test("Solve a puzzle that cannot be solved", function (done) {
        const unsolvablePuzzle = "999..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
        chai.request(server).post("/api/solve").send({ puzzle: unsolvablePuzzle }).then(res => {
            assert.deepEqual(res.body, { error: 'Puzzle cannot be solved' })
            done();
        });
    });
    test("Get error if puzzle string has not the correct length", function (done) {
        const notCorrectLengthPuzzle = "9";
        chai.request(server).post("/api/solve").send({ puzzle: notCorrectLengthPuzzle }).then(res => {
            assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' })
            done();
        });
    });
    test("Check a puzzle placement with all fields", function (done) {
        const puzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
        const coordinate = "A1";
        const value = 7;
        chai.request(server).post("/api/check").send({ puzzle, coordinate, value }).then(res => {
            assert.equal(res.body.valid, true)
        });
        done();
    });
    test("Check a puzzle placement with single placement conflict", function (done) {
        const puzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
        const coordinate = "A1";
        const value = 2;
        chai.request(server).post("/api/check").send({ puzzle, coordinate, value }).then(res => {
            assert.equal(res.body.valid, false);
            assert.deepEqual(res.body.conflict, ["region"]);
            done();
        });
    });
    test("Check a puzzle placement with multiple placement conflicts", function (done) {
        const puzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
        const coordinate = "A1";
        const value = 1;
        chai.request(server).post("/api/check").send({ puzzle, coordinate, value }).then(res => {
            assert.equal(res.body.valid, false);
            assert.deepEqual(res.body.conflict, ["row", "column"]);
            done();
        });
    });
    test("Check a puzzle placement with all placement conflicts", function (done) {
        const puzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
        const coordinate = "A1";
        const value = 5;
        chai.request(server).post("/api/check").send({ puzzle, coordinate, value }).then(res => {
            assert.equal(res.body.valid, false);
            assert.deepEqual(res.body.conflict, ["row", "column", "region"]);
            done();
        });
    });
    test("Check a puzzle placement with missing value field", function (done) {
        const puzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
        const coordinate = "A1";
        chai.request(server).post("/api/check").send({ puzzle, coordinate }).then(res => {
            assert.equal(res.body.error, "Required field missing");
            done();
        });
    });
    test("Check a puzzle placement with missing coordinate field", function (done) {
        const puzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
        const value = 5;
        chai.request(server).post("/api/check").send({ puzzle, value }).then(res => {
            assert.equal(res.body.error, "Required field missing");
            done()
        });
    });
    test("Check a puzzle placement with missing puzzle field", function (done) {
        const coordinate = "A1";
        const value = 5;
        chai.request(server).post("/api/check").send({ coordinate, value }).then(res => {
            assert.deepEqual(res.body.error, "Required field missing");
            done();
        });
    });
    test("Check a puzzle placement with invalid characters", function (done) {
        const puzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
        const coordinate = "A11";
        const value = 5;
        chai.request(server).post("/api/check").send({ puzzle, coordinate, value }).then(res => {
            assert.equal(res.body.error, "Invalid coordinate");
            done();
        });
    });
    test("Check a puzzle placement with invalid placement value", function (done) {
        const puzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
        const coordinate = "A1";
        const value = "A";
        chai.request(server).post("/api/check").send({ puzzle, coordinate, value }).then(res => {
            assert.equal(res.body.error, "Invalid value");
            done();
        });
    });
});

