<?php
/**
 * add.php
 * Example PHP insert logic using prepared statements (source-only).
 * This demonstrates how server-side code might insert a record.
 */

// Example function to add a record (note: placeholder only)
function add_record($name, $value) {
    // $pdo = get_db(); // from connection.php
    // Example prepared statement (not executed here)
    $sql = "INSERT INTO items (name, value) VALUES (:name, :value)";
    // $stmt = $pdo->prepare($sql);
    // $stmt->execute([':name' => $name, ':value' => $value]);
    // return $pdo->lastInsertId();
    return [
        'sql' => $sql,
        'params' => [':name' => $name, ':value' => $value]
    ];
}

// Example usage (commented out because this is static source)
//$result = add_record('test', 123);
//var_dump($result);

?>
