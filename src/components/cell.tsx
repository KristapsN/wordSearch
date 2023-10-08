import './cell.css';

type Props = {
  letter: string,
  y: number,
  x: number,
  gridSize: number,
  gameFieldLength: number
}

const Cell = ({
  letter, y, x, gridSize, gameFieldLength,
}: Props) => (
  <div
    className="cellWrapper"
    style={{
      top: `${y * (gameFieldLength / 10 / gridSize)}px`,
      left: `${x * (gameFieldLength / 10 / gridSize)}px`,
      width: gameFieldLength / gridSize,
      height: gameFieldLength / gridSize,
      // fontSize: `${fontSize}px`,
    }}
  >
    <span className="cell">{letter}</span>
  </div>
);

export default Cell;
