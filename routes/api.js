'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const validationData = { valid: true }
      const conflicts = [];
      const { puzzle, coordinate, value } = req.body;
      const isValueValidForSelectedRow = solver.checkRowPlacement(puzzle, coordinate[0], value);
      const isValueValidForSelectedColumn = solver.checkColPlacement(puzzle, coordinate[1], value);
      const IsValueValidForSquare = solver.checkRegionPlacement(puzzle, coordinate[0], coordinate[1], value);
      if (!value && !coordinate) return res.send({ error: "Required field(s) missing" })
      if (!isValueValidForSelectedRow) {
        validationData.valid = false;
        conflicts.push("row")
      }
      if (!isValueValidForSelectedColumn) {
        validationData.valid = false;
        conflicts.push("column")
      }
      if (!IsValueValidForSquare) {
        validationData.valid = false;
        conflicts.push("region")
      }
      if (conflicts.length) validationData.conflict = conflicts;
      res.send(validationData)
    });

  app.route('/api/solve')
    .post((req, res) => {
      const isValidated = solver.validate(req.body.puzzle)
      console.log(isValidated)
    });
};
