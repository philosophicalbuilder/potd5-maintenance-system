<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Maintenance Requests - PHP Backend</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 20px;
        }
        h1, h2 {
            color: #333;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .form-group {
            margin-bottom: 15px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        input, select, textarea {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
        }
        button {
            background-color: #007bff;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin-right: 10px;
        }
        button:hover {
            background-color: #0056b3;
        }
        .delete-btn {
            background-color: #dc3545;
        }
        .delete-btn:hover {
            background-color: #c82333;
        }
        .success {
            color: green;
            font-weight: bold;
        }
        .error {
            color: red;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Maintenance Request Management System</h1>
        <p>PHP Backend with MySQL Database</p>
        
        <?php
        require_once 'config/database.php';
        
        // Handle form submissions
        if ($_POST) {
            if (isset($_POST['action'])) {
                switch($_POST['action']) {
                    case 'create':
                        try {
                            $stmt = $pdo->prepare("INSERT INTO maintenance_requests (date, room, requested_by, description, priority) VALUES (?, ?, ?, ?, ?)");
                            $stmt->execute([
                                $_POST['date'],
                                $_POST['room'],
                                $_POST['requested_by'],
                                $_POST['description'],
                                $_POST['priority']
                            ]);
                            echo "<div class='success'>Maintenance request created successfully!</div>";
                        } catch(PDOException $e) {
                            echo "<div class='error'>Error creating request: " . $e->getMessage() . "</div>";
                        }
                        break;
                        
                    case 'update':
                        try {
                            $stmt = $pdo->prepare("UPDATE maintenance_requests SET date = ?, room = ?, requested_by = ?, description = ?, priority = ? WHERE id = ?");
                            $stmt->execute([
                                $_POST['date'],
                                $_POST['room'],
                                $_POST['requested_by'],
                                $_POST['description'],
                                $_POST['priority'],
                                $_POST['id']
                            ]);
                            echo "<div class='success'>Maintenance request updated successfully!</div>";
                        } catch(PDOException $e) {
                            echo "<div class='error'>Error updating request: " . $e->getMessage() . "</div>";
                        }
                        break;
                        
                    case 'delete':
                        try {
                            $stmt = $pdo->prepare("DELETE FROM maintenance_requests WHERE id = ?");
                            $stmt->execute([$_POST['id']]);
                            echo "<div class='success'>Maintenance request deleted successfully!</div>";
                        } catch(PDOException $e) {
                            echo "<div class='error'>Error deleting request: " . $e->getMessage() . "</div>";
                        }
                        break;
                }
            }
        }
        ?>
        
        <!-- Create/Update Form -->
        <h2><?php echo isset($_GET['edit']) ? 'Update' : 'Create'; ?> Maintenance Request</h2>
        <form method="POST">
            <input type="hidden" name="action" value="<?php echo isset($_GET['edit']) ? 'update' : 'create'; ?>">
            <?php if (isset($_GET['edit'])): ?>
                <input type="hidden" name="id" value="<?php echo $_GET['edit']; ?>">
            <?php endif; ?>
            
            <div class="form-group">
                <label for="date">Requested Date:</label>
                <input type="text" id="date" name="date" placeholder="yyyy-mm-dd" required
                       value="<?php echo isset($_GET['edit']) ? $editRequest['date'] : ''; ?>">
            </div>
            
            <div class="form-group">
                <label for="room">Room Number:</label>
                <input type="text" id="room" name="room" required
                       value="<?php echo isset($_GET['edit']) ? $editRequest['room'] : ''; ?>">
            </div>
            
            <div class="form-group">
                <label for="requested_by">Requested By:</label>
                <input type="text" id="requested_by" name="requested_by" required
                       value="<?php echo isset($_GET['edit']) ? $editRequest['requested_by'] : ''; ?>">
            </div>
            
            <div class="form-group">
                <label for="description">Description:</label>
                <textarea id="description" name="description" rows="3" required><?php echo isset($_GET['edit']) ? $editRequest['description'] : ''; ?></textarea>
            </div>
            
            <div class="form-group">
                <label for="priority">Priority:</label>
                <select id="priority" name="priority" required>
                    <option value="">Select Priority</option>
                    <option value="low" <?php echo (isset($_GET['edit']) && $editRequest['priority'] == 'low') ? 'selected' : ''; ?>>Low</option>
                    <option value="medium" <?php echo (isset($_GET['edit']) && $editRequest['priority'] == 'medium') ? 'selected' : ''; ?>>Medium</option>
                    <option value="high" <?php echo (isset($_GET['edit']) && $editRequest['priority'] == 'high') ? 'selected' : ''; ?>>High</option>
                </select>
            </div>
            
            <button type="submit"><?php echo isset($_GET['edit']) ? 'Update Request' : 'Create Request'; ?></button>
            <?php if (isset($_GET['edit'])): ?>
                <a href="index.php" style="text-decoration: none;">
                    <button type="button">Cancel</button>
                </a>
            <?php endif; ?>
        </form>
    </div>
    
    <div class="container">
        <h2>All Maintenance Requests</h2>
        
        <?php
        try {
            $stmt = $pdo->query("SELECT * FROM maintenance_requests ORDER BY id DESC");
            $requests = $stmt->fetchAll();
            
            if (empty($requests)) {
                echo "<p>No maintenance requests found.</p>";
            } else {
                echo "<table>";
                echo "<tr><th>ID</th><th>Date</th><th>Room</th><th>Requested By</th><th>Description</th><th>Priority</th><th>Actions</th></tr>";
                
                foreach ($requests as $request) {
                    echo "<tr>";
                    echo "<td>" . htmlspecialchars($request['id']) . "</td>";
                    echo "<td>" . htmlspecialchars($request['date']) . "</td>";
                    echo "<td>" . htmlspecialchars($request['room']) . "</td>";
                    echo "<td>" . htmlspecialchars($request['requested_by']) . "</td>";
                    echo "<td>" . htmlspecialchars($request['description']) . "</td>";
                    echo "<td>" . htmlspecialchars($request['priority']) . "</td>";
                    echo "<td>";
                    echo "<a href='?edit=" . $request['id'] . "' style='text-decoration: none;'>";
                    echo "<button style='background-color: #28a745; margin-right: 5px;'>Edit</button>";
                    echo "</a>";
                    echo "<form method='POST' style='display: inline;'>";
                    echo "<input type='hidden' name='action' value='delete'>";
                    echo "<input type='hidden' name='id' value='" . $request['id'] . "'>";
                    echo "<button type='submit' class='delete-btn' onclick='return confirm(\"Are you sure you want to delete this request?\")'>Delete</button>";
                    echo "</form>";
                    echo "</td>";
                    echo "</tr>";
                }
                echo "</table>";
            }
        } catch(PDOException $e) {
            echo "<div class='error'>Error fetching requests: " . $e->getMessage() . "</div>";
        }
        
        // Handle edit mode
        if (isset($_GET['edit'])) {
            $editId = $_GET['edit'];
            $stmt = $pdo->prepare("SELECT * FROM maintenance_requests WHERE id = ?");
            $stmt->execute([$editId]);
            $editRequest = $stmt->fetch();
            
            if (!$editRequest) {
                echo "<div class='error'>Request not found!</div>";
                unset($_GET['edit']);
            }
        }
        ?>
    </div>
    
    <div class="container">
        <h2>Database Operations</h2>
        <p><strong>CRUD Operations Implemented:</strong></p>
        <ul>
            <li><strong>CREATE:</strong> Add new maintenance requests</li>
            <li><strong>READ:</strong> Display all maintenance requests in a table</li>
            <li><strong>UPDATE:</strong> Edit existing maintenance requests</li>
            <li><strong>DELETE:</strong> Remove maintenance requests</li>
        </ul>
        
        <p><strong>Database Table:</strong> maintenance_requests</p>
        <p><strong>Fields:</strong> id, date, room, requested_by, description, priority, created_at, updated_at</p>
    </div>
</body>
</html>
