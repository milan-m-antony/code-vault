"""
Bubble Sort Implementation
One of the simplest sorting algorithms with clear visualization potential.
"""

def bubble_sort(arr):
    """
    Sort array using bubble sort algorithm
    Time Complexity: O(n²) worst and average case, O(n) best case
    Space Complexity: O(1) - in-place sorting
    
    How it works:
    - Compare adjacent elements
    - Swap if they are in wrong order
    - Repeat until array is sorted
    """
    n = len(arr)
    
    for i in range(n):
        # Flag to optimize for already sorted arrays
        swapped = False
        
        # Last i elements are already in place
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                # Swap elements
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        
        # If no swaps occurred, array is sorted
        if not swapped:
            break
    
    return arr


def bubble_sort_verbose(arr):
    """
    Bubble sort with step-by-step output for learning
    """
    n = len(arr)
    print(f"Sorting: {arr}")
    
    for i in range(n):
        swapped = False
        print(f"\nPass {i + 1}:")
        
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
                print(f"  Swapped {arr[j+1]} and {arr[j]}: {arr}")
        
        if not swapped:
            print("  Array is sorted!")
            break
    
    return arr


if __name__ == "__main__":
    # Test cases
    test_array = [64, 34, 25, 12, 22, 11, 90]
    print("Original array:", test_array)
    
    sorted_array = bubble_sort(test_array.copy())
    print("Sorted array:", sorted_array)
    
    print("\n" + "="*40)
    print("Verbose sorting process:")
    print("="*40)
    
    bubble_sort_verbose([5, 2, 8, 1, 9])
