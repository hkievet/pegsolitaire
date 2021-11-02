export const PEG = "peg";
export const SPACE = "space";
export const CORNER = "corner";

export type Tile = "peg" | "space" | "corner";
export type Coordinates = {
  row: number;
  column: number;
};
export type Board = Tile[][];

export const initialBoard: Board = [
  [CORNER, CORNER, PEG, PEG, PEG, CORNER, CORNER],
  [CORNER, PEG, PEG, PEG, PEG, PEG, CORNER],
  [PEG, PEG, PEG, PEG, PEG, PEG, PEG],
  [PEG, PEG, PEG, PEG, PEG, PEG, PEG],
  [PEG, PEG, PEG, PEG, PEG, PEG, PEG],
  [CORNER, PEG, PEG, PEG, PEG, PEG, CORNER],
  [CORNER, CORNER, PEG, PEG, PEG, CORNER, CORNER],
];

export const simpleBoard: Board = [
  [CORNER, CORNER, SPACE, SPACE, SPACE, CORNER, CORNER],
  [CORNER, SPACE, SPACE, SPACE, SPACE, SPACE, CORNER],
  [SPACE, SPACE, SPACE, SPACE, SPACE, SPACE, SPACE],
  [SPACE, SPACE, PEG, PEG, SPACE, SPACE, SPACE],
  [SPACE, SPACE, SPACE, SPACE, SPACE, SPACE, SPACE],
  [CORNER, SPACE, SPACE, SPACE, SPACE, SPACE, CORNER],
  [CORNER, CORNER, SPACE, SPACE, SPACE, CORNER, CORNER],
];

export function getTile(board: Board, coordinates: Coordinates): Tile {
  return board[coordinates.row][coordinates.column];
}

export function setTile(
  board: Board,
  coordinates: Coordinates,
  tile: Tile
): Board {
  const newBoard = JSON.parse(JSON.stringify(board));
  newBoard[coordinates.row][coordinates.column] = tile;
  return newBoard;
}

export function removePeg(board: Board, coordinates: Coordinates): Board {
  if (getTile(board, coordinates) === PEG) {
    return setTile(board, coordinates, SPACE);
  }
  console.error("Tried to remove a peg that wasn't there", board, coordinates);
  return board;
}

export function movePeg(
  board: Board,
  from: Coordinates,
  to: Coordinates
): Board {
  if (getTile(board, from) === PEG && getTile(board, to) === SPACE) {
    if (from.row === to.row) {
      // same row move
      const colDifference = Math.abs(from.column - to.column);
      if (colDifference === 2) {
        if (from.column < to.column) {
          const pegToRemove = { row: from.row, column: from.column + 1 };
          return setTile(
            removePeg(removePeg(board, pegToRemove), from),
            to,
            PEG
          );
        } else {
          const pegToRemove = { row: from.row, column: from.column - 1 };
          return setTile(
            removePeg(removePeg(board, pegToRemove), from),
            to,
            PEG
          );
        }
      }
    } else if (from.column === to.column) {
      // same column move
      const rowDifference = Math.abs(from.row - to.row);
      if (rowDifference === 2) {
        if (from.row < to.row) {
          const pegToRemove = { row: from.row + 1, column: from.column };
          return setTile(
            removePeg(removePeg(board, pegToRemove), from),
            to,
            PEG
          );
        } else {
          const pegToRemove = { row: from.row - 1, column: from.column };
          return setTile(
            removePeg(removePeg(board, pegToRemove), from),
            to,
            PEG
          );
        }
      }
    }
    const newBoard = JSON.parse(JSON.stringify(board));
    // newBoard[coordinates.row][coordinates.column] = SPACE;
    return newBoard;
  }
  console.error("Tried to remove a peg that wasn't there");
  return board;
}

export function boardIsLegal(board: Board): boolean {
  if (board.length !== 7) {
    return false;
  }

  for (let i = 0; i < 7; i++) {
    if (board[i].length !== 7) {
      return false;
    }
  }
  return true;
}

interface Move {
  from: Coordinates;
  to: Coordinates;
}

function isPeg(b: Board, c: Coordinates): boolean {
  return b[c.row][c.column] === "peg";
}

function getCoordsOfTileType(b: Board, tileType: Tile): Coordinates[] {
  const coords: Coordinates[] = [];
  b.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell === tileType) {
        coords.push({ row: i, column: j });
      }
    });
  });
  return coords;
}

export function getMoves(b: Board): Move[] {
  const possibleMoves: Move[] = [];
  const emptySpaces: Coordinates[] = getCoordsOfTileType(b, "space");
  emptySpaces.forEach((spaceCoords) => {
    // up
    if (spaceCoords.row >= 2) {
      if (
        isPeg(b, { row: spaceCoords.row - 1, column: spaceCoords.column }) &&
        isPeg(b, { row: spaceCoords.row - 2, column: spaceCoords.column })
      ) {
        possibleMoves.push({
          from: { row: spaceCoords.row - 2, column: spaceCoords.column },
          to: spaceCoords,
        });
      }
    }
    // left
    if (spaceCoords.column >= 2) {
      if (
        isPeg(b, { row: spaceCoords.row, column: spaceCoords.column - 1 }) &&
        isPeg(b, { row: spaceCoords.row, column: spaceCoords.column - 2 })
      ) {
        possibleMoves.push({
          from: { row: spaceCoords.row, column: spaceCoords.column - 2 },
          to: spaceCoords,
        });
      }
    }
    // right
    if (spaceCoords.column <= b.length - 3) {
      if (
        isPeg(b, { row: spaceCoords.row, column: spaceCoords.column + 1 }) &&
        isPeg(b, { row: spaceCoords.row, column: spaceCoords.column + 2 })
      ) {
        possibleMoves.push({
          from: { row: spaceCoords.row, column: spaceCoords.column + 2 },
          to: spaceCoords,
        });
      }
    }
    // down
    if (spaceCoords.row <= b[0].length - 3) {
      if (
        isPeg(b, { row: spaceCoords.row + 1, column: spaceCoords.column }) &&
        isPeg(b, { row: spaceCoords.row + 2, column: spaceCoords.column })
      ) {
        possibleMoves.push({
          from: { row: spaceCoords.row + 2, column: spaceCoords.column },
          to: spaceCoords,
        });
      }
    }
  });
  return possibleMoves;
}

interface MoveHistory {
  prevMove?: MoveHistory | null;
  move: Move | null;
  boardState: Board | null;
}

let totalWalks = 0;
let bestSolution = 37;

export function solveBoard(b: Board): MoveHistory | null {
  const moves = getMoves(b);
  bestSolution = 37;
  boardCollection = [];
  let best: any;
  moves.forEach((move) => {
    console.log("Walking initial branch");
    let results = walkBoard(b, move, { boardState: b, move: move });
    if (results) {
      best = results;
    }
    console.log(results);
  });
  return best.history;
}

function walkBoard(
  b: Board,
  m: Move,
  history?: MoveHistory
): { history: MoveHistory; count: number } | void {
  const newBoard = movePeg(b, m.from, m.to);
  if (boardAlreadyChecked(newBoard)) {
    return;
  }
  totalWalks++;
  const newHistory: MoveHistory = {
    prevMove: history,
    move: m,
    boardState: newBoard,
  };
  const nextMoves = getMoves(newBoard);
  if (nextMoves.length) {
    let results: any | null;
    nextMoves.forEach((move) => {
      let best = walkBoard(newBoard, move, newHistory);
      if (best) {
        results = best;
      }
    });
    if (results) {
      console.log(results);
    }
    return results;
  } else {
    const remainingPegs = getCoordsOfTileType(newBoard, "peg").length;
    if (remainingPegs === 1) {
      console.log("Found a winner!");
    } else {
      if (totalWalks % 100000 === 0) {
        console.log(totalWalks);
      }
      if (remainingPegs < bestSolution) {
        bestSolution = remainingPegs;
        return { history: newHistory, count: bestSolution };
      }
    }
  }
}

let boardCollection: string[] = [];

function compressBoard(board: Board) {
  return JSON.stringify(board);
}

function boardAlreadyChecked(board: Board): boolean {
  let boardStr = compressBoard(board);
  if (boardCollection.indexOf(boardStr) === -1) {
    return false;
  }
  return true;
}

// function main() {
//   const board = initialBoard;
//   const newBoard = removePeg(board, { row: 0, column: 2 });
//   solveBoard(newBoard);
// }

// main();

export function compareCoordinates(
  coord1: Coordinates,
  coord2: Coordinates
): boolean {
  return coord1.column === coord2.column && coord1.row === coord2.row;
}

export function history2Boards(tailHistory: MoveHistory): Board[] {
  const boards: Board[] = [];
  let currentHistory = tailHistory;
  console.log("boom");
  console.log(currentHistory);
  while (true) {
    if (!currentHistory) {
      console.log("bap");
      break;
    }
    if (currentHistory.boardState) {
      boards.push(currentHistory.boardState);
    }
    if (!currentHistory.prevMove) {
      console.log("boom");
      break;
    }
    currentHistory = currentHistory.prevMove;
  }
  boards.reverse();
  return boards;
}
