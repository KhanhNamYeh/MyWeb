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
// return a 200 status with empty authors instead of 401
if (!$user_id) {
    echo json_encode(['success' => true, 'authors' => []]);
    exit();
}

// Get top 3 authors based on order item count for this user
$stmt = $conn->prepare("
    SELECT 
        b.author AS name,
        b.name AS bookTitle,
        COUNT(oi.id) AS orderCount,
        MAX(b.image) AS image
    FROM 
        order_items oi
        JOIN books b ON oi.book_id = b.id
        JOIN orders o ON oi.order_id = o.id
    WHERE 
        o.user_id = ? 
        AND b.author IS NOT NULL 
        AND b.author != ''
    GROUP BY 
        b.author
    ORDER BY 
        COUNT(oi.id) DESC, 
        MAX(oi.order_id) DESC
    LIMIT 3
");

$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$authors = [];
while ($row = $result->fetch_assoc()) {
    $authors[] = [
        'name' => $row['name'],
        'bookTitle' => $row['bookTitle'],
        'orderCount' => (int)$row['orderCount'],
        'image' => $row['image']
    ];
}

echo json_encode(['success' => true, 'authors' => $authors]);
$conn->close();
exit();