<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

$isLoggedIn = isset($_SESSION['user_id']) && !empty($_SESSION['user_id']);
$userData = null;

if ($isLoggedIn) {
    $userData = [
        'id' => $_SESSION['user_id'],
        'name' => $_SESSION['name'] ?? null,
        'login' => $_SESSION['login'] ?? null,
        'email' => $_SESSION['email'] ?? null,
        'role' => $_SESSION['role'] ?? null
    ];
}

echo json_encode([
    'isLoggedIn' => $isLoggedIn,
    'user' => $userData
]);
exit();