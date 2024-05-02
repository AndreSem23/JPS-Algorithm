import Cell from "../types/Cell"

type Props = {
    cell: Cell
    matrixSize: number
    onCellClicked: (c: Cell) => void    
}

const CellBox = ({cell, matrixSize, onCellClicked}:Props) => {

    const determineClass = (cell: Cell) => {
        if(cell.isObstacle) return 'black'
        if(cell.isClosed) return 'gray'
        if(cell.isStart) return 'green'
        if(cell.isFinish) return 'red'
    }

    return (
        <div
            onClick={() => onCellClicked(cell)}
            style={{
                width: `${(0.97*window.innerHeight)/matrixSize}px`,
                height: `${(0.97*window.innerHeight)/matrixSize}px`,
                borderTop: '1px solid black',
                borderLeft: '1px solid black',
                borderRight: cell.x === matrixSize ? '1px solid black': '',
                borderBottom: cell.y === matrixSize ? '1px solid black': '',
                backgroundColor: `${determineClass(cell)}`,
            }}
        />
    )
}

export default CellBox