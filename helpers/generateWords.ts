import { GridCellProps } from "./generateGrid";

const Words = (createGrid: GridCellProps[], wordArray: any[], gridSize: number) => {
  let addedWord = 0;
  createGrid.filter((item) => item.letter !== '').forEach((item) => item.letter = '');
  let randomStaticX = Math.floor(Math.random() * gridSize) * 10;
  let randomStaticY = Math.floor(Math.random() * gridSize) * 10;
  let indexOfMatchingLetter: number = 0;
  let indexOfComparedLetter = 0;
  const filteredArray = [];

  for (let i = 0; i < wordArray.length; i++) {
    const valueX = Math.floor(Math.random() * (gridSize + 1 - wordArray[i].length)) * 10;
    const valueY = Math.floor(Math.random() * (gridSize + 1 - wordArray[i].length)) * 10;

    let filteredCells: any[] = [];
    const currentWord = wordArray[i].split('');
    if (i % 3 === 0) {
      for (let j = 0; j < wordArray[i].length * 10; j += 10) {
        filteredCells.push(createGrid.filter((cell) => cell.y === randomStaticX && cell.x === randomStaticY - indexOfComparedLetter + j && (cell.letter === '' || cell.letter === currentWord[j / 10]))[0]);
      }
    } else if (i % 2 === 0) {
      for (let j = 0; j < wordArray[i].length * 10; j += 10) {
        filteredCells.push(createGrid.filter((cell) => cell.x === randomStaticX && cell.y === randomStaticY - indexOfComparedLetter + j && (cell.letter === '' || cell.letter === currentWord[j / 10]))[0]);
      }
    } else {
      for (let j = 0; j < wordArray[i].length * 10; j += 10) {
        filteredCells.push(createGrid.filter((cell) => cell.x === valueX + j && cell.y === valueY + j && (cell.letter === '' || cell.letter === currentWord[j]))[0]);
      }
    }

    const nextWord = wordArray[i + 1] && wordArray[i + 1].split('');
    if (nextWord) {
      for (let l = 0; l < nextWord.length; l++) {
        if (currentWord.find((item: string) => item === nextWord[l]) && !filteredCells.includes(undefined)) {
          indexOfMatchingLetter = currentWord.indexOf(nextWord[l]);
          indexOfComparedLetter = nextWord.indexOf(currentWord.find((item: string) => item === nextWord[l])) * 10;

          randomStaticX = filteredCells.filter((_: any, index: number) => index === indexOfMatchingLetter)[0].x;
          randomStaticY = filteredCells.filter((_: any, index: number) => index === indexOfMatchingLetter)[0].y;
          break;
        }
      }
    }

    if (!filteredCells.includes(undefined)) {
      addedWord += 1;
      filteredCells
        .forEach((item, index) => {
          item.letter = wordArray[i][index];
        });
    } else {
      filteredCells = [];
      randomStaticX = Math.floor(Math.random() * gridSize) * 10;
      randomStaticY = Math.floor(Math.random() * gridSize) * 10;
      for (let j = 0; j < wordArray[i].length * 10; j += 10) {
        filteredCells.push(createGrid.filter((cell) => cell.x === randomStaticX + j && cell.y === randomStaticY - j && (cell.letter === '' || cell.letter === currentWord[j / 10]))[0]);
      }
      if (!filteredCells.includes(undefined)) {
        addedWord += 1;
        filteredCells
          .forEach((item, index) => {
            item.letter = wordArray[i][index];
          });
      } else {
        filteredCells = [];
        randomStaticY = Math.floor(Math.random() * gridSize) * 10;
        randomStaticX = Math.floor(Math.random() * gridSize) * 10;
        for (let j = 0; j < wordArray[i].length * 10; j += 10) {
          filteredCells.push(createGrid.filter((cell) => cell.y === randomStaticX && cell.x === randomStaticY + j && (cell.letter === '' || cell.letter === currentWord[j / 10]))[0]);
        }
        if (!filteredCells.includes(undefined)) {
          addedWord += 1;
          filteredCells
            .forEach((item, index) => {
              item.letter = wordArray[i][index];
            });
        } else {
          filteredCells = [];
        }
      }
    }
    filteredArray.push(filteredCells);
  }
  return filteredArray;
}
export default Words;