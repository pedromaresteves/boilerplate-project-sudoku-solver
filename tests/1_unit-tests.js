const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
const puzzles = [
    [
        '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
        '135762984946381257728459613694517832812936745357824196473298561581673429269145378'
    ],
    [
        '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3',
        '568913724342687519197254386685479231219538467734162895926345178473891652851726943'
    ],
    [
        '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1',
        '218396745753284196496157832531672984649831257827549613962415378185763429374928561'
    ],
    [
        '.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6',
        '473891265851726394926345817568913472342687951197254638734162589685479123219538746'
    ],
    [
        '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51',
        '827549163531672894649831527496157382218396475753284916962415738185763249374928651'
    ]
];
let solver = new Solver();

suite('Valid String Unit tests', () => {
    test('Puzzle string cannot be over 81 characters', function (done) {
        const stringOver81Characters = "123456789.123456789.123456789.123456789.123456789.123456789.123456789.123456789.11";
        const shouldBeNotValid = solver.validate(stringOver81Characters);
        assert.deepEqual(shouldBeNotValid, { error: 'Expected puzzle to be 81 characters long' });
        done();
    });
    test('Puzzle string cannot be under 81 characters', function (done) {
        const stringWithLessThan81Characters = "123456789.";
        const shouldBeNotValid = solver.validate(stringWithLessThan81Characters);
        assert.deepEqual(shouldBeNotValid, { error: 'Expected puzzle to be 81 characters long' });
        done();
    });
    test('Puzzle string cannot have letters or special characters', function (done) {
        const characterWith81CharactersButWithLetters = "123456789.123456789.123456789.123456789.123456789.123456789.123456789.123456789.A";
        const characterWith81CharactersButWithSpecialCharacters = "123456789.123456789.123456789.123456789.123456789.123456789.123456789.123456789.A";
        const shouldBeNotValid = solver.validate(characterWith81CharactersButWithLetters);
        const shouldBeNotValidWithSpecialCharacters = solver.validate(characterWith81CharactersButWithSpecialCharacters);
        assert.deepEqual(shouldBeNotValid, { error: 'Invalid characters in puzzle' });
        assert.deepEqual(shouldBeNotValidWithSpecialCharacters, { error: 'Invalid characters in puzzle' });
        done();
    });
    test('Puzzle string must have 81 characters and only have numbers from 1 to 9 and dots', function (done) {
        const characterWith81Characters = "123456789.123456789.123456789.123456789.123456789.123456789.123456789.123456789.1";
        const characterWith81CharactersWithZeros = "123456789012345678901234567890123456789012345678901234567890123456789.123456789.1";
        const shouldBeValid = solver.validate(characterWith81Characters);
        const shouldBeNotValid = solver.validate(characterWith81CharactersWithZeros);
        assert.equal(shouldBeValid, true);
        assert.deepEqual(shouldBeNotValid, { error: 'Invalid characters in puzzle' });
        done();
    });
});


suite('Row placement Unit tests', () => {
    test('Check invalid row placements', function (done) {
        const validPuzzleString = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
        const notValidRowPlacementA = solver.checkRowPlacement(validPuzzleString, "A", "1");
        const notValidRowPlacementB = solver.checkRowPlacement(validPuzzleString, "B", "4");
        assert.equal(notValidRowPlacementA, false);
        assert.equal(notValidRowPlacementB, false);
        done();
    });
    test('Check valid row placements', function (done) {
        const validPuzzleString = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
        const validRowPlacementA = solver.checkRowPlacement(validPuzzleString, "A", "2");
        const validRowPlacementB = solver.checkRowPlacement(validPuzzleString, "B", "1");
        assert.equal(validRowPlacementA, true);
        assert.equal(validRowPlacementB, true);
        done();
    });
});

suite('Column placement Unit tests', () => {
    test('Check invalid Column placements', function (done) {
        const validPuzzleString = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
        const notValidColumnPlacement1 = solver.checkColPlacement(validPuzzleString, "1", "5");
        const notValidColumnPlacement2 = solver.checkColPlacement(validPuzzleString, "2", "2");
        assert.equal(notValidColumnPlacement1, false);
        assert.equal(notValidColumnPlacement2, false);
        done();
    });
    test('Check valid Column placements', function (done) {
        const validPuzzleString = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
        const validColumnPlacement1 = solver.checkColPlacement(validPuzzleString, "1", "7");
        const validColumnPlacement2 = solver.checkColPlacement(validPuzzleString, "2", "1");
        assert.equal(validColumnPlacement1, true);
        assert.equal(validColumnPlacement2, true);
        done();
    });
});

suite('Region placement Unit tests', () => {
    test('Check invalid Region placements', function (done) {
        const validPuzzleString = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
        const notValidRegionPlacement1 = solver.checkRegionPlacement(validPuzzleString, "1", "1", "2");
        const notValidRegionPlacement2 = solver.checkRegionPlacement(validPuzzleString, "2", "3", "3");
        assert.equal(notValidRegionPlacement1, false);
        assert.equal(notValidRegionPlacement2, false);
        done();
    });
    test('Check valid Region placements', function (done) {
        const validPuzzleString = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
        const validRegionPlacement1 = solver.checkRegionPlacement(validPuzzleString, "1", "1", "7");
        const validRegionPlacement2 = solver.checkRegionPlacement(validPuzzleString, "2", "3", "1");
        assert.equal(validRegionPlacement1, true);
        assert.equal(validRegionPlacement2, true);
        done();
    });
});

suite('Solver Unit tests', () => {
    test('Solve Puzzles', function (done) {
        puzzles.forEach(puzzle => {
            assert.equal(solver.solve(puzzle[0]), puzzle[1])
        });
        done();
    });
    test('Invalid puzzle strings fail the solver', function (done) {
        const invalidPuzzle = '999..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
        assert.equal(solver.solve(invalidPuzzle), false)
        done();
    });
});