#include <stdio.h>
#include <stdlib.h>

/*
 * Singly Linked List Implementation
 * Dynamic data structure for storing elements
 */

typedef struct Node {
    int data;
    struct Node* next;
} Node;

/*
 * Create new node
 * Time Complexity: O(1)
 */
Node* create_node(int data) {
    Node* new_node = (Node*)malloc(sizeof(Node));
    new_node->data = data;
    new_node->next = NULL;
    return new_node;
}

/*
 * Insert node at beginning
 * Time Complexity: O(1)
 */
Node* insert_at_beginning(Node* head, int data) {
    Node* new_node = create_node(data);
    new_node->next = head;
    return new_node;
}

/*
 * Insert node at end
 * Time Complexity: O(n)
 */
Node* insert_at_end(Node* head, int data) {
    Node* new_node = create_node(data);
    
    if (head == NULL) return new_node;
    
    Node* current = head;
    while (current->next != NULL) {
        current = current->next;
    }
    current->next = new_node;
    return head;
}

/*
 * Insert node at specific position
 * Time Complexity: O(n)
 */
Node* insert_at_position(Node* head, int data, int position) {
    if (position == 0) {
        return insert_at_beginning(head, data);
    }
    
    Node* current = head;
    for (int i = 0; i < position - 1 && current != NULL; i++) {
        current = current->next;
    }
    
    if (current == NULL) {
        printf("Position out of bounds\n");
        return head;
    }
    
    Node* new_node = create_node(data);
    new_node->next = current->next;
    current->next = new_node;
    return head;
}

/*
 * Delete node at beginning
 * Time Complexity: O(1)
 */
Node* delete_at_beginning(Node* head) {
    if (head == NULL) return NULL;
    
    Node* temp = head;
    head = head->next;
    free(temp);
    return head;
}

/*
 * Delete node with specific value
 * Time Complexity: O(n)
 */
Node* delete_node(Node* head, int data) {
    if (head == NULL) return NULL;
    
    if (head->data == data) {
        Node* temp = head;
        head = head->next;
        free(temp);
        return head;
    }
    
    Node* current = head;
    while (current->next != NULL) {
        if (current->next->data == data) {
            Node* temp = current->next;
            current->next = temp->next;
            free(temp);
            return head;
        }
        current = current->next;
    }
    
    printf("Node with data %d not found\n", data);
    return head;
}

/*
 * Search for value in list
 * Time Complexity: O(n)
 */
int search(Node* head, int data) {
    Node* current = head;
    int position = 0;
    
    while (current != NULL) {
        if (current->data == data) {
            return position;
        }
        current = current->next;
        position++;
    }
    
    return -1;
}

/*
 * Display all nodes
 */
void display(Node* head) {
    if (head == NULL) {
        printf("List is empty\n");
        return;
    }
    
    printf("Linked List: ");
    Node* current = head;
    while (current != NULL) {
        printf("%d -> ", current->data);
        current = current->next;
    }
    printf("NULL\n");
}

/*
 * Get length of list
 * Time Complexity: O(n)
 */
int get_length(Node* head) {
    int count = 0;
    Node* current = head;
    while (current != NULL) {
        count++;
        current = current->next;
    }
    return count;
}

/*
 * Reverse the list
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
Node* reverse(Node* head) {
    Node* prev = NULL;
    Node* current = head;
    
    while (current != NULL) {
        Node* next = current->next;
        current->next = prev;
        prev = current;
        current = next;
    }
    
    return prev;
}

/*
 * Free entire list
 */
void free_list(Node* head) {
    Node* current = head;
    while (current != NULL) {
        Node* temp = current;
        current = current->next;
        free(temp);
    }
}

int main() {
    Node* head = NULL;
    
    printf("=== Linked List Operations ===\n\n");
    
    printf("Inserting at end: 10, 20, 30, 40\n");
    head = insert_at_end(head, 10);
    head = insert_at_end(head, 20);
    head = insert_at_end(head, 30);
    head = insert_at_end(head, 40);
    display(head);
    
    printf("\nInserting 15 at beginning\n");
    head = insert_at_beginning(head, 15);
    display(head);
    
    printf("\nInserting 25 at position 3\n");
    head = insert_at_position(head, 25, 3);
    display(head);
    
    printf("\nList length: %d\n", get_length(head));
    
    printf("\nSearch for 30: Position %d\n", search(head, 30));
    printf("Search for 50: Position %d\n", search(head, 50));
    
    printf("\nDeleting node with value 20\n");
    head = delete_node(head, 20);
    display(head);
    
    printf("\nReversing the list\n");
    head = reverse(head);
    display(head);
    
    printf("\nDeleting from beginning\n");
    head = delete_at_beginning(head);
    display(head);
    
    free_list(head);
    printf("\nList freed successfully\n");
    
    return 0;
}
