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

// Process checkout
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
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
    
    try {
        // Start transaction
        $conn->begin_transaction();
        
        // Get all cart items for this user
        $cart_stmt = $conn->prepare("
            SELECT c.id, c.book_id, c.quantity, b.price 
            FROM carts c
            JOIN books b ON c.book_id = b.id
            WHERE c.user_id = ? AND c.status = 0
        ");
        $cart_stmt->bind_param("i", $user_id);
        $cart_stmt->execute();
        $cart_items = $cart_stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        
        // If cart is empty, return error
        if (empty($cart_items)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Cart is empty']);
            exit();
        }
        
        // Calculate total order amount
        $total = 0;
        foreach ($cart_items as $item) {
            $total += $item['price'] * $item['quantity'];
        }
        
        // Create new order
        $order_stmt = $conn->prepare("INSERT INTO orders (user_id, total) VALUES (?, ?)");
        $order_stmt->bind_param("id", $user_id, $total);
        $order_stmt->execute();
        $order_id = $conn->insert_id;
        
        // Insert order items
        $item_stmt = $conn->prepare("
            INSERT INTO order_items (order_id, book_id, quantity, price) 
            VALUES (?, ?, ?, ?)
        ");
        
        foreach ($cart_items as $item) {
            $item_stmt->bind_param("iiid", $order_id, $item['book_id'], $item['quantity'], $item['price']);
            $item_stmt->execute();
        }
        
        // Delete cart items (instead of just marking them as purchased)
        $delete_stmt = $conn->prepare("DELETE FROM carts WHERE user_id = ? AND status = 0");
        $delete_stmt->bind_param("i", $user_id);
        $delete_stmt->execute();
        
        // Commit transaction
        $conn->commit();
        
        http_response_code(200);
        echo json_encode([
            'success' => true, 
            'message' => 'Checkout successful',
            'order_id' => $order_id,
            'total' => $total
        ]);
        
    } catch (Exception $e) {
        // Rollback transaction on error
        $conn->rollback();
        
        http_response_code(500);
        echo json_encode([
            'success' => false, 
            'error' => 'Checkout failed: ' . $e->getMessage()
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
}

$conn->close();
exit();