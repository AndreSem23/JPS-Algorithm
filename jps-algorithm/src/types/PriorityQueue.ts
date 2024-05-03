type QueueItem<T> = {
    item: T;
    priority: number;
  };
  
  class PriorityQueue<T> {
    private queue: QueueItem<T>[] = [];
  
    enqueue(item: T, priority: number): void {
      const newItem: QueueItem<T> = { item, priority };
      let i = 0;
      while (i < this.queue.length && this.queue[i].priority >= priority) {
        i++;
      }
      this.queue.splice(i, 0, newItem);
    }
  
    dequeue(): T | undefined {
      if (this.isEmpty()) {
        console.log("Queue is empty!");
        return undefined;
      }
      return this.queue.shift()?.item;
    }
  
    isEmpty(): boolean {
      return this.queue.length === 0;
    }
  
    size(): number {
      return this.queue.length;
    }
  }
  
  export default PriorityQueue