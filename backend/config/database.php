<?php
// Database configuration for Railway
$database_url = getenv("DATABASE_URL");

// Debug: Let's see what we're getting
error_log("DATABASE_URL: " . ($database_url ?: "NOT SET"));

if (!$database_url) {
    die("DATABASE_URL environment variable is not set!");
}

$url = parse_url($database_url);

if (!$url) {
    die("Failed to parse DATABASE_URL: " . $database_url);
}

$host = $url["host"];
$dbname = substr($url["path"], 1);
$username = $url["user"];
$password = $url["pass"];

// Debug: Let's see the parsed values
error_log("Host: " . $host);
error_log("Database: " . $dbname);
error_log("Username: " . $username);

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}
?>
