<?php
// Database configuration for Heroku
$url = parse_url(getenv("DATABASE_URL") ?: "mysql://root:@localhost/maintenance_db");

$host = $url["host"];
$dbname = substr($url["path"], 1);
$username = $url["user"];
$password = $url["pass"];

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}
?>
