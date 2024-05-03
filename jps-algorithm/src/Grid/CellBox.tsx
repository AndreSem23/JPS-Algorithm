import Cell from "../types/Cell"

type Props = {
    cell: Cell
    matrixSize: number
    onCellClicked: (c: Cell) => void    
}

const CellBox = ({cell, matrixSize, onCellClicked}:Props) => {

    const determineClass = (cell: Cell) => {
        if(cell.isPath) return '#ffbe2e'
        if(cell.isObstacle) return 'black'
        if(cell.isClosed) return 'lightgray'
        if(cell.isStart) return '#1a4480'
        if(cell.isFinish) return 'green'
        if(cell.isOpen) return '#caa3bb'        
    }

    return (
        <div className="d-flex justify-content-center"
            onClick={() => onCellClicked(cell)}
            style={{
                width: `${(0.95*window.innerHeight)/matrixSize}px`,
                height: `${(0.95*window.innerHeight)/matrixSize}px`,
                borderTop: '1px solid black',
                borderLeft: '1px solid black',
                borderRight: cell.x === matrixSize ? '1px solid black': '',
                borderBottom: cell.y === matrixSize ? '1px solid black': '',
                backgroundColor: `${determineClass(cell)}`,
            }}
        >{cell.direction}</div>
    )
}

export default CellBox