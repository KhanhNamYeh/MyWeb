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

require_once 'config.php';

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Database connection error']);
    exit();
}

// Get user ID from session
$user_id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null;

// For demonstration purposes, if no user is logged in, 
// return a 200 status with empty orders instead of 401
if (!$user_id) {
    echo json_encode(['success' => true, 'orders' => []]);
    exit();
}

// Get the 3 most recent order items
$stmt = $conn->prepare("
    SELECT 
        oi.id AS order_item_id,
        b.name,
        oi.quantity,
        o.status,
        o.id AS order_id
    FROM 
        order_items oi
        JOIN books b ON oi.book_id = b.id
        JOIN orders o ON oi.order_id = o.id
    WHERE 
        o.user_id = ?
    ORDER BY 
        o.id DESC, oi.id DESC
    LIMIT 3
");

$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$orders = [];
while ($row = $result->fetch_assoc()) {
    $orders[] = [
        'name' => $row['name'],
        'quantity' => (int)$row['quantity'],
        'status' => $row['status'],
        'order_id' => (int)$row['order_id']
    ];
}

echo json_encode(['success' => true, 'orders' => $orders]);
$conn->close();
exit();