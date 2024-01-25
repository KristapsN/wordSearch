import React, { useEffect, useRef, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import Switch from '@mui/material/Switch'
import AddIcon from '@mui/icons-material/Add'
import { spaceGrotesk600, spaceGrotesk700 } from '..'
import Words from '@/helpers/generateWords'
import { GridCellProps, generateGrid } from '@/helpers/generateGrid'
import { useDraw } from '@/hooks/useDraw'
import freeVerticalSpaceFilter from '@/helpers/freeVerticalSpaceFilter'
import fillInHorizontalAnswer from '@/helpers/freeHorizontalSpaceFilter'
import freeSpaceFilter from '@/helpers/freeCpaceFilter'
import filterAnswerArray from '@/helpers/filterAnswerArray'
import { randomLetterGenerator } from '@/helpers/randomLetterGenerator'
import { useWindowSize } from '@/hooks/windowSize'
import jsPDF from 'jspdf'

export interface TextsProps {
  value: string
  initialPosition: Point
  size: number
  font: string
}
export default function Maze() {

  const [createGrid, setCreateGrid] = useState(generateGrid(10))
  const [textAreaText, setTextAreaText] = useState('')
  const [openAnswerMarkers, setOpenAnswerMarkers] = useState(false)
  const pdfPreviewHeight = useWindowSize().height ?? 0
  const pdfPreviewWidth = pdfPreviewHeight * (595.28 / 841.89) * 2
  const squareSize = (pdfPreviewWidth - pdfPreviewWidth / 5) / 10
  const wordMazeCornerP1a = useRef<Point>({ x: 0, y: 0 })
  const answerStartPosition = useRef<Point>({ x: 0, y: 0 })
  const validAnswers = useRef<string[]>([])
  const [texts, setTexts] = useState<TextsProps[]>([
    {
      value: '',
      initialPosition: { x: 0, y: 0 },
      size: 32,
      font: ''
    }
  ])

  let answers: any[][]
  const rawAnswerArray = useRef<GridCellProps[][]>([[]])
  const textArray = textAreaText.toUpperCase().split((/\s+/)).filter((word) => word !== '')

  useEffect(() => {
    const pdfPreviewWidth = pdfPreviewHeight * (595.28 / 841.89) * 2
    const squareSize = (pdfPreviewWidth - pdfPreviewWidth / 5) / 10

    const newTexts = [...texts]
    if (texts[0]) {
      texts[0].initialPosition = { x: (pdfPreviewWidth - squareSize * 10) / 2, y: pdfPreviewHeight * 2 / 12 }
    }
    setTexts(newTexts)

    wordMazeCornerP1a.current = { x: (pdfPreviewWidth - squareSize * 10) / 2, y: pdfPreviewHeight * 2 / 6 }
    answerStartPosition.current = {
      x: (pdfPreviewWidth - squareSize * 10) / 2,
      y: squareSize * 10 + pdfPreviewHeight * 2 / 6 + squareSize
    }
  }, [pdfPreviewHeight])

  const fillGridWithLetters = () => {
    const newLetterGrid = [...createGrid];
    const unusedWordIndexes: number[] = [];
    answers.map((item, index) => item.length === 0 && unusedWordIndexes.push(index));
    const unusedWords = textArray.filter((_, index) => unusedWordIndexes.includes(index));

    if (unusedWords.length > 0) {
      // Filter free horizontal spaces and fill them with unused words
      const filterVerticalSpaces = freeVerticalSpaceFilter(unusedWords, createGrid);
      answers = fillInHorizontalAnswer(unusedWords, answers, filterVerticalSpaces);

      const filteredHorizontalFreeSpaces = freeSpaceFilter(unusedWords, createGrid);
      answers = fillInHorizontalAnswer(unusedWords, answers, filteredHorizontalFreeSpaces);
    }

    const unusedCells = createGrid.filter((item) => item.letter === '' || item.letter === undefined);

    unusedCells.forEach((item) => { item.letter = randomLetterGenerator() })
    setCreateGrid(newLetterGrid)

    rawAnswerArray.current = filterAnswerArray(answers)


    return rawAnswerArray.current
  }

  const { canvasRef, onMouseDown, createAllPageElements } = useDraw(drawLine)

  const generateWordSearch = () => {
    setCreateGrid(generateGrid(10))
    for (let i = 0; i < 1; i += 1) {
      answers = Words(createGrid, textArray, 10)

      if (textArray.length !== 0 && textArray.length === answers.length) {
        const preFilteredAnswerArray = fillGridWithLetters()

        const answerArray = preFilteredAnswerArray.map((item) => item.map(({ letter }) => letter).join(''))
        validAnswers.current = answerArray.filter((answer) => textArray.includes(answer))

        const pdfPreviewWidth = pdfPreviewHeight * (595.28 / 841.89) * 2
        const squareSize = (pdfPreviewWidth - pdfPreviewWidth / 5) / 10

        createAllPageElements(
          createGrid,
          validAnswers,
          squareSize,
          squareSize,
          wordMazeCornerP1a,
          answerStartPosition,
          texts,
          rawAnswerArray.current,
          openAnswerMarkers,
          true
        )
        // , pdfPreviewHeight * 2, pdfPreviewHeight * (595.28 / 841.89) * 2)

        // createAnswerMarkers(rawAnswerArray, pdfPreviewHeight * 2, pdfPreviewHeight * (595.28 / 841.89) * 2)
      }
      // setSuccess(true);

      // if (tooLongWords.length > 0) {
      //   handleAlertOpen(`These words are too long: ${tooLongWords.join(', ')}`, 'warning');
      // }
    }
  }

  const showAnswerMarkers = () => {
    createAllPageElements(
      createGrid,
      validAnswers,
      squareSize,
      squareSize,
      wordMazeCornerP1a,
      answerStartPosition,
      texts,
      rawAnswerArray.current,
      !openAnswerMarkers,
      true
    )

    setOpenAnswerMarkers(!openAnswerMarkers)
  }

  function drawLine({ prevPoint, currentPoint, ctx }: Draw) {

    const { x: currX, y: currY } = currentPoint
    const lineColor = '#000'
    const lineWidth = 2

    let startPoint = prevPoint ?? currentPoint
    ctx.beginPath()
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = lineColor
    ctx.moveTo(startPoint.x * 2, startPoint.y * 2)
    ctx.lineTo(currX * 2, currY * 2)
    ctx.stroke()

    ctx.fillStyle = lineColor
    ctx.beginPath()
    ctx.arc(startPoint.x * 2, startPoint.y * 2, 1, 0, 2 * Math.PI)
    ctx.fill()
  }

  const handleTextInput = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newTexts = [...texts]
    if (texts[index]) {
      texts[index].value = event.target.value
    }
    setTexts(newTexts)

    createAllPageElements(
      createGrid,
      validAnswers,
      squareSize,
      squareSize,
      wordMazeCornerP1a,
      answerStartPosition,
      texts,
      rawAnswerArray.current,
      openAnswerMarkers,
      true
    )
  }

  const addTextField = () => {
    const newTexts = [...texts]
    newTexts.push(
      {
        value: '',
        initialPosition: { x: 20, y: 100 },
        font: '',
        size: 24
      }
    )
    setTexts(newTexts)
  }

  const generatePDF = () => {
    var imgData = canvasRef.current ? canvasRef.current.toDataURL() : ''
    var pdf = new jsPDF({
      format: [595.28 / 4, 841.89 / 4]
    });

    canvasRef.current && pdf.addImage(imgData, 'JPEG', 0, 0, 595.28 / 4, 841.89 / 4)

    pdf.save("word_maze.pdf");
  }

  type pdfSizesListProps = {
    name: string,
    size: [number, number]
  }
  const pdfSizesList: pdfSizesListProps[] = [
    { name: 'A4', size: [595.28, 841.89] },
    { name: '8.5 x 11', size: [612, 792] },
    { name: '8 x 10', size: [576, 720] },
    { name: '6 x 9', size: [432, 648] },
    { name: '5.5 x 8.5', size: [396, 612] },
  ]

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Grid container sx={{ flexGrow: 1, backgroundColor: '#FCD0F4', height: "100%" }} className={styles.main2}>
        <Grid item xs={12} sm={12} md={12} lg={5}>
          <Grid container className={styles.main}>

            <Box className={styles.slide_down} sx={{ background: "#FCD0F4" }}>
              <Box
                className={styles.hide_slide_down}
                sx={{
                  borderBottom: '1px solid #FCD0F4',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  height: '6rem',
                  // bottom: slideBottom,
                  background: "#030303"
                }}
              >
                <div className={`${styles.logo_title_wrapper}`}>
                  <Box sx={{ position: 'relative', padding: '2rem', marginRight: '2rem', marginLeft: '0.5rem' }} className={styles.height6}>
                    <Image
                      src="/word_search_maze_logo.svg"
                      alt="Word Search Maze"
                      fill
                      sizes="(max-width: 70px) 100vw, (max-width: 58px) 50vw"
                    />
                  </Box>
                  <h2 className={spaceGrotesk700.className}>Enjoy Word Search, Create Your Book and Sell It!</h2>
                </div>
              </Box>
            </Box>
            <Box>
              <Box sx={{ mb: '1rem' }}>
                {texts.map(({ value }, index) => {
                  return (
                    <Box key={index} >
                      <input
                        type="text"
                        className={styles.text_input}
                        placeholder='Text'
                        onChange={(e) => handleTextInput(e, index)}
                        value={value}
                      />
                    </Box>
                  )
                })}

              </Box>
              <Box sx={{ mb: '1rem' }}>
                <Button
                  variant='outlined'
                  size='small'
                  startIcon={<AddIcon />}
                  onClick={addTextField}
                >
                  Add text field
                </Button>
              </Box>
              <Box>
                <textarea
                  className={styles.text_input}
                  placeholder='Leave your email here'
                  onChange={(e) => setTextAreaText(e.target.value)}
                  value={textAreaText}
                />
                <Button
                  variant="contained"
                  onClick={generateWordSearch}
                >
                  Generate
                </Button>
                <Button variant="contained" onClick={generatePDF}>
                  Download PDF
                </Button>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <p> Show answers</p>
                <Switch checked={openAnswerMarkers} onChange={showAnswerMarkers} />
              </Box>
            </Box>
          </Grid>

        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={7}>
          <Grid
            container className={styles.main}
            sx={{ flexGrow: 1, backgroundColor: '#FCD0F4' }}
            direction="column"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <canvas
                onMouseDown={onMouseDown}
                ref={canvasRef}
                width={pdfPreviewHeight * (595.28 / 841.89) * 2}
                height={pdfPreviewHeight * 2}
                className={styles.canvas_wrapper}
                style={{
                  width: `${pdfPreviewHeight * (595.28 / 841.89)}px`,
                  height: `${pdfPreviewHeight}px`,
                  backgroundColor: 'white'
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}
