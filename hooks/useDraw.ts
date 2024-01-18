import { GridCellProps } from "@/helpers/generateGrid"
import { useEffect, useRef, useState } from "react"
import { TextsProps } from "@/pages/maze"

export const useDraw = (onDraw: ({ ctx, currentPoint, prevPoint }: Draw) => void) => {
  const [mouseDown, setMouseDown] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const prevPoint = useRef<null | Point>(null)
  const clickedPoint = useRef<null | Point>(null)
  const wordMazeCornerP1 = useRef<Point>({ x: -1, y: -1 })
  const answerCornerP1 = useRef<Point>({ x: 0, y: 0 })
  const createdGrid = useRef<GridCellProps[]>()
  const squareSize = useRef<number>(0)
  const answerSpacing = useRef<number>(0)
  const answers = useRef<string[]>([])
  const resizing = useRef<boolean>(false)
  const dragging = useRef<boolean>(false)
  const initialWordMazeGeneration = useRef<boolean>(true)
  const texts = useRef<TextsProps[]>([])

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

    // createAnswerList(answers.current, answerSpacing.current, answerCornerP1.current)
  }

  const createAnswerList = (startPosition: Point) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const fontSize = answerSpacing.current / 3

    answers.current.map((answer, index) => {
      ctx.font = `${fontSize}px serif`

      const startCoordinatesY = startPosition.y
      const startCoordinatesX = startPosition.x
      const changingCoordinatesY = answerSpacing.current / 2 * Math.floor(index / 4)
      const changingCoordinatesX = (index % 4 > 0) ? answerSpacing.current * 2.5 * (index - (Math.floor(index / 4) * 4)) : 0

      ctx.strokeRect(
        startCoordinatesX + changingCoordinatesX,
        startCoordinatesY + changingCoordinatesY - fontSize / 2,
        fontSize / 2,
        fontSize / 2
      )
      ctx.fillText(answer.toUpperCase(), startCoordinatesX + changingCoordinatesX + fontSize, startCoordinatesY + changingCoordinatesY)
    })
  }

  const createTexts = (startPosition: Point, fontSize: number, text: string) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.font = `${fontSize}px serif`

    const startCoordinatesY = startPosition.y
    const startCoordinatesX = startPosition.x

    ctx.fillText(text, startCoordinatesX, startCoordinatesY)

  }

  const createAllPageElements = (
    createGrid: GridCellProps[],
    initialAnswers: React.MutableRefObject<string[]>,
    initialSquareSize: number,
    initialAnswerSpacing: number,
    startPosition: React.MutableRefObject<Point>,
    answerStartPosition: React.MutableRefObject<Point>,
    inputTexts: TextsProps[],
    regenerate = false
  ) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0,0, canvas.width, canvas.height)

    if (regenerate && squareSize.current !== 0) {
      squareSize.current
    } else {
      squareSize.current = initialSquareSize
    }

    if (initialWordMazeGeneration.current === true) {
      initialWordMazeGeneration.current = false
      wordMazeCornerP1.current = startPosition.current
      squareSize.current = initialSquareSize
    } else {
      startPosition.current = wordMazeCornerP1.current
    }

    texts.current = inputTexts

    answerSpacing.current = initialAnswerSpacing
    answers.current = initialAnswers.current
    answerCornerP1.current = answerStartPosition.current

    createWordMaze(createGrid, startPosition)
    createAnswerList(answerCornerP1.current)
    texts.current.map(({initialPosition, size, value}) => {
      createTexts(initialPosition, size, value)
    })
  }

  interface currentPointProps {
    x: number
    y: number
  }
  const clickedInWordMaze = ({ x, y }: currentPointProps) => {
    if (
      wordMazeCornerP1.current.x <= x * 2 &&
      wordMazeCornerP1.current.x + squareSize.current * 10 >= x * 2 &&
      wordMazeCornerP1.current.y <= y * 2 &&
      wordMazeCornerP1.current.y + squareSize.current * 10 >= y * 2
    ) {
      return true
    } else return false
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

      if (clickedInWordMaze(currentPoint)) {
        dragging.current = true
      }

      if (checkCloseEnough(currentPoint.x * 2, wordMazeCornerP1.current?.x) && checkCloseEnough(currentPoint.y * 2, wordMazeCornerP1.current?.y)) {
        resizing.current = true
      }

      if (dragging.current === true && resizing.current === false) {
        resizing.current = false

        wordMazeCornerP1.current = { x: wordMazeCornerP1.current.x - resizingDirectionX * 2, y: wordMazeCornerP1.current.y - resizingDirectionY * 2 }

        if (createdGrid.current !== undefined && squareSize.current) {
          createAllPageElements(
            createdGrid.current,
            answers,
            squareSize.current,
            answerSpacing.current,
            wordMazeCornerP1,
            answerCornerP1,
            texts.current
          )
        }
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
            texts.current
          )
        }
      }

      // onDraw({ ctx, currentPoint, prevPoint: prevPoint.current })
      prevPoint.current = currentPoint
    }

    // const clickHandler = (e: MouseEvent) => {
    //   // if (!mouseDown) return

    //   const currentPoint = computePointInCanvas(e)

    //   const ctx = canvasRef.current?.getContext('2d')
    //   if (!ctx || !currentPoint) return

    //   // startCoordinatesX + (x / 10) * squareSize, startCoordinatesY



    //   // clickedInWordMaze(currentPoint) ? clickedPoint.current = currentPoint : clickedPoint.current = null
    // }

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
      dragging.current = false
    }

    // const mouseDownHandler = () => {
    //   // setClickDownCoordinates(true)
    // }

    canvasRef.current?.addEventListener('mousemove', handler)
    window.addEventListener('mouseup', mouseUpHandler)

    // canvasRef.current?.addEventListener('mousedown', clickHandler)
    // window.addEventListener('mousedown', mouseDownHandler)

    return () => {
      canvasRef.current?.removeEventListener('mousemove', handler)
      window.removeEventListener('mouseup', mouseUpHandler)
    }
  }, [onDraw])

  return { canvasRef, onMouseDown, createWordMaze, createAnswerList, createAllPageElements }
}
