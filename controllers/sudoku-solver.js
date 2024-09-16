class SudokuSolver {

  validate(puzzleString) {
    const regex = /[^1-9\.]/g;
    if (puzzleString.length !== 81) return false
    if (puzzleString.match(regex)) return false
    return true
  }

  checkRowPlacement(puzzleString, row, column, value) {

  }

  checkColPlacement(puzzleString, row, column, value) {

  }

  checkRegionPlacement(puzzleString, row, column, value) {

  }

  solve(puzzleString) {
  }
}

module.exports = SudokuSolver;

