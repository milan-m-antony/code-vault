<?php
/**
 * connection.php
 * Example PHP source showing a PDO connection (for viewing only).
 * NOTE: This file is not executed on the static host — it's plain source.
 */

// Database configuration (example placeholders)
$dbHost = 'DB_HOST';
$dbName = 'DB_NAME';
$dbUser = 'DB_USER';
$dbPass = 'DB_PASS';

try {
    // DSN for MySQL using PDO
    $dsn = "mysql:host=$dbHost;dbname=$dbName;charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];

    // Example (placeholder) connection — will not run on static hosting
    $pdo = new PDO($dsn, $dbUser, $dbPass, $options);
} catch (PDOException $e) {
    // In a real app you would handle errors, here we only show example code
    // echo 'Connection failed: ' . $e->getMessage();
}

// Example helper to get PDO instance
function get_db() {
    global $pdo;
    return $pdo;
}

?>
