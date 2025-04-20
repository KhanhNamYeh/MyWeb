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

// Start session if not already started
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

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Not authenticated']);
    exit();
}

// Handle POST request - Update user info
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the request data
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid request data']);
        exit();
    }
    
    $userId = $_SESSION['user_id'];
    $name = isset($data['name']) ? trim($data['name']) : null;
    $login = isset($data['login']) ? trim($data['login']) : null;
    $email = isset($data['email']) ? trim($data['email']) : null;
    $phone = isset($data['phone']) ? trim($data['phone']) : null;
    $password = isset($data['password']) && $data['password'] !== '******' ? $data['password'] : null;
    $image = isset($data['image']) ? trim($data['image']) : null;
    
    // Validate input
    if (empty($name) || empty($login) || empty($email)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Name, login and email are required']);
        exit();
    }
    
    // Check if login is already taken by another user
    $stmt = $conn->prepare("SELECT id FROM users WHERE login = ? AND id != ?");
    $stmt->bind_param("si", $login, $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        http_response_code(409);
        echo json_encode(['success' => false, 'error' => 'Login is already taken']);
        exit();
    }
    
    // Check if email is already taken by another user
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ? AND id != ?");
    $stmt->bind_param("si", $email, $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        http_response_code(409);
        echo json_encode(['success' => false, 'error' => 'Email is already taken']);
        exit();
    }
    
    // Update user information including the new image field
    if ($password) {
        // Update with new password
        $stmt = $conn->prepare("UPDATE users SET name = ?, login = ?, password = ?, email = ?, phone = ?, image = ? WHERE id = ?");
        $stmt->bind_param("ssssssi", $name, $login, $password, $email, $phone, $image, $userId);
    } else {
        // Update without changing password
        $stmt = $conn->prepare("UPDATE users SET name = ?, login = ?, email = ?, phone = ?, image = ? WHERE id = ?");
        $stmt->bind_param("sssssi", $name, $login, $email, $phone, $image, $userId);
    }
    
    if ($stmt->execute()) {
        // Fetch updated user data
        $stmt = $conn->prepare("SELECT id, name, login, email, role, image, phone, password FROM users WHERE id = ?");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        $userData = $result->fetch_assoc();
        
        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'Profile updated successfully', 'user' => $userData]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to update profile: ' . $conn->error]);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
}

$conn->close();
exit();