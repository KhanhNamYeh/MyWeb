<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
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

if (!$user_id) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'User not logged in']);
    exit();
}

// Process checkout - mark all cart items as purchased (status = 1)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Optional: Get cart items to calculate total for order record
    // Synchronize any temporary cart items if provided
    if (isset($input['tempCart']) && is_array($input['tempCart'])) {
        foreach ($input['tempCart'] as $item) {
            if (!isset($item['id']) || !isset($item['quantity'])) continue;
            
            $book_id = (int)$item['id'];
            $quantity = (int)$item['quantity'];
            
            // Check if item already exists in cart
            $stmt = $conn->prepare("SELECT id FROM carts WHERE user_id = ? AND book_id = ? AND status = 0");
            $stmt->bind_param("ii", $user_id, $book_id);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result->num_rows > 0) {
                // Update existing item
                $row = $result->fetch_assoc();
                $update_stmt = $conn->prepare("UPDATE carts SET quantity = ? WHERE id = ?");
                $update_stmt->bind_param("ii", $quantity, $row['id']);
                $update_stmt->execute();
            } else {
                // Add new item
                $insert_stmt = $conn->prepare("INSERT INTO carts (user_id, book_id, quantity) VALUES (?, ?, ?)");
                $insert_stmt->bind_param("iii", $user_id, $book_id, $quantity);
                $insert_stmt->execute();
            }
        }
    }
    
    // Update all user's cart items to purchased status
    $stmt = $conn->prepare("UPDATE carts SET status = 1 WHERE user_id = ? AND status = 0");
    $stmt->bind_param("i", $user_id);
    $success = $stmt->execute();
    
    if ($success) {
        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'Checkout successful']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Checkout failed']);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
}

$conn->close();
exit();