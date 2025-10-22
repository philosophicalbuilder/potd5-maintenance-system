<?php
require_once '../config/database.php';

// Set content type to JSON
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

try {
    switch($method) {
        case 'GET':
            // Get all maintenance requests
            $stmt = $pdo->query("SELECT * FROM maintenance_requests ORDER BY id DESC");
            $requests = $stmt->fetchAll();
            echo json_encode($requests);
            break;
            
        case 'POST':
            // Create new maintenance request
            $stmt = $pdo->prepare("INSERT INTO maintenance_requests (date, room, requested_by, description, priority) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([
                $input['date'],
                $input['room'],
                $input['by'] ?? $input['requested_by'], // Handle both field names
                $input['description'],
                $input['priority']
            ]);
            
            $newId = $pdo->lastInsertId();
            $stmt = $pdo->prepare("SELECT * FROM maintenance_requests WHERE id = ?");
            $stmt->execute([$newId]);
            $newRequest = $stmt->fetch();
            
            echo json_encode($newRequest);
            break;
            
        case 'PUT':
            // Update existing maintenance request
            $id = $input['id'];
            $stmt = $pdo->prepare("UPDATE maintenance_requests SET date = ?, room = ?, requested_by = ?, description = ?, priority = ? WHERE id = ?");
            $stmt->execute([
                $input['date'],
                $input['room'],
                $input['by'] ?? $input['requested_by'], // Handle both field names
                $input['description'],
                $input['priority'],
                $id
            ]);
            
            $stmt = $pdo->prepare("SELECT * FROM maintenance_requests WHERE id = ?");
            $stmt->execute([$id]);
            $updatedRequest = $stmt->fetch();
            
            echo json_encode($updatedRequest);
            break;
            
        case 'DELETE':
            // Delete maintenance request
            $id = $_GET['id'];
            $stmt = $pdo->prepare("DELETE FROM maintenance_requests WHERE id = ?");
            $stmt->execute([$id]);
            
            echo json_encode(['success' => true, 'message' => 'Request deleted successfully']);
            break;
            
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
    }
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
