<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Start session to check user role
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Include database configuration
require_once 'config.php';

// Check database connection
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Database connection error']);
    exit();
}

// Check if user is logged in and has admin role
if (!isset($_SESSION['user_id']) || !isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Permission denied. Admin access required.']);
    exit();
}

// Get and decode request data
$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['action'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid request']);
    exit();
}

$action = $input['action'];

// Handle get users action
if ($action === 'get_users') {
    try {
        $stmt = $conn->prepare("SELECT id, name, login, email, phone, role, image FROM users ORDER BY id");
        $stmt->execute();
        $result = $stmt->get_result();
        
        $users = [];
        while ($row = $result->fetch_assoc()) {
            $users[] = $row;
        }
        
        $stmt->close();
        
        http_response_code(200);
        echo json_encode(['success' => true, 'users' => $users]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    
// Handle add user action
} elseif ($action === 'add_user') {
    if (!isset($input['user_data'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'User data missing']);
        exit();
    }
    
    $userData = $input['user_data'];
    
    // Validate required fields
    if (empty($userData['name']) || empty($userData['login']) || empty($userData['email']) || empty($userData['password'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Required fields missing']);
        exit();
    }
    
    try {
        // Check if login or email already exists
        $stmt = $conn->prepare("SELECT id FROM users WHERE login = ? OR email = ?");
        $stmt->bind_param("ss", $userData['login'], $userData['email']);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $stmt->close();
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Login or email already exists']);
            exit();
        }
        $stmt->close();
        
        // Hash password
        $hashedPassword = password_hash($userData['password'], PASSWORD_DEFAULT);
        
        // Insert new user
        $stmt = $conn->prepare("INSERT INTO users (name, login, password, email, phone, role, image) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sssssss", 
            $userData['name'], 
            $userData['login'],
            $hashedPassword,
            $userData['email'],
            $userData['phone'],
            $userData['role'],
            $userData['image']
        );
        
        if (!$stmt->execute()) {
            throw new Exception("Failed to add user: " . $stmt->error);
        }
        
        $userId = $conn->insert_id;
        $stmt->close();
        
        // Return the new user with ID
        $newUser = [
            'id' => $userId,
            'name' => $userData['name'],
            'login' => $userData['login'],
            'email' => $userData['email'],
            'phone' => $userData['phone'],
            'role' => $userData['role'],
            'image' => $userData['image']
        ];
        
        http_response_code(201);
        echo json_encode(['success' => true, 'message' => 'User added successfully', 'user' => $newUser]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    
// Handle update user action
} elseif ($action === 'update_user') {
    if (!isset($input['user_id']) || !isset($input['user_data'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'User ID or data missing']);
        exit();
    }
    
    $userId = $input['user_id'];
    $userData = $input['user_data'];
    
    try {
        // Check if login or email already exists and belongs to another user
        $stmt = $conn->prepare("SELECT id FROM users WHERE (login = ? OR email = ?) AND id != ?");
        $stmt->bind_param("ssi", $userData['login'], $userData['email'], $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $stmt->close();
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Login or email already exists for another user']);
            exit();
        }
        $stmt->close();
        
        // Update user with or without password change
        if (!empty($userData['password'])) {
            // Hash the new password
            $hashedPassword = password_hash($userData['password'], PASSWORD_DEFAULT);
            
            $stmt = $conn->prepare("UPDATE users SET name = ?, login = ?, password = ?, email = ?, phone = ?, role = ?, image = ? WHERE id = ?");
            $stmt->bind_param("sssssssi", 
                $userData['name'], 
                $userData['login'],
                $hashedPassword,
                $userData['email'],
                $userData['phone'],
                $userData['role'],
                $userData['image'],
                $userId
            );
        } else {
            // Update without changing password
            $stmt = $conn->prepare("UPDATE users SET name = ?, login = ?, email = ?, phone = ?, role = ?, image = ? WHERE id = ?");
            $stmt->bind_param("ssssssi", 
                $userData['name'], 
                $userData['login'],
                $userData['email'],
                $userData['phone'],
                $userData['role'],
                $userData['image'],
                $userId
            );
        }
        
        if (!$stmt->execute()) {
            throw new Exception("Failed to update user: " . $stmt->error);
        }
        $stmt->close();
        
        // Update session if current user is updating themselves
        if (isset($_SESSION['user_id']) && $_SESSION['user_id'] == $userId) {
            $_SESSION['name'] = $userData['name'];
            $_SESSION['login'] = $userData['login'];
            $_SESSION['email'] = $userData['email'];
            $_SESSION['role'] = $userData['role'];
            if (!empty($userData['image'])) {
                $_SESSION['image'] = $userData['image'];
            }
        }
        
        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'User updated successfully']);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    
// Handle delete user action
} elseif ($action === 'delete_user') {
    if (!isset($input['user_id'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'User ID missing']);
        exit();
    }
    
    $userId = $input['user_id'];
    
    // Don't allow deletion of the current logged-in user
    if ($_SESSION['user_id'] == $userId) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'You cannot delete your own account']);
        exit();
    }
    
    try {
        $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
        $stmt->bind_param("i", $userId);
        
        if (!$stmt->execute()) {
            throw new Exception("Failed to delete user: " . $stmt->error);
        }
        
        if ($stmt->affected_rows === 0) {
            $stmt->close();
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'User not found']);
            exit();
        }
        
        $stmt->close();
        
        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'User deleted successfully']);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid action']);
}

$conn->close();
exit();