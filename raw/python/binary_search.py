"""
Binary Search Implementation
Fast search algorithm for sorted arrays.
"""

def binary_search(arr, target):
    """
    Search for target in sorted array using binary search
    Time Complexity: O(log n)
    Space Complexity: O(1) - iterative approach
    
    Returns: Index of target if found, -1 otherwise
    """
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            # Target is in right half
            left = mid + 1
        else:
            # Target is in left half
            right = mid - 1
    
    return -1


def binary_search_recursive(arr, target, left=0, right=None):
    """
    Binary search using recursion
    Time Complexity: O(log n)
    Space Complexity: O(log n) - call stack
    """
    if right is None:
        right = len(arr) - 1
    
    if left > right:
        return -1
    
    mid = (left + right) // 2
    
    if arr[mid] == target:
        return mid
    elif arr[mid] < target:
        return binary_search_recursive(arr, target, mid + 1, right)
    else:
        return binary_search_recursive(arr, target, left, mid - 1)


def binary_search_leftmost(arr, target):
    """
    Find leftmost (first) occurrence of target
    """
    left, right = 0, len(arr) - 1
    result = -1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            result = mid
            right = mid - 1  # Continue searching left
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return result


def binary_search_rightmost(arr, target):
    """
    Find rightmost (last) occurrence of target
    """
    left, right = 0, len(arr) - 1
    result = -1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            result = mid
            left = mid + 1  # Continue searching right
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return result


if __name__ == "__main__":
    # Test array (must be sorted for binary search)
    arr = [2, 5, 8, 12, 16, 23, 38, 45, 56, 67, 78]
    
    print("Array:", arr)
    print()
    
    # Test basic binary search
    test_values = [16, 45, 100, 2]
    for val in test_values:
        idx = binary_search(arr, val)
        print(f"Search {val}: Index {idx}")
    
    print()
    
    # Test with duplicates
    arr_dup = [1, 2, 2, 2, 3, 4, 4, 5]
    print("Array with duplicates:", arr_dup)
    target = 2
    
    left = binary_search_leftmost(arr_dup, target)
    right = binary_search_rightmost(arr_dup, target)
    print(f"Leftmost {target}: Index {left}")
    print(f"Rightmost {target}: Index {right}")
