class SudokuSolver {

  validate(puzzleString) {
    const invalidCharsRegex = /[^1-9\.]/g;
    if (puzzleString.length !== 81) return false
    if (puzzleString.match(invalidCharsRegex)) return false
    return true
  }

  checkRowPlacement(puzzleString, row, value) {
    if (!row || typeof row !== 'string') return false
    const rowLetterConvertedToNumber = (row.charCodeAt(0) - 65);
    const puzzleStringRows = [[]];
    let puzzleRow = 0;
    puzzleString.split("").forEach((item, index) => {
      if (index > 1 && index % 9 === 0) {
        puzzleStringRows.push([])
        puzzleRow++;
      }
      puzzleStringRows[puzzleRow].push(item);
    })
    if (!puzzleStringRows[rowLetterConvertedToNumber]) return false;
    return !puzzleStringRows[rowLetterConvertedToNumber].includes(value);
  }

  checkColPlacement(puzzleString, column, value) {
    if (!column) return false
    const puzzleStringColumns = [[]];
    let arrayIndex = 0;
    puzzleString.split("").forEach((item) => {
      if (!puzzleStringColumns[arrayIndex]) puzzleStringColumns.push([])
      puzzleStringColumns[arrayIndex].push(item)
      arrayIndex++;
      if (arrayIndex === 9) arrayIndex = 0
    });
    return !puzzleStringColumns[column - 1].includes(value);
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const puzzleStringSquares = [[]];
    const puzzleStringed = puzzleString.split("");
    const region = calculateRegion(row, column);
    let puzzleZone = 0;
    for (let i = 0; i < puzzleStringed.length; i++) {
      if (i > 1 && i % 3 === 0) {
        puzzleZone++
      }
      if (i > 1 && i % 9 === 0 && i % 27 !== 0) {
        puzzleZone -= 3;
      }
      if (!puzzleStringSquares[puzzleZone]) puzzleStringSquares[puzzleZone] = []
      puzzleStringSquares[puzzleZone].push(puzzleStringed[i])
    }
    return !puzzleStringSquares[region].includes(value);
  }

  solve(puzzleString) {
  }
}

const calculateRegion = (row, column) => {
  const rowLetterConvertedToNumber = (row.charCodeAt(0) - 65);
  const regionBlocksByColumn = [[0, 3, 6], [1, 4, 7], [2, 5, 8]];
  let columnBlock = 0;
  let rowBlock = 0;
  for (let i = 0; i < column; i++) {
    if (i > 1 && i % 3 === 0) {
      columnBlock++
    }
  }

  for (let i = 0; i <= rowLetterConvertedToNumber; i++) {
    if (i > 1 && i % 3 === 0) {
      rowBlock++
    }
  }
  return regionBlocksByColumn[columnBlock][rowBlock]
}

module.exports = SudokuSolver;

