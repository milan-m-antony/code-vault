#include <stdio.h>
#include <stdlib.h>

/*
 * Quick Sort Implementation
 * Efficient divide-and-conquer sorting algorithm
 * Time Complexity: O(n log n) average, O(n²) worst case
 * Space Complexity: O(log n) - recursion stack
 */

/*
 * Partition array and return pivot index
 */
int partition(int arr[], int low, int high) {
    // Choose rightmost element as pivot
    int pivot = arr[high];
    
    // Index of smaller element - indicates the right position
    // of pivot found so far
    int i = low - 1;
    
    // Traverse through all elements
    // Compare each element with pivot
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            // Swap arr[i] and arr[j]
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    
    // Swap arr[i+1] and arr[high] (pivot)
    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    
    return i + 1;
}

/*
 * Main quick sort function
 */
void quick_sort(int arr[], int low, int high) {
    if (low < high) {
        // pi is partitioning index
        // arr[pi] is now at right place
        int pi = partition(arr, low, high);
        
        // Separately sort elements before
        // and after partition
        quick_sort(arr, low, pi - 1);
        quick_sort(arr, pi + 1, high);
    }
}

/*
 * Print array
 */
void print_array(int arr[], int n) {
    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");
}

/*
 * Alternative: 3-way partition for handling duplicates
 */
void quick_sort_3way(int arr[], int low, int high) {
    if (low >= high) return;
    
    int i = low, j = high;
    int k = low;
    int pivot = arr[low];
    
    while (k <= j) {
        if (arr[k] < pivot) {
            int temp = arr[i];
            arr[i] = arr[k];
            arr[k] = temp;
            i++;
            k++;
        } else if (arr[k] > pivot) {
            int temp = arr[k];
            arr[k] = arr[j];
            arr[j] = temp;
            j--;
        } else {
            k++;
        }
    }
    
    quick_sort_3way(arr, low, i - 1);
    quick_sort_3way(arr, j + 1, high);
}

int main() {
    printf("=== Quick Sort Implementation ===\n\n");
    
    // Test case 1: Random array
    int arr1[] = {64, 34, 25, 12, 22, 11, 90};
    int n1 = sizeof(arr1) / sizeof(arr1[0]);
    
    printf("Original array: ");
    print_array(arr1, n1);
    
    quick_sort(arr1, 0, n1 - 1);
    
    printf("Sorted array: ");
    print_array(arr1, n1);
    
    // Test case 2: Already sorted
    printf("\n");
    int arr2[] = {1, 2, 3, 4, 5};
    int n2 = sizeof(arr2) / sizeof(arr2[0]);
    
    printf("Original array: ");
    print_array(arr2, n2);
    
    quick_sort(arr2, 0, n2 - 1);
    
    printf("Sorted array: ");
    print_array(arr2, n2);
    
    // Test case 3: Reverse sorted
    printf("\n");
    int arr3[] = {5, 4, 3, 2, 1};
    int n3 = sizeof(arr3) / sizeof(arr3[0]);
    
    printf("Original array: ");
    print_array(arr3, n3);
    
    quick_sort(arr3, 0, n3 - 1);
    
    printf("Sorted array: ");
    print_array(arr3, n3);
    
    // Test case 4: With duplicates
    printf("\n");
    int arr4[] = {3, 3, 1, 2, 3, 1, 2};
    int n4 = sizeof(arr4) / sizeof(arr4[0]);
    
    printf("Original array (with duplicates): ");
    print_array(arr4, n4);
    
    quick_sort_3way(arr4, 0, n4 - 1);
    
    printf("Sorted array: ");
    print_array(arr4, n4);
    
    return 0;
}
