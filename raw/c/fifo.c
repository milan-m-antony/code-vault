#include <stdio.h>
#include <stdlib.h>

/*
 * FIFO Queue Implementation
 * First In, First Out data structure
 * Operations: enqueue (add), dequeue (remove), peek
 */

#define QUEUE_SIZE 100

typedef struct {
    int items[QUEUE_SIZE];
    int front;
    int rear;
    int count;
} Queue;

/*
 * Initialize empty queue
 * Time Complexity: O(1)
 */
Queue* queue_create() {
    Queue* q = (Queue*)malloc(sizeof(Queue));
    q->front = 0;
    q->rear = -1;
    q->count = 0;
    return q;
}

/*
 * Add element to rear of queue
 * Time Complexity: O(1)
 */
void enqueue(Queue* q, int value) {
    if (q->count >= QUEUE_SIZE) {
        printf("Queue overflow!\n");
        return;
    }
    q->rear = (q->rear + 1) % QUEUE_SIZE;
    q->items[q->rear] = value;
    q->count++;
    printf("Enqueued: %d\n", value);
}

/*
 * Remove and return element from front of queue
 * Time Complexity: O(1)
 */
int dequeue(Queue* q) {
    if (q->count <= 0) {
        printf("Queue underflow!\n");
        return -1;
    }
    int value = q->items[q->front];
    q->front = (q->front + 1) % QUEUE_SIZE;
    q->count--;
    printf("Dequeued: %d\n", value);
    return value;
}

/*
 * View element at front without removing
 * Time Complexity: O(1)
 */
int peek(Queue* q) {
    if (q->count <= 0) {
        printf("Queue is empty!\n");
        return -1;
    }
    return q->items[q->front];
}

/*
 * Check if queue is empty
 */
int is_empty(Queue* q) {
    return q->count == 0;
}

/*
 * Get current queue size
 */
int queue_size(Queue* q) {
    return q->count;
}

/*
 * Print all elements in queue
 */
void print_queue(Queue* q) {
    if (is_empty(q)) {
        printf("Queue is empty\n");
        return;
    }
    printf("Queue (front to rear): ");
    for (int i = 0; i < q->count; i++) {
        int idx = (q->front + i) % QUEUE_SIZE;
        printf("%d ", q->items[idx]);
    }
    printf("\n");
}

/*
 * Free queue memory
 */
void queue_free(Queue* q) {
    free(q);
}

int main() {
    Queue* q = queue_create();
    
    printf("=== FIFO Queue Operations ===\n\n");
    
    printf("Enqueuing elements: 10, 20, 30, 40\n");
    enqueue(q, 10);
    enqueue(q, 20);
    enqueue(q, 30);
    enqueue(q, 40);
    print_queue(q);
    
    printf("\nPeek front element: %d\n", peek(q));
    printf("Queue size: %d\n", queue_size(q));
    
    printf("\nDequeuing 2 elements:\n");
    dequeue(q);
    dequeue(q);
    print_queue(q);
    
    printf("\nEnqueuing 50, 60\n");
    enqueue(q, 50);
    enqueue(q, 60);
    print_queue(q);
    
    printf("\nDequeuing all elements:\n");
    while (!is_empty(q)) {
        dequeue(q);
    }
    
    printf("\nAttempting to dequeue from empty queue:\n");
    dequeue(q);
    
    queue_free(q);
    return 0;
}
