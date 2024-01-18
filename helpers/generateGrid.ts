import { v4 as uuids4 } from 'uuid';

export type GridCellProps = {
  id: string;
  x: number;
  y: number;
  letter: string;
};

export const generateGrid = (size: number) => {
  const gridArray = [];
  let generate: GridCellProps;
  for (let j = 0; j <= size - 1; j += 1) {
    for (let i = 0; i <= size - 1; i += 1) {
      const setId = uuids4();
      generate = {
        id: setId,
        x: i * 10,
        y: j * 10,
        letter: '',
      };
      gridArray.push(generate);
    }
  }
  return gridArray;
}
