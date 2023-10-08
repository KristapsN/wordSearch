/* eslint-disable no-unused-expressions */
/* eslint-disable react/jsx-props-no-spreading */
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
import './App.css';
import { v4 as uuidv4 } from 'uuid';
import { toPng, toSvg } from 'html-to-image';
import { Loader, Modal } from '@mantine/core';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useSnackbar, VariantType } from 'notistack';
import Draggable from 'react-draggable';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import ReactPDF, { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import arrayShuffle from 'array-shuffle';
import {
  faFileImage, faVectorSquare, faUser,
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import {
  ref, set, onValue,
} from 'firebase/database';
import {
  onAuthStateChanged,
} from 'firebase/auth';
import { Grid, GridCellProps } from '../helperFunctions/generateGrid';
import Cell from '../components/cell';
import 'flexboxgrid';
import Words from '../helperFunctions/generateWords';
import Answer from '../components/answer';
import TextInput from '../components/textInput';
import Button from '../components/button';
import ToolbarButton from '../components/toolbarButton';
import DownloadPdfLink from '../components/DownloadPdfLink';
// import logo from '../assets/WSM-PNG.png';
import MyDocument, { pdfSizesList } from '../components/pdfGenerator/wordSearchPdf';
import UserContext from '../UserContext';
import { auth, database } from '../firebaseConfig';
import PlainIconLink from '../components/plainIconLink';
import filterAnswerArray from '../helperFunctions/filterAnswerArray';
import AnswerListWords from '../helperFunctions/answerListWords';
import freeSpaceFilter from '../helperFunctions/freeSpaceFilter';
import fillInHorizontalAnswer from '../helperFunctions/fillInHorizontalAnswers';
import freeVerticalSpaceFilter from '../helperFunctions/freeVerticalSpaceFilter';
import TabPanel from '../components/tabs';
import ToggleGroup, { toggleOption } from '../components/tougleGroup';
import SliderInput from '../components/slider';
import ColorPicker from '../components/colorPicker';
import FontPickerField from '../components/fontPicker';
import IconList from '../components/iconList';
import CurrentDate from '../helperFunctions/currentDate';
import {
  login, logout, register, resetPassword,
} from '../helperFunctions/authentication';

const Home = () => {
  // @ts-ignore
  const { currentUser, setCurrentUserUser } = useContext(UserContext);
  const [gridSize, setGridSize] = useState(20);
  const [createGrid, setCreateGrid] = useState(Grid(gridSize));
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const randomCharacter = () => alphabet[Math.floor(Math.random() * alphabet.length)];
  const [wordArray, setWordArray] = useState<string[]>([]);
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  let answers:GridCellProps[][] | any[] = [];
  const [answerArray, setAnswerArray] = useState<GridCellProps[][]>();
  const [showAnswers, setShowAnswers] = useState(false);
  const [success, setSuccess] = useState(false);
  const [opened, setOpened] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const options: toggleOption[] = [
    { size: 10, name: '10' },
    { size: 15, name: '15' },
    { size: 20, name: '20' },
    { size: 25, name: '25' },
  ];
  const [pdfSize, setPdfSize] = useState<[number, number]>(pdfSizesList[0].size);
  const pdfSizes: toggleOption[] = pdfSizesList;

  const action = (snackbarId: any) => {
    const { closeSnackbar } = useSnackbar();
    return (
      <>
        <IconButton size="small" onClick={() => closeSnackbar(snackbarId)}>
          <CloseIcon fontSize="inherit" />
        </IconButton>
      </>
    );
  };

  const handleAlertOpen = (message: string, variant: VariantType) => {
    enqueueSnackbar(message, { variant, persist: true, action });
  };

  const generateLetterGrid = () => {
    const newLetterGrid = [...createGrid];
    const unusedWordIndexes: number[] = [];
    answers.map((item, index) => item.length === 0 && unusedWordIndexes.push(index));
    const unusedWords = wordArray.filter((_, index) => unusedWordIndexes.includes(index));

    if (unusedWords.length > 0) {
      // FIlter free horizontal spaces and fill them with unused words
      const filterVerticalSpaces = freeVerticalSpaceFilter(unusedWords, createGrid);
      answers = fillInHorizontalAnswer(unusedWords, answers, filterVerticalSpaces);

      const filteredHorizontalFreeSpaces = freeSpaceFilter(unusedWords, createGrid);
      answers = fillInHorizontalAnswer(unusedWords, answers, filteredHorizontalFreeSpaces);
    }

    setAnswerArray(filterAnswerArray(answers));
    const unusedCells = createGrid.filter((item) => item.letter === '' || item.letter === undefined);

    unusedCells.forEach((item) => { item.letter = randomCharacter(); });
    setCreateGrid(newLetterGrid);
  };

  // Download file generation ---
  const reference = useRef<HTMLDivElement>(null);
  const wordSearchRef = useRef<HTMLDivElement>(null);
  const wordSearchFullPage = useRef<HTMLDivElement>(null);

  const [imageUrls, setImageUrls] = useState<string>('');
  const [wordSearchImageUrl, setWordSearchImageUrl] = useState<string>('');
  const [pngUrl, setPngUrl] = useState<HTMLAnchorElement>();
  const [svgUrl, setSvgUrl] = useState<HTMLAnchorElement>();

  const [modalOpen, setModalOpen] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [gameFieldLength, setGameFieldLength] = useState(window.screen.availWidth);
  const [gameFieldHeight, setGameFieldHeight] = useState(window.innerHeight);

  const screenSizeChangeHandler = () => { setGameFieldLength(window.screen.availWidth); };
  window.addEventListener('resize', screenSizeChangeHandler);

  const screenHeightChangeHandler = () => { setGameFieldHeight(window.innerHeight); };
  window.addEventListener('resize', screenHeightChangeHandler);

  const previewPageHight = (size: any) => size[1] / size[0];

  const loadImageAsDataURL = (url: string, renderWidth: number, renderHeight: number) => new Promise<string>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
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
    if (reference.current === null) {
      return;
    }

    toSvg(reference.current, { cacheBust: true })
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

    toPng(reference.current, { cacheBust: true })
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
        handleAlertOpen(err, 'warning');
      });
  }, [reference]);

  // full pages swg render ---

  const onWordSearchListGenerate = useCallback(() => {
    if (wordSearchFullPage.current === null) {
      return;
    }

    toSvg(wordSearchFullPage.current, { cacheBust: true })
      .then((dataUrl: string) => {
        const link = document.createElement('a');
        // link.download = 'my-image-name.svg';
        link.href = dataUrl;
        // setSvgUrl(link);
        async function asyncCall() {
          const result: string = await loadImageAsDataURL(link.href, gameFieldLength * 3, gameFieldLength * previewPageHight(pdfSize) * 3);
          // wordSearchImageHight(1204)
          setWordSearchImageUrl(result);
        }
        asyncCall();
      });
  }, [wordSearchFullPage]);
  // ---

  const handleCloseDownloadModal = () => {
    setPngUrl(undefined);
    setSvgUrl(undefined);
    setWordSearchImageUrl('');
    setOpened(false);
  };

  //  ----

  const tooLongWords = wordArray.filter((word) => word.length >= gridSize);

  const generateWordSearch = () => {
    const newGrid = [...createGrid];
    setCreateGrid(Grid(gridSize));
    for (let i = 0; i < 1; i += 1) {
      answers = Words(createGrid, wordArray, gridSize);

      setCreateGrid(newGrid);
      setSuccess(true);

      if (tooLongWords.length > 0) {
        handleAlertOpen(`These words are too long: ${tooLongWords.join(', ')}`, 'warning');
      }
    }
  };

  const puzzleGenerated = useRef(false);

  const setValue = () => {
    const textArray = text.toLowerCase().split((/\s+/)).filter((word) => word !== '');
    setWordArray(arrayShuffle(textArray));
    puzzleGenerated.current = true;
    if (textArray.length !== 0 && subtitle.length === 0) {
      setSubtitle(' ');
    }
    if (textArray.length !== 0 && title.length === 0) {
      setTitle(' ');
    }
  };

  useEffect(() => {
    generateWordSearch();
    if (wordArray.length !== 0 && wordArray.length === answers.length) {
      generateLetterGrid();
    }
  }, [wordArray]);

  useEffect(() => {
    setCreateGrid(Grid(gridSize));
    setValue();
  }, [gridSize]);

  const usedAnswers = answerArray ? AnswerListWords(answerArray) : [];

  useEffect(() => {
    const notIncludedWords = wordArray.filter((obj) => usedAnswers.indexOf(obj) === -1);

    if (usedAnswers.length < wordArray.length && answerArray !== undefined && answerArray?.length > 0) {
      handleAlertOpen(`We were not able to include these words: ${notIncludedWords.join(', ')}`, 'warning');
    }
  }, [answerArray]);

  // Radio button handlers ---
  const selectHandler = (option: string | React.SetStateAction<number>) => {
    const chosenSize = options.find((element) => element.name === option);
    setGridSize(chosenSize?.size as number);
    setAnswerArray([]);
    setShowAnswers(false);
  };
  const sizeHandler = (size: string | React.SetStateAction<[number, number]>) => {
    const chosenSize = pdfSizes.find((element) => element.name === size);
    setPdfSize(chosenSize?.size as [number, number]);
  };

  // Tab controls ---
  const [tabValue, setTsbValue] = useState(0);
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTsbValue(newValue);
  };
  // ---

  const currentDate = CurrentDate();
  const [numberOfDownloads, setNumberOfDownloads] = useState(0);

  // local storage --

  // interface LocalDownloadProps {
  //   localDownloadCount: number
  //   localDownloadDate: string
  // }

  // const localDownloads: LocalDownloadProps = localStorage.localDownloadData ? JSON.parse(localStorage.localDownloadData) : { localDownloadDate: currentDate, localDownloadCount: 0 };
  // localStorage.localDownloadData = JSON.stringify(localDownloads);

  // const writeLocalDatabase = () => {
  //   if (localDownloads.localDownloadDate === currentDate) {
  //     setNumberOfDownloads(numberOfDownloads);
  //     localStorage.localDownloadData = JSON.stringify({ localDownloadDate: currentDate, localDownloadCount: numberOfDownloads + 1 });
  //   } else {
  //     localStorage.localDownloadData = JSON.stringify({ localDownloadDate: currentDate, localDownloadCount: numberOfDownloads });
  //   }
  // };
  // ---

  // write in DB ---

  const writeInDataBase = (userId: string, date: string, count: number) => {
    const referenceDb = ref(database, `users/${userId}/downloads`);
    set(referenceDb, {
      downloadDate: date,
      count,
    });
  };

  //-

  const [anonymousUserIp, setAnonymousUserIp] = useState('');

  // Get data from DB ---

  const getCurrentNumberOfDownloads = (userId: string) => {
    const starCountRef = ref(database, `users/${userId}/downloads`);
    onValue(starCountRef, async (snapshot) => {
      try {
        const data = await snapshot.val();
        if (data === null) {
          writeInDataBase(userId, currentDate, 0);
        }
        setNumberOfDownloads(data?.count);
        if (data?.downloadDate !== undefined && data?.downloadDate !== currentDate) {
          writeInDataBase(userId, currentDate, 0);
        }
      } catch (error: any) {
        setLoginError(error);
      }
    });
  };

  // Registration/ login ---

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerView, setRegisterView] = useState(false);

  onAuthStateChanged(auth, (registeredUser) => {
    setCurrentUserUser(registeredUser);
  });

  useEffect(() => {
    if (currentUser?.uid !== undefined) {
      getCurrentNumberOfDownloads(currentUser?.uid);
    } else {
      axios.get('https://api.ipify.org')
        .then((response) => {
          const ipAddress: string | undefined = response?.data;
          ipAddress !== undefined && setAnonymousUserIp(ipAddress.split('.').join(''));
          ipAddress !== undefined && getCurrentNumberOfDownloads(ipAddress.split('.').join(''));
        });
    }
  }, [currentUser]);

  const [comparePassword, setComparePassword] = useState('');

  // ----

  // Download --

  const downloadGenerateHandler = () => {
    onPdfGenerate();
    onWordSearchListGenerate();
    setOpened(true);
    if (currentUser === null || currentUser === undefined) {
      writeInDataBase(anonymousUserIp, currentDate, numberOfDownloads + (puzzleGenerated.current ? 1 : 0));
    } else {
      writeInDataBase(currentUser.uid, currentDate, numberOfDownloads + (puzzleGenerated.current ? 1 : 0));
    }
    puzzleGenerated.current = false;
  };

  // game grid border ---
  const initialColor = '#000000';
  const [swatchOpen, setSwatchOpen] = useState(false);
  const [borderColor, setBorderColor] = useState(initialColor);
  const [gridBorderSize, setGridBorderSize] = useState(2);

  // font pickers ---
  const [titleFont, setTitleFont] = useState('Poppins');
  const [subtitleFont, setSubtitleFont] = useState('Poppins');

  // font sizes ---
  const [answerSize, setAnswerSize] = useState(1);

  // -- fit constructor in screen
  const heightDifference = (gameFieldHeight * 0.80) - ((gameFieldLength / 3) * previewPageHight(pdfSize));
  const widthDifference = (841.89 - pdfSize[1]) / 10;
  const pdfPreviewBaseSize = (gameFieldLength + heightDifference - widthDifference);

  const [editPageScale, setEditPageScale] = useState(1);

  return (
    <div className="full-page-wrapper">
      <div className="wrapper">
        <div className="row">
          <div className="col-md-6">
            {/* <img src={logo} alt="logo" className="logo" /> */}
          </div>
          <div className="col-md-3">
            <span />
          </div>
          <div className="col-md-3">
            <PlainIconLink name="Profile" clickHandler={() => setModalOpen(!modalOpen)} icon={faUser} />
            <Modal title="Login/ Register" onClose={() => setModalOpen(!modalOpen)} opened={modalOpen}>
              {!currentUser
                ? (
                  <div className="login--modal">
                    <TextInput
                      type="email"
                      value={loginEmail}
                      label="E-mail: "
                      textChangeHandler={(e) => setLoginEmail(e.target.value)}
                      placeholder="E-mail"
                    />
                    <TextInput
                      type="password"
                      value={loginPassword}
                      label="Password: "
                      textChangeHandler={(e) => setLoginPassword(e.target.value)}
                      placeholder="Password"
                    />
                    {registerView
                    && (
                    <TextInput
                      type="password"
                      value={comparePassword}
                      label="Confirm password: "
                      textChangeHandler={(e) => setComparePassword(e.target.value)}
                      placeholder="Confirm password"
                    />
                    )}
                    {loginError && <span>{loginError}</span>}
                    {!registerView
                      && (
                      <Button
                        variant="contained"
                        name="Login"
                        clickHandler={() => login(loginEmail, loginPassword, setLoginEmail, setLoginPassword, setLoginError)}
                      />
                      )}
                    {registerView
                      && (
                      <Button
                        variant="contained"
                        name="Register"
                        clickHandler={() => register(comparePassword, loginPassword, loginEmail, setLoginEmail, setLoginPassword, setLoginError, setComparePassword)}
                      />
                      )}
                    <Button name={registerView ? 'Sign in' : 'Create account'} clickHandler={() => setRegisterView(!registerView)} />
                    {!registerView && <Button variant={undefined} name="Forgot password" clickHandler={() => resetPassword(loginEmail, setLoginError)} />}
                  </div>
                )
                : (
                  <>
                    <span>You are logged in</span>
                    <Button variant="outlined" name="logout" clickHandler={() => logout()} />
                  </>
                )}
            </Modal>
          </div>
        </div>
      </div>
      <div className="wrapper">
        <div className="row full--height">
          <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12 options-wrapper full--height">
            <div className="tab--wrapper">
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
                  <Tab label="Generator" />
                  <Tab label="Design" />
                </Tabs>
              </Box>
            </div>
            <TabPanel value={tabValue} index={0}>
              <div className="generator--wrapper">
                <div className="wrapper">
                  <div className="row">
                    <div className="col-md-12 col-xs-12">
                      <span className="radio--label-wrapper">Grid size:</span>
                      <div className="radio--wrapper">
                        <ToggleGroup
                          value={gridSize}
                          // @ts-ignore
                          radioHandler={(e) => selectHandler(e.target.value)}
                          options={options}
                        />
                      </div>
                    </div>
                    <div className="col-md-12 col-xs-12">
                      <span className="radio--label-wrapper">Print size:</span>
                      <div className="radio--wrapper">
                        <ToggleGroup
                          value={pdfSize}
                          // @ts-ignore
                          radioHandler={(e) => sizeHandler(e.target.value)}
                          options={pdfSizes}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="setting--wrapper">
                  <TextInput letterCount value={title} label="Title: " textChangeHandler={(e) => setTitle(e.target.value)} maxLength={30} placeholder="Your title" />
                  <TextInput
                    letterCount
                    value={subtitle}
                    label="Description:"
                    textChangeHandler={(e) => setSubtitle(e.target.value)}
                    maxLength={120}
                    placeholder="Some description or subtitle"
                    multiline
                    rows={4}
                  />
                  <TextInput
                    value={text}
                    label="Word list:"
                    textChangeHandler={(e) => setText(e.target.value)}
                    placeholder="Separate each new word with space or enter"
                    multiline
                    rows={6}
                  />
                </div>
              </div>
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <div>
                <ColorPicker
                  colorValue={borderColor}
                  setColorValue={setBorderColor}
                  buttonOpen={swatchOpen}
                  setButtonOpen={setSwatchOpen}
                />
                <SliderInput
                  inputValue={gridBorderSize}
                  setValue={setGridBorderSize}
                  maxVal={10}
                  minVal={0}
                  stepVal={1}
                />
                <FontPickerField
                  activeFont={titleFont}
                  setActiveFont={setTitleFont}
                  pickerName="title"
                />
                <FontPickerField
                  activeFont={subtitleFont}
                  setActiveFont={setSubtitleFont}
                  pickerName="subtitle"
                />
                <SliderInput
                  inputValue={answerSize}
                  setValue={setAnswerSize}
                  maxVal={2}
                  minVal={0}
                  stepVal={0.1}
                />

              </div>
            </TabPanel>
          </div>
          <Modal title="Download as:" onClose={() => handleCloseDownloadModal()} opened={opened}>
            {(imageUrls && pngUrl && svgUrl) ? (
              <div className="modal--download--button--wrapper">
                {imageUrls && (
                <DownloadPdfLink
                  size={pdfSize}
                  wordSearchImageUrl={wordSearchImageUrl}
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
          <div
            // onWheelCapture={(e) => setEditPageScale(editPageScale + e.deltaY * -0.01)}
            className="col-lg-8 col-md-8 col-sm-6 col-xs-12"
          >
            <div className="edit--background">
              <TransformWrapper
                initialScale={0.7}
            // disabled={isMoveable}
                minScale={0.2}
                maxScale={2}
                limitToBounds={false}
            // onPanning={updateXarrow}
            // onZoom={updateXarrow}
                pinch={{ step: 5 }}
                centerOnInit
              >

                <TransformComponent
                  contentClass="main"
                  wrapperStyle={{
                    height: '100%', width: '100%',
                  // display: 'flex', justifyContent: 'center',
                  }}
                >
                  <Draggable scale={editPageScale}>
                    <div
                      className="grid--wrapper"
                      style={{
                        width: `${pdfPreviewBaseSize / 3}px`,
                        height: `${(pdfPreviewBaseSize / 3) * previewPageHight(pdfSize)}px`,
                        fontSize: `${pdfPreviewBaseSize / 30}px`,
                      }}
                    >
                      <div className="print--wrapper" ref={wordSearchFullPage}>
                        <div className="primary--font">
                          <h2 className="apply-font-title" style={{ width: pdfPreviewBaseSize / 4 }}>{title.length === 0 ? 'Your title' : title}</h2>
                          <div style={{ width: pdfPreviewBaseSize / 4 }} className="description--wrapper">
                            <p className="description apply-font-subtitle">{subtitle.length === 0 ? 'Some description or subtitle' : subtitle }</p>
                          </div>
                          <div
                            className="grid--width"
                          >
                            <div
                              className="game--grid"
                              style={{
                                width: `${pdfPreviewBaseSize / 4 + (gridBorderSize * 2)}px`,
                                height: `${pdfPreviewBaseSize / 4 + (gridBorderSize * 2)}px`,
                                borderWidth: gridBorderSize,
                                borderColor,
                              }}
                              ref={reference}
                            >
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
                      gameFieldLength={pdfPreviewBaseSize / 4}
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
                                  gameFieldLength={pdfPreviewBaseSize / 4}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="searchable--names" style={{ width: pdfPreviewBaseSize / 4, height: pdfPreviewBaseSize / 8 }} ref={wordSearchRef}>
                            <div className="searchable--names--column">
                              <ul className="column--list">
                                {/* {usedAnswers.filter((_, index) => index < usedAnswers.length / 4).map((word) => <li key={uuidv4()}>{word.toUpperCase()}</li>)} */}
                                <IconList
                                  listItems={usedAnswers.filter((_, index) => index < usedAnswers.length / 4)}
                                  answerSize={answerSize}
                                />
                              </ul>
                            </div>
                            <div className="searchable--names--column">
                              <ul className="column--list">
                                <IconList
                                  listItems={usedAnswers?.filter((_, index) => index >= usedAnswers.length / 4 && index < (usedAnswers.length / 4) * 2)}
                                  answerSize={answerSize}
                                />
                              </ul>
                            </div>
                            <div className="searchable--names--column">
                              <ul className="column--list">
                                <IconList
                                  listItems={usedAnswers?.filter((_, index) => index > usedAnswers.length / 4 && index >= (usedAnswers.length / 4) * 2 && index < (usedAnswers.length / 4) * 3)}
                                  answerSize={answerSize}
                                />
                              </ul>
                            </div>
                            <div className="searchable--names--column">
                              <ul className="column--list">
                                <IconList
                                  listItems={usedAnswers.filter((_, index) => index >= (usedAnswers.length / 4) * 3)}
                                  answerSize={answerSize}
                                />
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Draggable>
                </TransformComponent>
              </TransformWrapper>
            </div>
          </div>
        </div>
      </div>

      <div className="wrapper">
        <div className="row">
          <div className="col-md-6">
            <div style={{ display: 'flex' }}>
              <div style={{ marginRight: 10 }}>
                <Button
                  variant="contained"
                  name="Generate words"
                  clickHandler={() => setValue()}
                />
              </div>
              <div>
                <Button
                  variant="outlined"
                  name={!showAnswers ? 'Show answers' : 'Hide answers'}
                  clickHandler={() => setShowAnswers(!showAnswers)}
                  disabled={!success}
                />
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <span />
          </div>
          <div className="col-md-3">
            <Button
              variant="contained"
              name={`Download 5/ ${numberOfDownloads}`}
              clickHandler={() => downloadGenerateHandler()}
              disabled={!success || numberOfDownloads === 5}
            />
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;
