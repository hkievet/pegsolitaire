import * as React from "react";
import styled from "styled-components";
import { Tile } from "./logic";

export interface ITileProps {
  tile: Tile;
  onClick: () => void;
  isSelected: boolean;
}

const TileContainer = styled.div`
  ${(props: { selected: boolean }) => {
    return props?.selected && `background-color: orange;`;
  }}
  width: 50px;
  height: 50px;
  &:hover {
    background-color: yellow;
    cursor: pointer;
  }
`;

const tile2emoji = {
  space: `⚪️`,
  peg: `🟢`,
  corner: `⬛️`,
};

export const TilePiece: React.FC<ITileProps> = (props) => {
  return (
    <TileContainer onClick={props.onClick} selected={props.isSelected}>
      {tile2emoji[props.tile]}
    </TileContainer>
  );
};

export default TilePiece;
