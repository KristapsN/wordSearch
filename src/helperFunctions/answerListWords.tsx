/* eslint-disable no-unused-expressions */
import { GridCellProps } from './generateGrid';

const AnswerListWords = (answerArray: GridCellProps[][] | undefined) => {
  const AnswerArray: string[] = [];

  answerArray && answerArray.forEach((item) => item.forEach((word, index) => {
    AnswerArray.push(word.letter);
    index === item.length - 1 && AnswerArray.push(' ');
  }));

  const answer = AnswerArray.join('').split(' ').filter((item) => item.length > 0);

  return answer;
};

export default AnswerListWords;
