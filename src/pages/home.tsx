/* eslint-disable no-return-assign */
/* eslint-disable no-plusplus */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable react/no-array-index-key */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
import React, {
  useEffect, useState, useRef, useCallback, useContext,
} from 'react';
import './App.scss';
import ReactDOM from 'react-dom';
import { v4 as uuidv4 } from 'uuid';
import { toPng, toSvg } from 'html-to-image';
import { Loader, Modal } from '@mantine/core';
import ReactPDF, { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import arrayShuffle from 'array-shuffle';
import {
  faTrophy, faFilePdf, faFileDownload, faFileImage, faVectorSquare, faSearch, faPrint, faPerson, faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  User,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { Grid, GridCellProps } from '../helperFunctions/generateGrid';
import Cell from '../components/cell';
import 'flexboxgrid';
import Words from '../helperFunctions/generateWords';
import TextArea from '../components/textArea';
import Answer from '../components/answer';
import TextInput from '../components/textInput';
import Button from '../components/button';
import RadioButton from '../components/radioButtons';
import TabButton from '../components/tabButton';
import ToolbarButton from '../components/toolbarButton';
import DownloadPdfLink from '../components/DownloadPdfLink';
import logo from '../assets/WSM-PNG.png';
import MyDocument, { pdfSizesList } from '../components/pdfGenerator/wordSearchPdf';
import UserContext from '../UserContext';
import { auth } from '../firebaseConfig';
import PlainIconLink from '../components/plainIconLink';
import filterAnswerArray from '../helperFunctions/filterAnswerArray';

const Home = () => {
  // @ts-ignore
  const { currentUser, setCurrentUserUser } = useContext(UserContext);
  // console.log('currentUser', currentUser);
  const [gridSize, setGridSize] = useState(10);
  const [createGrid, setCreateGrid] = useState(Grid(gridSize));
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const randomCharacter = () => alphabet[Math.floor(Math.random() * alphabet.length)];
  const [wordArray, setWordArray] = useState<string[]>([]);
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  let answers:GridCellProps[][] | any[] = [];
  const [answerArray, setAnswerArray] = useState<GridCellProps[] | any[]>();
  const [showAnswers, setShowAnswers] = useState(false);
  const [success, setSuccess] = useState(false);
  const [opened, setOpened] = useState(false);
  const tabs = [
    { name: 'Content', active: true },
    { name: 'Design', active: false },
  ];
  const [activeTab, setActiveTab] = useState(tabs);
  const options = [
    { option: 10, name: '10' },
    { option: 15, name: '15' },
    { option: 20, name: '20' },
    { option: 25, name: '25' },
  ];
  const [pdfSize, setPdfSize] = useState<[number, number]>(pdfSizesList[0].size);
  const pdfSizes = pdfSizesList;

  const tabHandler = (name: string) => {
    const newTabs = [...tabs];
    tabs.forEach((tab) => {
      if (tab.name === name) {
        tab.active = true;
      } else { tab.active = false; }
    });
    setActiveTab(newTabs);
  };

  const generateLetterGrid = () => {
    const newLetterGrid = [...createGrid];
    // unusedCells.forEach((item) => { item.letter = randomCharacter(); });
    const unusedWordIndexes: number[] = [];
    answers.map((item, index) => item.length === 0 && unusedWordIndexes.push(index));
    const unusedWords = wordArray.filter((_, index) => unusedWordIndexes.includes(index));

    const minUnusedWordsLength = Math.min(...unusedWords.map((str) => str.length));

    const allFreeSpaces: any[][] = [];
    let freeSpace: any[] = [];

    if (unusedWords.length > 0) {
      createGrid.map((item) => {
        if (item.letter !== '') {
          if (freeSpace.length > 0) { allFreeSpaces.push(freeSpace); }
          freeSpace = [];
        } else if (freeSpace.length > 0) {
          if (freeSpace[0].y !== item.y) {
            allFreeSpaces.push(freeSpace);
            freeSpace = [];
          } else { freeSpace.push(item); }
        } else {
          freeSpace.push(item);
        }
      });

      const arrayEquals = (a: any[], b: string | any[]) => Array.isArray(a)
          && Array.isArray(b)
          && a.length === b.length
          && a.every((val, index) => val === b[index]);

      const filteredAllFreeSpaces = allFreeSpaces.filter((spaces) => spaces.length >= minUnusedWordsLength);
      for (let i = 0; i < unusedWords.length; i++) {
        const wordSpaceOptions = filteredAllFreeSpaces.filter((spaces) => spaces.length >= unusedWords[i].length);

        if (wordSpaceOptions.length === 1) {
          wordSpaceOptions[0].forEach((space, index) => space.letter = unusedWords[i][index]);

          if (unusedWords[i].length < wordSpaceOptions[0].length) {
            // @ts-ignore
            answers.push(wordSpaceOptions[0].splice(0, unusedWords[i].length));
          } else {
            // @ts-ignore
            answers.push(wordSpaceOptions[0]);
          }

          filteredAllFreeSpaces.forEach((item, index) => arrayEquals(wordSpaceOptions[0], item) && filteredAllFreeSpaces.splice(index, 1));
        } else if (wordSpaceOptions.length > 1) {
          const randomSpaceNumber = Math.floor(Math.random() * wordSpaceOptions.length);
          wordSpaceOptions[randomSpaceNumber].forEach((space, index) => space.letter = unusedWords[i][index]);

          if (unusedWords[i].length < wordSpaceOptions[randomSpaceNumber].length) {
            // @ts-ignore
            answers.push(wordSpaceOptions[randomSpaceNumber].splice(0, unusedWords[i].length));
          } else {
            // @ts-ignore
            answers.push(wordSpaceOptions[randomSpaceNumber]);
          }

          wordSpaceOptions.splice(randomSpaceNumber, 1);
          filteredAllFreeSpaces.forEach((item, index) => arrayEquals(wordSpaceOptions[0], item) && filteredAllFreeSpaces.splice(index, 1));
        }
      }
    }

    setAnswerArray(filterAnswerArray(answers).filter((item) => item !== undefined && item.length > 1));

    const unusedCells = createGrid.filter((item) => item.letter === '' || item.letter === undefined);
    unusedCells.forEach((item) => { item.letter = randomCharacter(); });
    setCreateGrid(newLetterGrid);
  };

  const selectHandler = (option: number) => {
    setGridSize(option);
    setAnswerArray([]);
    setShowAnswers(false);
  };
  const sizeHandler = (size: [number, number]) => {
    setPdfSize(size);
  };

  const ref = useRef<HTMLDivElement>(null);
  const wordSearchRef = useRef<HTMLDivElement>(null);

  const [imageUrls, setImageUrls] = useState<string>('');
  const [wordSearchImageUrl, setWordSearchImageUrl] = useState<string>('');
  const [pngUrl, setPngUrl] = useState<HTMLAnchorElement>();
  const [svgUrl, setSvgUrl] = useState<HTMLAnchorElement>();

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [gameFieldLength, setGameFieldLength] = useState(window.screen.availWidth);

  const screenSizeChangeHandler = () => { setGameFieldLength(window.screen.availWidth); };
  window.addEventListener('resize', screenSizeChangeHandler);

  const wordSearchImageHight = (lineWidth: number) => {
    const wordSearchLines = wordArray.length / 4;

    switch (Math.ceil(wordSearchLines)) {
      case 1:
        return lineWidth / 8.4;
      case 2:
        return lineWidth / 5.9;
      case 3:
        return lineWidth / 4.5;
      case 4:
        return lineWidth / 3.6;
      case 5:
        return lineWidth / 3;
      case 6:
        return lineWidth / 2.6;
      case 7:
        return lineWidth / 2.3;
      case 8:
        return lineWidth / 2;
      default:
        return 140;
    }
  };

  const previewPageHight = (size: any) => size[1] / size[0];

  const loadImageAsDataURL = (url: string, renderWidth: number, renderHeight: number) => new Promise<string>((resolve, reject) => {
    const img = new Image();
    img.onload = function () {
      const canvas = document.createElement('canvas');
      canvas.width = renderWidth;
      canvas.height = renderHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, renderWidth, renderHeight);
      resolve(canvas.toDataURL());
    };
    img.onerror = reject;
    img.src = url;
  });

  const onPdfGenerate = useCallback(() => {
    if (ref.current === null) {
      return;
    }

    toSvg(ref.current, { cacheBust: true })
      .then((dataUrl: string) => {
        const link = document.createElement('a');
        link.download = 'my-image-name.svg';
        link.href = dataUrl;
        setSvgUrl(link);
        async function asyncCall() {
          const result: string = await loadImageAsDataURL(link.href, 1204, 1204);
          setImageUrls(result);
        }
        asyncCall();
      });

    toPng(ref.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'my-image-name.png';
        link.href = dataUrl;
        setPngUrl(link);
        // png = link.href;
        // setImageUrls(link.href);
        // console.log('imageUrls', imageUrls);
        // link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  }, [ref]);

  const onWordSearchListGenerate = useCallback(() => {
    if (wordSearchRef.current === null) {
      return;
    }

    toSvg(wordSearchRef.current, { cacheBust: true })
      .then((dataUrl: string) => {
        const link = document.createElement('a');
        // link.download = 'my-image-name.svg';
        link.href = dataUrl;
        setSvgUrl(link);
        async function asyncCall() {
          const result: string = await loadImageAsDataURL(link.href, 1204, wordSearchImageHight(1204));
          setWordSearchImageUrl(result);
        }
        asyncCall();
      });
  }, [wordSearchRef]);

  const generateWordSearch = () => {
    const newGrid = [...createGrid];
    setCreateGrid(Grid(gridSize));
    for (let i = 0; i < 1; i += 1) {
      answers = Words(createGrid, wordArray, gridSize);
      // if (answers.length !== wordArray.length) {
      //   setCreateGrid(Grid(gridSize));
      //   setSuccess(false);
      // } else {

      setCreateGrid(newGrid);
      // setAnswerArray(answers.filter((item) => item.length !== 0));
      setSuccess(true);
      // break;
      // }
    }
  };
  // console.log('answerArray', answerArray, 'answers', answers);
  const setValue = () => {
    const textArray = text.toLowerCase().split((/\s+/)).filter((word) => word !== '');
    setWordArray(arrayShuffle(textArray));

    if (subtitle.length === 0) {
      setSubtitle(' ');
    }
    if (title.length === 0) {
      setTitle(' ');
    }
  };

  const downloadGenerateHandler = () => {
    onPdfGenerate();
    onWordSearchListGenerate();
    setOpened(true);
  };

  useEffect(() => {
    generateWordSearch();
    if (wordArray.length !== 0 && wordArray.length === answers.length) {
      generateLetterGrid();
    }
    // setAnswerArray()
    // console.log('answerArray', answerArray, 'answers', answers);
  }, [wordArray]);

  useEffect(() => {
    setCreateGrid(Grid(gridSize));
  }, [gridSize]);

  const tooLongWords = wordArray.filter((word) => word.length >= gridSize);

  onAuthStateChanged(auth, (registeredUser) => {
    setCurrentUserUser(registeredUser);
  });

  const login = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      setLoginEmail('');
      setLoginPassword('');
    } catch (error: any) {
      setLoginError(error);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <div>
      <div className="wrapper">
        <div className="row">
          <div className="col-md-6">
            <img src={logo} alt="logo" className="logo" />
          </div>
          <div className="col-md-3">
            <span />
          </div>
          <div className="col-md-3">
            <PlainIconLink name="Profile" clickHandler={() => setModalOpen(!modalOpen)} icon={faUser} />
            {modalOpen
            && (
            <div className="login--modal">
              {!currentUser
                ? (
                  <>
                    <TextInput value={loginEmail} label="E-mail: " textChangeHandler={(e) => setLoginEmail(e.target.value)} placeholder="E-mail" />
                    <TextInput value={loginPassword} label="Password: " textChangeHandler={(e) => setLoginPassword(e.target.value)} placeholder="Password" />
                    {loginError && <span>Email or password incorrect</span>}
                    <Button mainStyle name="Login" clickHandler={() => login()} />
                  </>
                )
                : (
                  <>
                    <span>You are logedin</span>
                    <Button mainStyle name="logout" clickHandler={() => logout()} />
                  </>
                )}
            </div>
            )}
          </div>
        </div>
      </div>
      {/* <div className="preview--wrapper">
        <PDFViewer className="preview" showToolbar={false}>
          <MyDocument imageUrl={imageUrls} title={title} subtitle={subtitle} wordArray={wordArray} size={pdfSize} />
        </PDFViewer>
      </div> */}
      <div className="wrapper">
        <div className="row">
          <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12">
            <div className="tab--wrapper">
              {activeTab.map((tab) => (
                <TabButton
                  key={uuidv4()}
                  name={tab.name}
                  clickHandler={() => tabHandler(tab.name)}
                  active={tab.active}
                />
              ))}
            </div>
            {activeTab[0].active
            && (
            <div className="generator--wrapper">
              <div className="wrapper">
                <div className="row">
                  <div className="col-md-12 col-xs-12">
                    <span className="radio--label-wrapper">Grid size:</span>
                    <div className="radio--wrapper">
                      {options.map(({ name, option }) => <RadioButton key={uuidv4()} name={name} checked={option === gridSize} label={name} value={name} radioHandler={() => selectHandler(option)} />) }
                    </div>
                  </div>
                  <div className="col-md-12 col-xs-12">
                    <span className="radio--label-wrapper">Print size:</span>
                    <div className="radio--wrapper">
                      { pdfSizes.map(({ name, size }) => <RadioButton key={uuidv4()} name={name} checked={size === pdfSize} label={name} value={name} radioHandler={() => sizeHandler(size)} />) }
                    </div>
                  </div>
                </div>
              </div>
              <div className="setting--wrapper">
                <TextInput letterCount value={title} label="Title: " textChangeHandler={(e) => setTitle(e.target.value)} maxLength={30} placeholder="Your title" />
                <TextArea letterCount value={subtitle} label="Description:" textChangeHandler={(e) => setSubtitle(e.target.value)} maxLength={100} placeholder="Description" />
                <TextArea bigText value={text} label="Word list:" textChangeHandler={(e) => setText(e.target.value)} error={!success} tooLong={tooLongWords} />
                <div style={{ display: 'flex' }}>
                  <div style={{ marginRight: 10 }}>
                    <Button
                      mainStyle
                      name="Generate words"
                      clickHandler={() => setValue()}
                    />
                  </div>
                  <div>
                    <Button
                      name={!showAnswers ? 'Show answers' : 'Hide answers'}
                      clickHandler={() => setShowAnswers(!showAnswers)}
                      disabled={!success}
                    />
                  </div>
                </div>
              </div>
            </div>
            )}
          </div>
          <div className="col-lg-8 col-md-8 col-sm-6 col-xs-12">
            <Modal title="Download as:" onClose={() => setOpened(false)} opened={opened}>
              {imageUrls ? (
                <div className="modal--download--button--wrapper">
                  {imageUrls && (
                  <DownloadPdfLink
                    imageUrls={imageUrls}
                    title={title}
                    subtitle={subtitle}
                    listHeight={wordSearchImageHight(450)}
                    size={pdfSize}
                    wordSearchImageUrl={wordSearchImageUrl}
                    disabled={!success}
                    imageWidth={pdfSize[0] * 0.75}
                  />
                  )}
                  {pngUrl && <ToolbarButton name="PNG" clickHandler={() => pngUrl?.click()} icon={faFileImage} disabled={!success} />}
                  {svgUrl && <ToolbarButton name="SVG" clickHandler={() => svgUrl?.click()} icon={faVectorSquare} disabled={!success} /> }
                </div>
              )
                : (
                  <div style={{ textAlign: 'center' }}>
                    <Loader />
                  </div>
                )}
            </Modal>
            <div className="edit--background">
              <div className="download--button--wrapper" style={{ width: `${gameFieldLength / 3}px` }}>
                <Button mainStyle name="Download" clickHandler={() => downloadGenerateHandler()} disabled={!success} />
              </div>
              <div
                className="grid--wrapper"
                style={{
                  width: `${gameFieldLength / 3}px`,
                  height: `${(gameFieldLength / 3) * previewPageHight(pdfSize)}px`,
                  fontSize: `${gameFieldLength / 30}px`,
                }}
              >
                <h2 style={{ width: gameFieldLength / 4 }}>{title.length === 0 ? 'Your title' : title}</h2>
                <div style={{ width: gameFieldLength / 4 }} className="description--wrapper"><p className="description">{subtitle.length === 0 ? 'Some description or subtitle' : subtitle }</p></div>
                <div
                  className="grid--width"
                  // style={{ width: `${gameFieldLength / 3}px`, height: `${(gameFieldLength / 3) * 1.4142}px` }}
                >
                  <div
                    className="game--grid"
                    style={{ width: `${gameFieldLength / 4 + 4}px`, height: `${gameFieldLength / 4 + 4}px` }}
                    ref={ref}
                  >
                    {console.log('answers array !!!', answerArray)}
                    {answerArray?.map((item) => (
                      <React.Fragment key={uuidv4()}>
                        {showAnswers && success
                  && (
                  <Answer
                    x={item[0].x}
                    y={item[0].y}
                    gridSize={gridSize}
                    length={item.length * 10}
                    horizontal={item[0].y === item[1].y}
                    vertical={item[0].x === item[1].x}
                    diagonalBottom={(item[0].y < item[1].y) && (item[0].x < item[1].x)}
                    diagonalTop={(item[0].y > item[1].y) && (item[0].x < item[1].x)}
                    gameFieldLength={gameFieldLength / 4}
                  />
                  )}
                      </React.Fragment>
                    ))}
                    {createGrid.map((item) => (
                      <Cell
                        key={uuidv4()}
                        letter={item.letter}
                        y={item.y}
                        x={item.x}
                        gridSize={gridSize}
                        gameFieldLength={gameFieldLength / 4}
                      />
                    ))}
                  </div>
                </div>
                <div className="searchable--names" style={{ width: gameFieldLength / 4 }} ref={wordSearchRef}>
                  <div className="searchable--names--column">
                    <ul className="column--list">
                      {wordArray.filter((_, index) => index < wordArray.length / 4).map((word) => <li key={uuidv4()}>{word.toUpperCase()}</li>)}
                    </ul>
                  </div>
                  <div className="searchable--names--column">
                    <ul className="column--list">
                      {wordArray?.filter((_, index) => index >= wordArray.length / 4 && index < (wordArray.length / 4) * 2).map((word) => <li key={uuidv4()}>{word.toUpperCase()}</li>)}
                    </ul>
                  </div>
                  <div className="searchable--names--column">
                    <ul className="column--list">
                      {wordArray?.filter((_, index) => index > wordArray.length / 4 && index >= (wordArray.length / 4) * 2 && index < (wordArray.length / 4) * 3).map((word) => <li key={uuidv4()}>{word.toUpperCase()}</li>)}
                    </ul>
                  </div>
                  <div className="searchable--names--column">
                    <ul className="column--list">
                      {wordArray.filter((_, index) => index >= (wordArray.length / 4) * 3).map((word) => <li key={uuidv4()}>{word.toUpperCase()}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
