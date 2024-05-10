export default interface Cell {
    x: number
    y: number
    isObstacle: boolean
    isStart: boolean
    isFinish: boolean
    isClosed: boolean
    isOpen: boolean
    isPath: boolean
    gScore: number
    fScore: number
    parent: Cell | null    
    direction: string
}