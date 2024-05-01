import Cell from "../types/Cell"

type Props = {
    cell: Cell
}

const CellBox = ({cell}:Props) => {

    const determineClass = (cell: Cell) => {
        if(cell.isObstacle) return 'black'
        if(cell.isClosed) return 'gray'
        if(cell.isStart) return 'green'
        if(cell.isFinish) return 'red'
    }

    return (
        <div
            onClick={() => alert(`${cell.x}-${cell.y} is clicked`)}
            style={{
                width: `${(window.innerHeight-50)/20}px`,
                height: `${(window.innerHeight-50)/20}px`,
                border: '1px solid black',
                backgroundColor: `${determineClass(cell)}`,
            }}
        />
    )
}

export default CellBox