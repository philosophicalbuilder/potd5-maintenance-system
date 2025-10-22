<?php
require_once 'config/database.php';

// Create the maintenance_requests table
try {
    $sql = "CREATE TABLE IF NOT EXISTS maintenance_requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        date VARCHAR(10) NOT NULL,
        room VARCHAR(50) NOT NULL,
        requested_by VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        priority ENUM('low', 'medium', 'high') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )";
    
    $pdo->exec($sql);
    echo "Table 'maintenance_requests' created successfully!\n";
    
    // Insert some sample data
    $sampleData = [
        ['2021-08-12', '12', 'Dumpty', 'fix carpet', 'medium'],
        ['2025-10-21', '1', 'cole', 'fix code', 'high'],
        ['2025-05-30', 'Rice 130', 'Tester', 'Need help', 'medium']
    ];
    
    $stmt = $pdo->prepare("INSERT INTO maintenance_requests (date, room, requested_by, description, priority) VALUES (?, ?, ?, ?, ?)");
    
    foreach ($sampleData as $data) {
        $stmt->execute($data);
    }
    
    echo "Sample data inserted successfully!\n";
    
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
