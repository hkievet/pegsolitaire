import * as React from "react";
import styled from "styled-components";
import BoardViewer from "./BoardViewer";
import {
  Board,
  boardIsLegal,
  compareCoordinates,
  Coordinates,
  getMoves,
  getTile,
  history2Boards,
  initialBoard,
  movePeg,
  PEG,
  removePeg,
  solveBoard,
  SPACE,
} from "./logic";
import TilePiece from "./TilePiece";

export interface IBoardProps {}

export const BoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  width: fit-content;
  margin-top: 60px;
`;

export const BoardRow = styled.div`
  display: flex;
  flex-direction: row;
`;

export const PegBoard: React.FC<IBoardProps> = (props) => {
  const [boards, setBoards] = React.useState<Board[] | null>();
  const [gameStarted, setGameStarted] = React.useState(false);
  const [selectedPeg, setSelectedPeg] = React.useState<Coordinates | null>(
    null
  );
  const [board, setBoard] = React.useState(initialBoard);
  const handleClick = (i: number, j: number) => {
    const coordinates = { row: i, column: j };
    const tileValue = getTile(board, coordinates);
    const validMove = getMoves(board).find((move) => {
      return compareCoordinates(coordinates, move.from);
    });
    if (!gameStarted) {
      if (tileValue === PEG) {
        const newBoard = removePeg(board, coordinates);
        setBoard(newBoard);
        setGameStarted(true);
      }
    } else if (!selectedPeg && validMove) {
      if (tileValue === PEG) {
        setSelectedPeg(coordinates);
      }
    } else if (selectedPeg) {
      if (tileValue === SPACE) {
        setBoard(movePeg(board, selectedPeg, coordinates));
        setSelectedPeg(null);
      }
    }
  };

  const rows = board.map((row, i) => {
    const tiles = row.map((tile, j) => {
      return (
        <TilePiece
          onClick={() => {
            handleClick(i, j);
          }}
          tile={tile}
          key={`${i}-${j}-${tile}`}
          isSelected={
            !!selectedPeg && selectedPeg.column === j && selectedPeg.row === i
          }
        />
      );
    });
    return <BoardRow key={`Ro${i}`}>{tiles}</BoardRow>;
  });

  const reset = () => {
    setGameStarted(false);
    setSelectedPeg(null);
    setBoard(initialBoard);
    setBoards(null);
  };

  const solve = () => {
    const result = solveBoard(board);
    if (result) {
      setBoards(history2Boards(result));
    }
  };

  if (!boardIsLegal(board)) {
    console.error("board not legal");
  }

  return (
    <>
      <BoardContainer>{rows}</BoardContainer>
      {!gameStarted && <p>Selected a peg to remove it and start the game!</p>}
      <button onClick={reset}>Reset</button>
      <button onClick={solve}>Solve (experimental)</button>
      {boards && <BoardViewer boards={boards} />}
    </>
  );
};

export default PegBoard;
