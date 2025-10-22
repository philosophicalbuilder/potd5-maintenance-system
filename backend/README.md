# Maintenance Request Management System - PHP Backend

This is a PHP backend implementation for the maintenance request dashboard, designed for CS 4750 database interfacing requirements.

## Features Implemented

✅ **CREATE** - Insert new maintenance requests into the database  
✅ **READ** - Display existing maintenance requests in a table  
✅ **UPDATE** - Edit existing maintenance requests  
✅ **DELETE** - Remove maintenance requests from the database  
✅ **Database Table** - `maintenance_requests` table with proper structure  

## Setup Instructions

### 1. Database Setup
1. Make sure you have MySQL/MariaDB running
2. Create a database called `maintenance_db`:
   ```sql
   CREATE DATABASE maintenance_db;
   ```

### 2. Configure Database Connection
Edit `backend/config/database.php` and update the connection details:
```php
$host = 'localhost';
$dbname = 'maintenance_db';
$username = 'root';        // Change to your MySQL username
$password = '';           // Change to your MySQL password
```

### 3. Create Table and Sample Data
Run the setup script to create the table and insert sample data:
```bash
php backend/setup.php
```

### 4. Test the Backend
1. Start a local PHP server:
   ```bash
   cd backend
   php -S localhost:8000
   ```
2. Open http://localhost:8000 in your browser
3. You should see the maintenance request management interface

## Database Schema

### Table: `maintenance_requests`
```sql
CREATE TABLE maintenance_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date VARCHAR(10) NOT NULL,
    room VARCHAR(50) NOT NULL,
    requested_by VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    priority ENUM('low', 'medium', 'high') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## API Endpoints

The backend provides REST API endpoints for the React frontend:

- **GET** `/api/requests.php` - Get all maintenance requests
- **POST** `/api/requests.php` - Create a new maintenance request
- **PUT** `/api/requests.php` - Update an existing maintenance request
- **DELETE** `/api/requests.php?id={id}` - Delete a maintenance request

## CS 4750 Requirements Met

✅ **Create a table** - `maintenance_requests` table created  
✅ **Insert data** - Form to add new maintenance requests  
✅ **Display data** - Table showing all existing requests  
✅ **Update data** - Edit functionality for existing requests  
✅ **Delete data** - Delete functionality with confirmation  
✅ **Drop table** - Can be done via SQL: `DROP TABLE maintenance_requests;`  

## Next Steps

To connect your React frontend to this PHP backend:

1. Update the React app to make API calls to `http://localhost:8000/api/requests.php`
2. Replace the hardcoded data with API calls
3. Handle loading states and error handling
4. Test the full CRUD functionality

## File Structure
```
backend/
├── config/
│   └── database.php          # Database connection
├── api/
│   └── requests.php          # REST API endpoints
├── setup.php                 # Database setup script
└── index.php                 # Web interface for testing
```
