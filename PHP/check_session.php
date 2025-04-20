<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Start session
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Check if user is logged in
if (isset($_SESSION['user_id'])) {
    // Return user data
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'user' => [
            'id' => $_SESSION['user_id'],
            'name' => $_SESSION['name'],
            'login' => $_SESSION['login'],
            'email' => $_SESSION['email'],
            'role' => $_SESSION['role'],
            'image' => isset($_SESSION['image']) ? $_SESSION['image'] : null
        ]
    ]);
} else {
    // User not logged in
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Not logged in']);
}

exit();