#include <stdio.h>
#include <stdlib.h>
#include <math.h>

/*
 * Prime Number Checker
 * Functions to determine if a number is prime
 */

/*
 * Check if number is prime
 * Time Complexity: O(sqrt(n))
 * Space Complexity: O(1)
 */
int is_prime(int num) {
    if (num <= 1) return 0;
    if (num == 2) return 1;
    if (num % 2 == 0) return 0;
    
    // Check odd divisors up to sqrt(num)
    for (int i = 3; i <= sqrt(num); i += 2) {
        if (num % i == 0) return 0;
    }
    return 1;
}

/*
 * Generate all primes up to n using Sieve of Eratosthenes
 * Time Complexity: O(n log log n)
 * Space Complexity: O(n)
 */
void sieve_of_eratosthenes(int n) {
    // Create array and mark all as prime initially
    int* prime = (int*)malloc((n + 1) * sizeof(int));
    for (int i = 0; i <= n; i++) {
        prime[i] = 1;
    }
    
    prime[0] = prime[1] = 0;
    
    // Mark multiples of each prime as non-prime
    for (int p = 2; p * p <= n; p++) {
        if (prime[p]) {
            for (int i = p * p; i <= n; i += p) {
                prime[i] = 0;
            }
        }
    }
    
    // Print all primes
    printf("Primes up to %d:\n", n);
    for (int i = 2; i <= n; i++) {
        if (prime[i]) printf("%d ", i);
    }
    printf("\n");
    
    free(prime);
}

/*
 * Count primes up to n
 */
int count_primes(int n) {
    int count = 0;
    for (int i = 2; i <= n; i++) {
        if (is_prime(i)) count++;
    }
    return count;
}

/*
 * Find next prime after given number
 */
int next_prime(int num) {
    int candidate = num + 1;
    while (!is_prime(candidate)) {
        candidate++;
    }
    return candidate;
}

int main() {
    printf("=== Prime Number Checker ===\n\n");
    
    // Test individual numbers
    int test_numbers[] = {2, 3, 4, 10, 17, 20, 97, 100};
    int size = sizeof(test_numbers) / sizeof(test_numbers[0]);
    
    printf("Testing individual numbers:\n");
    for (int i = 0; i < size; i++) {
        int num = test_numbers[i];
        printf("%d is %s\n", num, is_prime(num) ? "PRIME" : "NOT PRIME");
    }
    
    printf("\n");
    
    // Count primes up to 50
    printf("Number of primes up to 50: %d\n\n", count_primes(50));
    
    // Generate primes using Sieve
    sieve_of_eratosthenes(50);
    
    printf("\n");
    
    // Find next primes
    printf("Next prime after 10: %d\n", next_prime(10));
    printf("Next prime after 97: %d\n", next_prime(97));
    
    return 0;
}
