/* eslint-disable no-plusplus */
import { GridCellProps } from './generateGrid';

export const filterAnswerArray = (answerArray: GridCellProps[][]) => {
  const newAnswerArray = answerArray.filter((item) => item.length > 0);
  const removable: number[] = [];
  for (let j = 0; j < newAnswerArray.length; j++) {
    for (let i = 0; i < newAnswerArray.length; i++) {
      if (newAnswerArray[i][0].id === newAnswerArray[j][0].id && i < j) {
        removable.push(j);
      }
    }
  }

  const uniqAnswerArray = newAnswerArray.filter((_, index) => !removable.includes(index));
  return uniqAnswerArray;
};

export default filterAnswerArray;
