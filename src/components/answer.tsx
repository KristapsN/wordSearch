/* eslint-disable no-nested-ternary */
import style from './cell.module.scss';

type AnswerProps = {
  y: number,
  x: number,
  gridSize: number,
  length: number,
  gameFieldLength: number,
  horizontal?: boolean,
  vertical?: boolean,
  diagonalBottom?: boolean
  diagonalTop?: boolean,
}

const Answer = ({
  y, x, length, horizontal, vertical, diagonalBottom, diagonalTop, gridSize, gameFieldLength,
}: AnswerProps) => {
  const fullLength = length * (gameFieldLength / 10 / gridSize);
  return (
    <div
      className={style.answerWrapper}
      style={{
        top: `${y * (gameFieldLength / 10 / gridSize)}px`,
        left: `${x * (gameFieldLength / 10 / gridSize)}px`,
        width: `${(horizontal) ? fullLength : diagonalBottom || diagonalTop ? ((fullLength - (gameFieldLength / gridSize / 6)) * Math.sqrt(2)) : gameFieldLength / gridSize}px`,
        height: `${vertical ? fullLength : gameFieldLength / gridSize}px`,
        transform: `${diagonalBottom ? 'rotate(45deg)' : diagonalTop ? 'rotate(-45deg)' : 'rotate(0deg)'}`,
        transformOrigin: `${(gameFieldLength / gridSize / 2)}px`,
      }}
    />
  );
};

export default Answer;
