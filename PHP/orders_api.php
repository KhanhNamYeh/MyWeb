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
// This allows the component to work even without login
if (!$user_id) {
    echo json_encode(['success' => true, 'orders' => []]);
    exit();
}

// Handle order operations based on request method
switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        // Get order history for the current user
        $stmt = $conn->prepare("
            SELECT o.id as order_id, o.total, o.status as order_status, 
                   oi.quantity, oi.price,
                   b.id as book_id, b.name, b.author, b.price as original_price, b.sale, b.image
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            JOIN books b ON oi.book_id = b.id
            WHERE o.user_id = ?
            ORDER BY o.id DESC
        ");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $orders = [];
        while ($row = $result->fetch_assoc()) {
            $orders[] = [
                'id' => (int)$row['book_id'],
                'name' => $row['name'],
                'author' => $row['author'],
                'price' => (float)$row['original_price'],
                'sale' => is_null($row['sale']) ? (float)$row['price'] : (float)$row['sale'],
                'image' => $row['image'],
                'quantity' => (int)$row['quantity'],
                'status' => $row['order_status'],
                'order_id' => (int)$row['order_id'],
                'form' => 'Order #' . $row['order_id']
            ];
        }
        
        echo json_encode(['success' => true, 'orders' => $orders]);
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'error' => 'Method not allowed']);
        break;
}

$conn->close();
exit();