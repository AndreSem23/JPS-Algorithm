type QueueItem<T> = {
    item: T;
    priority: number;
  };
  
  // Priority Queue class
  class PriorityQueue<T> {
    private queue: QueueItem<T>[] = [];
  
    // Function to add an item to the priority queue
    enqueue(item: T, priority: number): void {
      const newItem: QueueItem<T> = { item, priority };
      // Find the correct position to insert based on priority
      let i = 0;
      while (i < this.queue.length && this.queue[i].priority >= priority) {
        i++;
      }
      // Splice the new item into the queue
      this.queue.splice(i, 0, newItem);
    }
  
    // Function to remove the highest priority item from the queue
    dequeue(): T | undefined {
      if (this.isEmpty()) {
        console.log("Queue is empty!");
        return undefined;
      }
      // Remove and return the highest priority item
      return this.queue.shift()?.item;
    }
  
    // Function to check if the queue is empty
    isEmpty(): boolean {
      return this.queue.length === 0;
    }
  
    // Function to peek at the highest priority item without removing it
    peek(): T | undefined {
      if (this.isEmpty()) {
        console.log("Queue is empty!");
        return undefined;
      }
      return this.queue[0].item;
    }
  
    // Function to get the size of the queue
    size(): number {
      return this.queue.length;
    }
  
    // Function to clear the queue
    clear(): void {
      this.queue = [];
    }
  
    // Function to display the contents of the queue
    display(): void {
      console.log("Queue Contents:");
      this.queue.forEach(item => {
        console.log(`Priority: ${item.priority}, Item: ${item.item}`);
      });
    }
  }
  
  export default PriorityQueue