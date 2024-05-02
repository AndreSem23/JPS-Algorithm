import { useCallback, useEffect, useState } from "react"
import Cell from "../types/Cell"
import CellBox from "./CellBox"
import CellRow from "../types/CellRow"

type Props = {
    size:number
}

const Grid = ({size}:Props) => {
    const [grid, setGrid] = useState<CellRow[]>([])
    const [start, setStart] = useState<Cell | null>(null)
    const [finish, setFinish] = useState<Cell | null>(null)

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
                    isStart: false,
                    isFinish: false,
                    parent: null
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

    
      return(        
        <div>
            {grid.map(r => (
                <div key={r.y} style={{ display: 'flex' }}>
                    {r.cells.map(c => (
                        <CellBox key={c.x} cell={c} onCellClicked={onCellClicked} matrixSize={size}/>
                    ))}
                </div>
            ))}
        </div>        
      )
}

export default Grid