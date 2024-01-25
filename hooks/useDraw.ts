import { GridCellProps } from "@/helpers/generateGrid"
import { useEffect, useRef, useState } from "react"
import { TextsProps } from "@/pages/maze"

export const useDraw = (onDraw: ({ ctx, currentPoint, prevPoint }: Draw) => void) => {
  const [mouseDown, setMouseDown] = useState(false)

  interface DraggingProps {
    maze: boolean
    answers: boolean
    texts: boolean[]
  }

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const prevPoint = useRef<null | Point>(null)
  const wordMazeCornerP1 = useRef<Point>({ x: 0, y: 0 })
  const answerCornerP1 = useRef<Point>({ x: 0, y: 0 })
  const createdGrid = useRef<GridCellProps[]>()
  const squareSize = useRef<number>(0)
  const answerSpacing = useRef<number>(0)
  const answers = useRef<string[]>([])
  const resizing = useRef<boolean>(false)
  const answerFontSize = useRef<number>(0)
  const dragging = useRef<DraggingProps>({
    maze: false,
    answers: false,
    texts: []
  })
  const initialWordMazeGeneration = useRef<boolean>(true)
  const texts = useRef<TextsProps[]>([])
  const rawAnswers = useRef<GridCellProps[][]>([[]])
  const showAnswerMarkings = useRef<boolean>(false)

  const onMouseDown = () => setMouseDown(true)

  const createWordMaze = (
    createGrid: GridCellProps[],
    startPosition: React.MutableRefObject<Point>
  ) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    createdGrid.current = createGrid

    if (squareSize.current !== undefined) {
      createdGrid.current.map(({ x, y, letter }) => {
        const startCoordinatesX = startPosition.current.x
        const startCoordinatesY = y / 10 * squareSize.current + startPosition.current.y

        ctx.strokeRect(startCoordinatesX + (x / 10) * squareSize.current, startCoordinatesY, squareSize.current, squareSize.current)
        ctx.font = `${squareSize.current / 2}px serif`
        const text = ctx.measureText(letter)

        ctx.fillText(letter,
          (startCoordinatesX + (x / 10) * squareSize.current) + squareSize.current / 2 - text.width / 2,
          startCoordinatesY + squareSize.current / 2 + (squareSize.current / 6)
        )
      })
    }


    if (dragging.current.maze === true) {
      ctx.strokeStyle = "#07E2F0"
      ctx.strokeRect(
        startPosition.current.x,
        startPosition.current.y,
        squareSize.current * 10,
        squareSize.current * 10
      )
      ctx.strokeStyle = "red"
      ctx.rect(
        startPosition.current.x - (squareSize.current / 10),
        startPosition.current.y - (squareSize.current / 10),
        squareSize.current / 5,
        squareSize.current / 5
      )
      ctx.fillStyle = "red"
      ctx.fill()
      ctx.fillStyle = "black"
      ctx.strokeStyle = "black"
    }
  }

  const createAnswerList = (startPosition: Point) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    answerFontSize.current = answerSpacing.current / 3

    answers.current.map((answer, index) => {
      ctx.font = `${answerFontSize.current}px serif`

      const startCoordinatesY = startPosition.y
      const startCoordinatesX = startPosition.x
      const changingCoordinatesY = answerSpacing.current / 2 * Math.floor(index / 4)
      const changingCoordinatesX = (index % 4 > 0) ? answerSpacing.current * 2.5 * (index - (Math.floor(index / 4) * 4)) : 0

      ctx.strokeRect(
        startCoordinatesX + changingCoordinatesX,
        startCoordinatesY + changingCoordinatesY - answerFontSize.current / 2,
        answerFontSize.current / 2,
        answerFontSize.current / 2
      )
      ctx.fillText(answer.toUpperCase(), startCoordinatesX + changingCoordinatesX + answerFontSize.current, startCoordinatesY + changingCoordinatesY)
    })

    if (dragging.current.answers === true) {
      ctx.strokeStyle = "#07E2F0"
      ctx.strokeRect(
        startPosition.x,
        startPosition.y - answerFontSize.current,
        answerSpacing.current * 10,
        answerFontSize.current * 1.4 * Math.ceil(answers.current.length / 4)
      )
      ctx.strokeStyle = "black"
    }
  }

  const createAnswerMarkers = (rawAnswerArray: GridCellProps[][], startPosition: React.MutableRefObject<Point>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.strokeStyle = "red"

    const answerMarkerSpacing = squareSize.current / 8
    const referenceSquareDiagonalSizes = Math.sqrt(2 * Math.pow(squareSize.current, 2))

    rawAnswerArray.map((rawAnswers) => {
      const startCoordinatesX = startPosition.current.x
      const startCoordinatesY = rawAnswers[0].y / 10 * squareSize.current + startPosition.current.y
      const answerLength = (rawAnswers[rawAnswers.length - 1].x - rawAnswers[0].x + 10) / 10
      const answerHeight = (rawAnswers[rawAnswers.length - 1].y - rawAnswers[0].y + 10) / 10

      if (answerLength === rawAnswers.length && answerHeight === 1) {

        ctx.roundRect(
          startCoordinatesX + (rawAnswers[0].x / 10) * squareSize.current + answerMarkerSpacing,
          startCoordinatesY + answerMarkerSpacing,
          (rawAnswers[rawAnswers.length - 1].x - rawAnswers[0].x + 10) / 10 * squareSize.current - answerMarkerSpacing * 2,
          squareSize.current - answerMarkerSpacing * 2,
          [40]
        )
      }

      if (answerLength === 1 && answerHeight === rawAnswers.length) {
        ctx.roundRect(
          startCoordinatesX + (rawAnswers[0].x / 10) * squareSize.current + answerMarkerSpacing,
          startCoordinatesY + answerMarkerSpacing,
          squareSize.current - answerMarkerSpacing * 2,
          (rawAnswers[rawAnswers.length - 1].y - rawAnswers[0].y + 10) / 10 * squareSize.current - answerMarkerSpacing * 2,
          [40]
        )
      }
      if (answerLength !== 1 && answerHeight !== 1 && rawAnswers[0].y < rawAnswers[rawAnswers.length - 1].y) {
        ctx.translate(
          (startCoordinatesX + (rawAnswers[0].x / 10) * squareSize.current) + squareSize.current / 2,
          startCoordinatesY,
        )
        ctx.rotate((45 * Math.PI) / 180)
        ctx.roundRect(
          0,
          0,
          (rawAnswers[rawAnswers.length - 1].x - rawAnswers[0].x + 10) / 10 * referenceSquareDiagonalSizes - (squareSize.current / 2 + answerMarkerSpacing),
          squareSize.current - answerMarkerSpacing * 2,
          [40]
        )
        ctx.rotate((-45 * Math.PI) / 180)
        ctx.setTransform(1, 0, 0, 1, 0, 0)
      }

      if (answerLength !== 1 && answerHeight !== 1 && rawAnswers[0].y > rawAnswers[rawAnswers.length - 1].y) {
        ctx.translate(
          (startCoordinatesX + (rawAnswers[0].x / 10) * squareSize.current),
          startCoordinatesY + squareSize.current / 2,
        )
        ctx.rotate((-45 * Math.PI) / 180)
        ctx.roundRect(
          0,
          0,
          (rawAnswers[rawAnswers.length - 1].x - rawAnswers[0].x + 10) / 10 * referenceSquareDiagonalSizes - (squareSize.current / 2 + answerMarkerSpacing),
          squareSize.current - answerMarkerSpacing * 2,
          [40]
        )
        ctx.rotate((45 * Math.PI) / 180)
        ctx.setTransform(1, 0, 0, 1, 0, 0)
      }

      ctx.stroke();
    })
    ctx.strokeStyle = "black"
  }

  const createTexts = (startPosition: Point, fontSize: number, text: string, index: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.font = `${fontSize}px serif`

    const startCoordinatesY = startPosition.y
    const startCoordinatesX = startPosition.x

    ctx.fillText(text, startCoordinatesX, startCoordinatesY)

    if (dragging.current.texts[index] === true) {
      ctx.strokeStyle = "#07E2F0"
      ctx.strokeRect(
        startPosition.x,
        startPosition.y - answerFontSize.current,
        ctx.measureText(text).width,
        answerFontSize.current * 1.4
      )
      ctx.strokeStyle = "black"
    }

  }

  const createAllPageElements = (
    createGrid: GridCellProps[],
    initialAnswers: React.MutableRefObject<string[]>,
    initialSquareSize: number,
    initialAnswerSpacing: number,
    startPosition: React.MutableRefObject<Point>,
    answerStartPosition: React.MutableRefObject<Point>,
    inputTexts: TextsProps[],
    rawAnswerArray: GridCellProps[][],
    showAnswers: boolean,
    regenerate = false
  ) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.reset()
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (regenerate && squareSize.current !== 0) {
      squareSize.current
    } else {
      squareSize.current = initialSquareSize
    }

    if (initialWordMazeGeneration.current === true) {
      initialWordMazeGeneration.current = false
      wordMazeCornerP1.current = startPosition.current
      answerCornerP1.current = answerStartPosition.current
      squareSize.current = initialSquareSize
    } else {
      startPosition.current = wordMazeCornerP1.current
      answerStartPosition.current = answerCornerP1.current
    }

    texts.current = inputTexts

    answerSpacing.current = initialAnswerSpacing
    answers.current = initialAnswers.current
    rawAnswers.current = rawAnswerArray
    showAnswerMarkings.current = showAnswers

    createWordMaze(createGrid, startPosition)
    createAnswerList(answerCornerP1.current)
    texts.current.map(({ initialPosition, size, value}, index) => {
      createTexts(initialPosition, size, value, index)
    })
    showAnswerMarkings.current && createAnswerMarkers(rawAnswers.current, startPosition)
  }

  interface CurrentPointProps {
    x: number
    y: number
  }
  const clickedInWordMaze = ({ x, y }: CurrentPointProps) => {
    if (
      wordMazeCornerP1.current.x <= x * 2 &&
      wordMazeCornerP1.current.x + squareSize.current * 10 >= x * 2 &&
      wordMazeCornerP1.current.y <= y * 2 &&
      wordMazeCornerP1.current.y + squareSize.current * 10 >= y * 2
    ) {
      return true
    } else return false
  }

  const clickedInAnswerList = ({ x, y }: CurrentPointProps) => {
    if (
      answerCornerP1.current.x <= x * 2 &&
      answerCornerP1.current.x + squareSize.current * 10 >= x * 2 &&
      answerCornerP1.current.y <= y * 2 + answerFontSize.current &&
      answerCornerP1.current.y + squareSize.current * 4 >= y * 2
    ) {
      return true
    } else return false
  }

  const clickedInText = ({ x, y }: CurrentPointProps) => {
    return texts.current.some(({ initialPosition, value, size }, index) => {
      if (
        initialPosition.x <= x * 2 &&
        initialPosition.x + value.length * size * 0.6 >= x * 2 &&
        initialPosition.y - size <= y * 2 &&
        initialPosition.y >= y * 2
      ) {
        dragging.current.texts[index] = true
        dragging.current.maze = false
        dragging.current.answers = false
      } else {
        dragging.current.texts[index] = false
      }
    })
  }

  const checkCloseEnough = (p1: number | undefined, p2: number | undefined) => {

    if (p1 === undefined || p2 === undefined) return false

    return Math.abs(p1 - p2) < 10;
  }

  const calculateResizeAmount = (x: number, y: number, squareSize: number) => {
    if (x !== 0 && y !== 0) {
      const diagonalKoeficient = (squareSize / 10) / ((Math.sqrt(2) * squareSize) / 10)
      return x * diagonalKoeficient + y * diagonalKoeficient
    }
    return x + y
  }

  useEffect(() => {
    const handler = (e: MouseEvent) => {

      if (!mouseDown) return

      const currentPoint = computePointInCanvas(e)

      const ctx = canvasRef.current?.getContext('2d')
      if (!ctx || !currentPoint) return

      const resizingDirectionX = prevPoint.current ? (prevPoint.current.x - currentPoint.x) : 0
      const resizingDirectionY = prevPoint.current ? (prevPoint.current.y - currentPoint.y) : 0

      const dragElement = (element: React.MutableRefObject<Point>, isDragging: boolean) => {
        if (isDragging === true && resizing.current === false) {
          resizing.current = false

          element.current = { x: element.current.x - resizingDirectionX * 2, y: element.current.y - resizingDirectionY * 2 }

          if (createdGrid.current !== undefined && squareSize.current) {
            createAllPageElements(
              createdGrid.current,
              answers,
              squareSize.current,
              answerSpacing.current,
              wordMazeCornerP1,
              answerCornerP1,
              texts.current,
              rawAnswers.current,
              showAnswerMarkings.current
            )
          }
        }
      }

      const dragTextElement = (index: number, isDragging: boolean) => {
        if (isDragging === true && resizing.current === false) {
          resizing.current = false

          texts.current[index].initialPosition = {
            x: texts.current[index].initialPosition.x - resizingDirectionX * 2,
            y: texts.current[index].initialPosition.y - resizingDirectionY * 2
          }

          if (createdGrid.current !== undefined && squareSize.current) {
            createAllPageElements(
              createdGrid.current,
              answers,
              squareSize.current,
              answerSpacing.current,
              wordMazeCornerP1,
              answerCornerP1,
              texts.current,
              rawAnswers.current,
              showAnswerMarkings.current
            )
          }
        }
      }

      if (dragging.current.maze === false) {
        dragElement(answerCornerP1, dragging.current.answers)
      }

      if (dragging.current.answers === false) {
        dragElement(wordMazeCornerP1, dragging.current.maze)
      }

      if (dragging.current.answers === false && dragging.current.maze === false) {
        dragging.current.texts.map((drag, index) => {
          dragTextElement(index, drag)
        })
      }


      if (checkCloseEnough(currentPoint.x * 2, wordMazeCornerP1.current?.x) && checkCloseEnough(currentPoint.y * 2, wordMazeCornerP1.current?.y)) {
        resizing.current = true
      }

      if (resizing.current === true) {
        wordMazeCornerP1.current = { x: currentPoint.x * 2, y: currentPoint.y * 2 }

        if (createdGrid.current !== undefined && squareSize.current) {
          createAllPageElements(
            createdGrid.current,
            answers,
            squareSize.current + calculateResizeAmount(resizingDirectionX / 10 * 2, resizingDirectionY / 10 * 2, squareSize.current),
            answerSpacing.current,
            wordMazeCornerP1,
            answerCornerP1,
            texts.current,
            rawAnswers.current,
            showAnswerMarkings.current
          )
        }
      }

      // onDraw({ ctx, currentPoint, prevPoint: prevPoint.current })
      prevPoint.current = currentPoint
    }

    const computePointInCanvas = (e: MouseEvent) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      return { x, y }
    }

    const mouseUpHandler = () => {
      setMouseDown(false)
      prevPoint.current = null
      resizing.current = false
      // dragging.current.maze = false
      // dragging.current.answers = false
      // dragging.current.texts.map((text) => text = false)
    }

    const mouseDownHandler = (e: MouseEvent) => {
      const currentPoint = computePointInCanvas(e)

      if (currentPoint && clickedInWordMaze(currentPoint)) {
        dragging.current.maze = true
        dragging.current.answers = false
        dragging.current.texts.map((text) => text = false)
      } else {
        dragging.current.maze = false
      }

      if (currentPoint && clickedInAnswerList(currentPoint)) {
        dragging.current.answers = true
        dragging.current.maze = false
        dragging.current.texts.map((text) => text = false)
      } else {
        dragging.current.answers = false
      }

      currentPoint && clickedInText(currentPoint)

      if (createdGrid.current !== undefined && squareSize.current) {
        createAllPageElements(
          createdGrid.current,
          answers,
          squareSize.current,
          answerSpacing.current,
          wordMazeCornerP1,
          answerCornerP1,
          texts.current,
          rawAnswers.current,
          showAnswerMarkings.current
        )
      }
    }

    canvasRef.current?.addEventListener('mousemove', handler)
    window.addEventListener('mouseup', mouseUpHandler)

    canvasRef.current?.addEventListener('mousedown', handler)
    window.addEventListener('mousedown', mouseDownHandler)

    return () => {
      canvasRef.current?.removeEventListener('mousemove', handler)
      window.removeEventListener('mouseup', mouseUpHandler)

      canvasRef.current?.removeEventListener('mousedown', handler)
      window.removeEventListener('mousedown', mouseDownHandler)
    }
  }, [onDraw])

  return { canvasRef, onMouseDown, createWordMaze, createAnswerList, createAllPageElements }
}
