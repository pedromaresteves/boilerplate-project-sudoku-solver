'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const validationData = { valid: true }
      const conflicts = [];
      const { puzzle, coordinate, value } = req.body;
      const isPuzzleValid = solver.validate(puzzle);
      if (isPuzzleValid !== true) return res.send(isPuzzleValid);
      if (!value || !coordinate) return res.send({ error: "Required field(s) missing" });
      if (!["A", "B", "C", "D", "E", "F", "J", "H", "I"].includes(coordinate[0].toUpperCase())) return res.send({ error: 'Invalid coordinate' })
      if (coordinate.substring(1).length > 1 || coordinate[1] == 0) return res.send({ error: 'Invalid coordinate' })
      if (isNaN(Number(value)) || Number(value) < 1 || Number(value) > 9) return res.send({ error: 'Invalid value' })
      const rowLetter = coordinate[0].toUpperCase();
      const columnNumber = coordinate[1];
      const allCordinates = solver.getAllCoordinates(puzzle);
      const isValueValidForSelectedRow = solver.checkRowPlacement(puzzle, rowLetter, value.toString());
      const isValueValidForSelectedColumn = solver.checkColPlacement(puzzle, columnNumber, value.toString());
      const isValueValidForSquare = solver.checkRegionPlacement(puzzle, rowLetter, columnNumber, value.toString());
      if (allCordinates[coordinate] === value) return res.send(validationData)
      if (!isValueValidForSelectedRow) {
        validationData.valid = false;
        conflicts.push("row")
      }
      if (!isValueValidForSelectedColumn) {
        validationData.valid = false;
        conflicts.push("column")
      }
      if (!isValueValidForSquare) {
        validationData.valid = false;
        conflicts.push("region")
      }
      if (conflicts.length) validationData.conflict = conflicts;
      return res.send(validationData)
    });

  app.route('/api/solve')
    .post((req, res) => {
      const isValidated = solver.validate(req.body.puzzle);
      if (isValidated !== true) return res.send(isValidated);
      const solution = solver.solve(req.body.puzzle);
      if (!solution) return res.send({ error: "Puzzle cannot be solved" })
      return res.send({ solution: solution })
    });
};
