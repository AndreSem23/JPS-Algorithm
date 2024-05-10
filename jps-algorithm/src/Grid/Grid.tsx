import { useCallback, useEffect, useState } from "react"
import Cell from "../types/Cell"
import CellBox from "./CellBox"
import CellRow from "../types/CellRow"
import { Button, Col, Row } from "react-bootstrap"
import PriorityQueue from "../types/PriorityQueue"

type Props = {
    size:number
}

const Grid = ({size}:Props) => {
    const [grid, setGrid] = useState<CellRow[]>([])
    const [start, setStart] = useState<Cell | null>(null)
    const [finish, setFinish] = useState<Cell | null>(null)

    const openList = new PriorityQueue<Cell>();

    const createGrid = useCallback(() => {
        const cellRows: CellRow[] = []
        for (let y = 1; y <= size; y++) {
            const cells: Cell[] = []
            for (let x = 1; x <= size; x++) {
                const cell: Cell = {
                    x: x,
                    y: y,
                    isObstacle: false,
                    isClosed: false,
                    isOpen: false,
                    isStart: false,
                    isFinish: false,
                    isPath: false,
                    gScore: 0,
                    fScore: 99999,
                    parent: null,
                    direction: ''
                }
                cells.push(cell)
            }
            cellRows.push({ y: y, cells: cells })                 
        }
        setGrid(cellRows)   
    }, [size])

    useEffect(() => {
        createGrid()
    },[ createGrid])

    const onCellClicked = (cell: Cell) => {
        const item = grid.find(f => f.y === cell.y)?.cells.find(c => c.x === cell.x)
        if(!item) return
        
        if(!start){
            item.isStart = true
            setStart(cell)
        } 
        else if(!finish){
            item.isFinish = true
            setFinish(cell)
        } 
        else item.isObstacle = true
        setGrid([...grid])
    }

    const calculateCost = (cell:Cell) => {
        if(!start || !finish) return
        if(cell.isObstacle && cell.isClosed && cell.isOpen) return
        const g = cell.parent ? cell.parent.gScore + 1 : 1
        cell.gScore = g
        const h = ((cell.x - finish.x)**2 + (cell.y - finish.y)**2)**0.5
        return Math.round((g + h)*100)/100
    }

    const addToOpenList = (cell:Cell,  parent: Cell) => {
        const f = calculateCost(cell);
        if(!f) return
        cell.parent = parent
        cell.fScore = f
        cell.isOpen = true
        openList.enqueue(cell, -f)
    }

    const getNeighbor = (cell: Cell, xDir: number, yDir: number) => {
        const neighbor = grid.find(f => f.y === cell.y + yDir)?.cells.find(c => c.x === cell.x + xDir)
        return neighbor
    }

    const searchHorizontaly = (cell:Cell) => {
        let step = 1
        while (true){
            const right = getNeighbor(cell,step,0)
            if(!right) break
            right.parent = cell
            if(right.isFinish) return right
            if(right.isClosed || right.isOpen || right.isObstacle || right.isStart) break

            const top = getNeighbor(right, 0, -1)
            if(top && top.isObstacle){
                const topRight = getNeighbor(right,1,-1)            
                if(topRight && !topRight.isObstacle && !topRight.isClosed && !topRight.isOpen){
                    addToOpenList(right, cell)
                    addToOpenList(topRight, right)
                    if(topRight.isFinish) {topRight.parent = cell; return topRight}
                }
            }

            const bottom = getNeighbor(right,0,1)
            if(bottom && bottom.isObstacle){
                const bottomRight = getNeighbor(right,1,1)
                if(bottomRight && !bottomRight.isObstacle && !bottomRight.isClosed && !bottomRight.isOpen){
                    addToOpenList(right, cell) 
                    addToOpenList(bottomRight, right)
                    if(bottomRight.isFinish) {bottomRight.parent = cell; return bottomRight}
                }
            }
            right.isClosed = true
            right.direction = '>'
            step += 1
        }
        let stepBack = 1
        while (true){
            const left = getNeighbor(cell, -stepBack, 0)
            if(!left) break
            left.parent = cell
            if(left.isFinish)  return left
            if(left.isClosed || left.isOpen || left.isObstacle || left.isStart) break

            const top = getNeighbor(left,0,-1)
            if(top && top.isObstacle){
                const topLeft = getNeighbor(left, -1, -1)
                if(topLeft && !topLeft.isObstacle && !topLeft.isClosed && !topLeft.isOpen){
                    addToOpenList(left, cell) 
                    addToOpenList(topLeft, left)
                    if(topLeft.isFinish) {topLeft.parent = cell; return topLeft}
                }
            }

            const bottom = getNeighbor(left, 0, 1)
            if(bottom && bottom.isObstacle){
                const bottomLeft = getNeighbor(left, -1, 1)
                if(bottomLeft && !bottomLeft.isObstacle && !bottomLeft.isClosed && !bottomLeft.isOpen){
                    addToOpenList(left, cell) 
                    addToOpenList(bottomLeft, left)
                    if(bottomLeft.isFinish) {bottomLeft.parent = cell; return bottomLeft}
                }
            }
            left.isClosed = true
            left.direction = '<'
            stepBack += 1
        }
    }

    const searchVertically = (cell:Cell) => {        
        let stepUp = 1
        while (true){
            const top = getNeighbor(cell, 0, -stepUp)      
            if(!top) break
            top.parent = cell
            if(top.isFinish)  return top
            if(top.isClosed || top.isOpen || top.isObstacle || top.isStart) break

            const right = getNeighbor(top, 1, 0)
            if(right && right.isObstacle){
                const rightTop = getNeighbor(top, 1, -1)
                if(rightTop && !rightTop.isObstacle && !rightTop.isClosed && !rightTop.isOpen){
                    addToOpenList(top, cell)
                    addToOpenList(rightTop, top)
                    if(rightTop.isFinish) {rightTop.parent = top; return rightTop}
                }
            }

            const left = getNeighbor(top, -1, 0)
            if(left && left.isObstacle){
                const leftTop = getNeighbor(top, -1, -1)
                if(leftTop && !leftTop.isObstacle && !leftTop.isClosed && !leftTop.isOpen){
                    addToOpenList(top, cell)
                    addToOpenList(leftTop, top)
                    if(leftTop.isFinish) {leftTop.parent = top; return leftTop}
                }
            }
            top.isClosed = true
            top.direction = '^'
            stepUp += 1
        }
        let stepDown = 1
        while (true){
            const bottom = getNeighbor(cell, 0, stepDown)
            if(!bottom) break
            bottom.parent = cell
            if(bottom.isFinish)  return bottom
            if(bottom.isClosed || bottom.isOpen || bottom.isObstacle || bottom.isStart) break

            const right = getNeighbor(bottom, 1, 0)
            if(right) right.parent = cell;
            if(right && right.isObstacle){
                const rightBottom = getNeighbor(bottom, 1, 1)              
                if(rightBottom && !rightBottom.isObstacle && !rightBottom.isClosed && !rightBottom.isOpen){
                    addToOpenList(bottom, cell)
                    addToOpenList(rightBottom, bottom)
                    if(rightBottom.isFinish) {rightBottom.parent = right; return rightBottom}
                }
            }

            const left = getNeighbor(bottom, -1, 0)
            if(left && left.isObstacle){
                const leftBottom = getNeighbor(bottom, -1, 1)              
                if(leftBottom && !leftBottom.isObstacle && !leftBottom.isClosed && !leftBottom.isOpen){
                    addToOpenList(bottom, cell)
                    addToOpenList(leftBottom, bottom)
                    if(leftBottom.isFinish) {leftBottom.parent = bottom; return leftBottom}
                }
            }
            bottom.isClosed = true
            bottom.direction = 'v'
            stepDown += 1
        }
    }

    const moveDiagonal = (cell: Cell) => {
        const tr = getNeighbor(cell, 1, -1)
        if(tr && !tr.isObstacle && !tr.isClosed && !tr.isOpen){
            tr.direction = '/'
            tr.isClosed = true
            addToOpenList(tr, cell)
            if(tr.isFinish) return tr
        }  

        const br = getNeighbor(cell, 1, 1)
        if(br && !br.isObstacle && !br.isClosed && !br.isOpen){
            br.direction = '\\'
            br.isClosed = true
            addToOpenList(br, cell)
            if(br.isFinish) return tr
        }

        const tl = getNeighbor(cell, -1, -1)  
        if(tl && !tl.isObstacle && !tl.isClosed && !tl.isOpen){
            tl.direction = '\\'
            tl.isClosed = true
            addToOpenList(tl, cell)
            if(tl.isFinish) return tr
        }

        const bl = getNeighbor(cell, -1, 1)
        if(bl && !bl.isObstacle && !bl.isClosed && !bl.isOpen){
            bl.direction = '/'
            bl.isClosed = true
            addToOpenList(bl, cell)
            if(bl.isFinish) return tr
        }
    }

    const showPath = (cell: Cell) => {
        if(cell.isStart) return
        cell.isPath = true
        if(!cell.parent) return
        showPath(cell.parent)
    }

    const algo = () => {
        if(!start || !finish) return        

        const leftTop = getNeighbor(start, -1, -1)
        if(leftTop) addToOpenList(leftTop, start)
        const top = getNeighbor(start, 0, -1)
        if(top) addToOpenList(top, start)
        const rightTop = getNeighbor(start, 1, -1)
        if(rightTop) addToOpenList(rightTop, start)

        const left = getNeighbor(start, -1, 0)
        if(left) addToOpenList(left, start)
        const right = getNeighbor(start, 1, 0)
        if(right) addToOpenList(right, start)

        const leftBottom = getNeighbor(start, -1, 1)
        if(leftBottom) addToOpenList(leftBottom, start)
        const bottom = getNeighbor(start, 0, 1)
        if(bottom) addToOpenList(bottom, start)
        const rightBottom = getNeighbor(start, 1, 1)
        if(rightBottom) addToOpenList(rightBottom, start)

        let result : Cell | undefined = undefined
        while (!openList.isEmpty()){
            let node = openList.dequeue()            
            if(!node) break         

            result = searchHorizontaly(node)
            if(result) break

            result = searchVertically(node)
            if(result) break

            result = moveDiagonal(node)
            if(result) break
        }
        alert(result ? 'Success' : 'Not found')
        if(result && result.parent) showPath(result.parent)
        setGrid([...grid])
    }

    
      return(   
        <>
            <Row className="justify-content-around" >
                <Col xs='auto' className="m-2">
                    <Row><Col><Button variant="success" className="m-2" onClick={() => algo()}>Run</Button></Col></Row>
                    <Row><Col><Button variant="danger" onClick={() => window.location.reload()}>Reload</Button></Col></Row>
                </Col>
                <Col xs='auto'>
                    {grid.map(r => (
                        <div key={r.y} style={{ display: 'flex' }}>
                            {r.cells.map(c => (
                                <CellBox key={c.x} cell={c} onCellClicked={onCellClicked} matrixSize={size}/>
                            ))}
                        </div>
                    ))}
                </Col>                
            </Row>     
        </>     
      )
      
}

export default Grid