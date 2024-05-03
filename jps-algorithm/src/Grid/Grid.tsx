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
                    hScore: 99999,
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
        if(!start || !finish) return 99999
        if(cell.isObstacle && cell.isClosed && cell.isOpen) return 9999
        const g = cell.parent ? cell.parent.gScore + 1 : 0
        cell.gScore = g
        const h = ((cell.x - finish.x)**2 + (cell.y - finish.y)**2)**0.5
        cell.hScore = h
        return Math.round((g + h)*100)/100
    }

    const addToOpenList = (cell:Cell,  parent: Cell) => {
        const f = calculateCost(cell);
        cell.parent = parent
        cell.fScore = f
        cell.isOpen = true
        openList.enqueue(cell, -f)
    }

    const searchHorizontaly = (cell:Cell) => {
        let step = 1
        while (true){
            const right = grid.find(f => f.y === cell.y)?.cells.find(c => c.x === cell.x + step)
            if(!right) break
            right.parent = cell
            if(right.isFinish) return right
            if(right.isClosed || right.isOpen || right.isObstacle || right.isStart) break

            const top = grid.find(f => f.y === right.y-1)?.cells.find(c => c.x === right.x)
            if(top && top.isObstacle){
                const topRight = grid.find(f => f.y === right.y-1)?.cells.find(c => c.x === right.x+1)                
                if(topRight && !topRight.isObstacle && !topRight.isClosed && !topRight.isOpen){
                    addToOpenList(right, cell)
                    addToOpenList(topRight, right)
                    if(topRight.isFinish) {topRight.parent = cell; return topRight}
                }
            }

            const bottom = grid.find(f => f.y === right.y+1)?.cells.find(c => c.x === right.x)
            if(bottom && bottom.isObstacle){
                const bottomRight = grid.find(f => f.y === right.y+1)?.cells.find(c => c.x === right.x+1)
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
            const left = grid.find(f => f.y === cell.y)?.cells.find(c => c.x === cell.x - stepBack)
            if(!left) break
            left.parent = cell
            if(left.isFinish)  return left
            if(left.isClosed || left.isOpen || left.isObstacle || left.isStart) break

            const top = grid.find(f => f.y === left.y-1)?.cells.find(c => c.x === left.x)
            if(top && top.isObstacle){
                const topLeft = grid.find(f => f.y === left.y-1)?.cells.find(c => c.x === left.x-1)
                if(topLeft && !topLeft.isObstacle && !topLeft.isClosed && !topLeft.isOpen){
                    addToOpenList(left, cell) 
                    addToOpenList(topLeft, left)
                    if(topLeft.isFinish) {topLeft.parent = cell; return topLeft}
                }
            }

            const bottom = grid.find(f => f.y === left.y+1)?.cells.find(c => c.x === left.x)
            if(bottom && bottom.isObstacle){
                const bottomLeft = grid.find(f => f.y === left.y+1)?.cells.find(c => c.x === left.x-1)
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
            const top = grid.find(f => f.y === cell.y-stepUp)?.cells.find(c => c.x === cell.x)            
            if(!top) break
            top.parent = cell
            if(top.isFinish)  return top
            if(top.isClosed || top.isOpen || top.isObstacle || top.isStart) break

            const right = grid.find(f => f.y === top.y)?.cells.find(c => c.x === top.x+1)
            if(right && right.isObstacle){
                const rightTop = grid.find(f => f.y === top.y-1)?.cells.find(c => c.x === top.x+1)
                if(rightTop && !rightTop.isObstacle && !rightTop.isClosed && !rightTop.isOpen){
                    addToOpenList(top, cell)
                    addToOpenList(rightTop, top)
                    if(rightTop.isFinish) {rightTop.parent = top; return rightTop}
                }
            }

            const left = grid.find(f => f.y === top.y)?.cells.find(c => c.x === top.x-1)
            if(left && left.isObstacle){
                const leftTop = grid.find(f => f.y === top.y-1)?.cells.find(c => c.x === top.x-1)
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
            const bottom = grid.find(f => f.y === cell.y+stepDown)?.cells.find(c => c.x === cell.x)
            if(!bottom) break
            bottom.parent = cell
            if(bottom.isFinish)  return bottom
            if(bottom.isClosed || bottom.isOpen || bottom.isObstacle || bottom.isStart) break

            const right = grid.find(f => f.y === bottom.y)?.cells.find(c => c.x === bottom.x + 1)
            if(right) right.parent = cell;
            if(right && right.isObstacle){
                const rightBottom = grid.find(f => f.y === bottom.y+1)?.cells.find(c => c.x === bottom.x+1)                
                if(rightBottom && !rightBottom.isObstacle && !rightBottom.isClosed && !rightBottom.isOpen){
                    addToOpenList(bottom, cell)
                    addToOpenList(rightBottom, bottom)
                    if(rightBottom.isFinish) {rightBottom.parent = right; return rightBottom}
                }
            }

            const left = grid.find(f => f.y === bottom.y)?.cells.find(c => c.x === bottom.x-1)
            if(left && left.isObstacle){
                const leftBottom = grid.find(f => f.y === bottom.y+1)?.cells.find(c => c.x === bottom.x-1)                
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
        const tr = grid.find(f => f.y === cell.y-1)?.cells.find(c => c.x === cell.x+1) 
        const tl = grid.find(f => f.y === cell.y-1)?.cells.find(c => c.x === cell.x-1)   
        const br = grid.find(f => f.y === cell.y+1)?.cells.find(c => c.x === cell.x+1)
        const bl = grid.find(f => f.y === cell.y+1)?.cells.find(c => c.x === cell.x-1)
        let f_tr = 99999
        let f_tl = 99999
        let f_br = 99999
        let f_bl = 99999
        if(tr) f_tr = calculateCost(tr)
        if(tl) f_tl = calculateCost(tl)
        if(br) f_br = calculateCost(br)
        if(bl) f_bl = calculateCost(bl)
        
        //right
        if(f_tr < f_tl){
            //top
            if(f_tr < f_br){
                const topRight = grid.find(f => f.y === cell.y-1)?.cells.find(c => c.x === cell.x+1)                
                if(topRight && !topRight.isObstacle && !topRight.isClosed && !topRight.isOpen){
                    topRight.direction = '/'
                    topRight.isClosed = true
                    addToOpenList(topRight, cell)
                    return topRight
                }   
            }
            //bottom
            else{
                const bottomRight = grid.find(f => f.y === cell.y+1)?.cells.find(c => c.x === cell.x+1)                
                if(bottomRight && !bottomRight.isObstacle && !bottomRight.isClosed && !bottomRight.isOpen){
                    bottomRight.direction = '\\'
                    bottomRight.isClosed = true
                    addToOpenList(bottomRight, cell)
                    return bottomRight
                }
            }
        }        
        //left
        else{
            //top
            if(f_tl < f_bl){
                const topLeft = grid.find(f => f.y === cell.y-1)?.cells.find(c => c.x === cell.x-1)                
                if(topLeft && !topLeft.isObstacle && !topLeft.isClosed && !topLeft.isOpen){
                    topLeft.direction = '\\'
                    topLeft.isClosed = true
                    addToOpenList(topLeft, cell)
                    return topLeft
                }
            }
            //bottom
            else{
                const bottomLeft = grid.find(f => f.y === cell.y+1)?.cells.find(c => c.x === cell.x-1)                
                if(bottomLeft && !bottomLeft.isObstacle && !bottomLeft.isClosed && !bottomLeft.isOpen){
                    bottomLeft.direction = '/'
                    bottomLeft.isClosed = true
                    addToOpenList(bottomLeft, cell)
                    return bottomLeft
                }
            }
        }        
    }

    const showPath = (cell: Cell) => {
        cell.isPath = true
        if(cell.parent) showPath(cell.parent)
    }

    const algo = () => {
        if(!start || !finish) return        

        //init, add all 8 neighbors for the start node
        const leftTop = grid.find(f => f.y === start.y - 1)?.cells.find(c => c.x === start.x - 1)
        if(leftTop) addToOpenList(leftTop, start)
        const top = grid.find(f => f.y === start.y - 1)?.cells.find(c => c.x === start.x)
        if(top) addToOpenList(top, start)
        const rightTop = grid.find(f => f.y === start.y - 1)?.cells.find(c => c.x === start.x + 1)
        if(rightTop) addToOpenList(rightTop, start)

        const left = grid.find(f => f.y === start.y)?.cells.find(c => c.x === start.x - 1)
        if(left) addToOpenList(left, start)
        const right = grid.find(f => f.y === start.y)?.cells.find(c => c.x === start.x + 1)
        if(right) addToOpenList(right, start)

        const leftBottom = grid.find(f => f.y === start.y + 1)?.cells.find(c => c.x === start.x - 1)
        if(leftBottom) addToOpenList(leftBottom, start)
        const bottom = grid.find(f => f.y === start.y + 1)?.cells.find(c => c.x === start.x)
        if(bottom) addToOpenList(bottom, start)
        const rightBottom = grid.find(f => f.y === start.y + 1)?.cells.find(c => c.x === start.x + 1)
        if(rightBottom) addToOpenList(rightBottom, start)

        let result : Cell | undefined = undefined
        while (!openList.isEmpty()){
            let node = openList.dequeue()            

            while(true) {
                if(!node) break         
                result = searchHorizontaly(node)
                if(result) break
                result = searchVertically(node)
                if(result) break
                let point = moveDiagonal(node)
                if(point && point.isFinish) {point.parent = node; result = point; break}
                node = point
            }
            if(result) break
        }
        alert(result ? 'Success' : 'Not found')
        if(result) showPath(result)
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