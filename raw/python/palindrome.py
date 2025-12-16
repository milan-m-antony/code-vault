"""
Palindrome Checker
Validates whether a string is a palindrome with various approaches.
"""

def is_palindrome_simple(s):
    """
    Check if string is palindrome (case-insensitive, ignoring spaces/punctuation)
    Time Complexity: O(n)
    Space Complexity: O(n) - for new string
    """
    cleaned = ''.join(char.lower() for char in s if char.isalnum())
    return cleaned == cleaned[::-1]


def is_palindrome_two_pointer(s):
    """
    Check if string is palindrome using two-pointer approach
    Time Complexity: O(n)
    Space Complexity: O(1) - no extra space
    """
    left, right = 0, len(s) - 1
    
    while left < right:
        # Skip non-alphanumeric characters
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1
        
        # Compare characters (case-insensitive)
        if s[left].lower() != s[right].lower():
            return False
        
        left += 1
        right -= 1
    
    return True


def is_palindrome_number(n):
    """
    Check if a number is palindrome
    Time Complexity: O(log n)
    Space Complexity: O(1)
    """
    if n < 0:
        return False
    
    original = n
    reversed_num = 0
    
    while n > 0:
        reversed_num = reversed_num * 10 + n % 10
        n //= 10
    
    return original == reversed_num


if __name__ == "__main__":
    # Test cases
    test_cases = [
        "A man, a plan, a canal: Panama",
        "race a car",
        "0P",
        "12321",
        "hello"
    ]
    
    print("Palindrome Checker Results:")
    for test in test_cases:
        result = is_palindrome_simple(test)
        print(f"'{test}' -> {result}")
    
    print("\nNumber Palindromes:")
    numbers = [121, 123, 0, -121, 1001]
    for num in numbers:
        result = is_palindrome_number(num)
        print(f"{num} -> {result}")
