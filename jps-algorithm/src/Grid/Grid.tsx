import { useCallback, useEffect, useState } from "react"
import Cell from "../types/Cell"
import CellBox from "./CellBox"
import CellRow from "../types/CellRow"

type Props = {
    rows: number
    cols: number
}

const Grid = ({rows, cols}:Props) => {
    const [grid, setGrid] = useState<CellRow[]>([])


    const createGrid = useCallback(() => {
        const cellRows: CellRow[] = []
        for (let y = 1; y <= rows; y++) {
            const cells: Cell[] = []
            for (let x = 1; x <= cols; x++) {
                const cell: Cell = {
                    id: y*x,
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
    }, [rows, cols])

    useEffect(() => {
        createGrid()
    },[ createGrid])

    
      return(        
        <div>
            {grid.map(r => (
                <div key={r.y} style={{ display: 'flex' }}>
                    {r.cells.map(c => (
                        <div>
                            <CellBox key={c.x} cell={c} />
                        </div>
                    ))}
                </div>
            ))}
        </div>        
      )
}

export default Grid