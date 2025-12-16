"""
Fibonacci Sequence Generator
Calculates fibonacci numbers using both iterative and recursive approaches.
"""

def fibonacci_iterative(n):
    """
    Generate fibonacci sequence up to n terms (iterative approach)
    Time Complexity: O(n)
    Space Complexity: O(1)
    """
    if n <= 0:
        return []
    elif n == 1:
        return [0]
    
    sequence = [0, 1]
    for i in range(2, n):
        sequence.append(sequence[i-1] + sequence[i-2])
    return sequence


def fibonacci_recursive(n):
    """
    Calculate nth fibonacci number (recursive approach)
    Time Complexity: O(2^n) - exponential
    Space Complexity: O(n) - call stack
    Note: Use with small values of n due to inefficiency
    """
    if n <= 1:
        return n
    return fibonacci_recursive(n-1) + fibonacci_recursive(n-2)


def fibonacci_memoized(n, memo={}):
    """
    Calculate nth fibonacci number (recursive with memoization)
    Time Complexity: O(n)
    Space Complexity: O(n)
    """
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    
    memo[n] = fibonacci_memoized(n-1, memo) + fibonacci_memoized(n-2, memo)
    return memo[n]


if __name__ == "__main__":
    # Example usage
    print("Fibonacci Iterative (first 10 terms):")
    print(fibonacci_iterative(10))
    
    print("\nFibonacci Recursive (10th term):")
    print(fibonacci_recursive(10))
    
    print("\nFibonacci Memoized (20th term):")
    print(fibonacci_memoized(20))
