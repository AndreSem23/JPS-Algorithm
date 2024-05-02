export default interface Cell {
    x: number
    y: number
    isObstacle: boolean
    isStart: boolean
    isFinish: boolean
    isClosed: boolean
    parent: Cell | null    
}