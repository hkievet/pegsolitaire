import * as React from "react";
import { Board } from "./logic";
import { BoardContainer, BoardRow } from "./PegBoard";
import TilePiece from "./TilePiece";

export interface IBoardViewerProps {
  boards: Board[];
}

export const BoardViewer: React.FC<IBoardViewerProps> = (props) => {
  const [boardIndex, setBoardIndex] = React.useState(0);
  const board = props.boards[boardIndex];

  const forward = () => {
    if (boardIndex + 1 < props.boards.length) {
      setBoardIndex(boardIndex + 1);
    }
  };

  const backward = () => {
    if (boardIndex - 1 > 0) {
      setBoardIndex(boardIndex - 1);
    }
  };

  const rows = board.map((row, i) => {
    const tiles = row.map((tile, j) => {
      return (
        <TilePiece
          onClick={() => {}}
          tile={tile}
          key={`${i}-${j}-${tile}`}
          isSelected={false}
        />
      );
    });
    return <BoardRow key={`Ro${i}`}>{tiles}</BoardRow>;
  });

  return (
    <>
      <BoardContainer>{rows}</BoardContainer>
      <button onClick={backward}>Back</button>
      <button onClick={forward}>Forward</button>
    </>
  );
};

export default BoardViewer;
