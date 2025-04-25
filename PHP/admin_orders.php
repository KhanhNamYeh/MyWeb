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

// Handle get orders action
if ($action === 'get_orders') {
    try {
        // Prepare query to get all orders with user information
        $stmt = $conn->prepare("
            SELECT o.id, o.user_id, o.total, o.status, 
                   u.name as user_name, u.email as user_email
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.id
            ORDER BY o.id DESC
        ");
        $stmt->execute();
        $result = $stmt->get_result();
        
        $orders = [];
        while ($row = $result->fetch_assoc()) {
            // For each order, get its items
            $orderId = $row['id'];
            $itemStmt = $conn->prepare("
                SELECT oi.id, oi.book_id, oi.quantity, oi.price, b.name as book_title
                FROM order_items oi
                LEFT JOIN books b ON oi.book_id = b.id
                WHERE oi.order_id = ?
            ");
            $itemStmt->bind_param("i", $orderId);
            $itemStmt->execute();
            $itemResult = $itemStmt->get_result();
            
            $items = [];
            while ($itemRow = $itemResult->fetch_assoc()) {
                $items[] = $itemRow;
            }
            $itemStmt->close();
            
            // Add items to the order
            $row['items'] = $items;
            $orders[] = $row;
        }
        
        $stmt->close();
        
        http_response_code(200);
        echo json_encode(['success' => true, 'orders' => $orders]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    
// Handle update order status action
} elseif ($action === 'update_order_status') {
    if (!isset($input['order_id']) || !isset($input['status'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Order ID or status missing']);
        exit();
    }
    
    $orderId = $input['order_id'];
    $status = $input['status'];
    
    // Validate status
    $validStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!in_array($status, $validStatuses)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid status']);
        exit();
    }
    
    try {
        $stmt = $conn->prepare("UPDATE orders SET status = ? WHERE id = ?");
        $stmt->bind_param("si", $status, $orderId);
        
        if (!$stmt->execute()) {
            throw new Exception("Failed to update order: " . $stmt->error);
        }
        
        if ($stmt->affected_rows === 0) {
            $stmt->close();
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Order not found']);
            exit();
        }
        
        $stmt->close();
        
        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'Order status updated successfully']);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    
// Handle delete order action
} elseif ($action === 'delete_order') {
    if (!isset($input['order_id'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Order ID missing']);
        exit();
    }
    
    $orderId = $input['order_id'];
    
    // Start transaction
    $conn->begin_transaction();
    
    try {
        // Delete order items first (foreign key constraint)
        $stmt = $conn->prepare("DELETE FROM order_items WHERE order_id = ?");
        $stmt->bind_param("i", $orderId);
        if (!$stmt->execute()) {
            throw new Exception("Failed to delete order items: " . $stmt->error);
        }
        $stmt->close();
        
        // Delete the order
        $stmt = $conn->prepare("DELETE FROM orders WHERE id = ?");
        $stmt->bind_param("i", $orderId);
        if (!$stmt->execute()) {
            throw new Exception("Failed to delete order: " . $stmt->error);
        }
        
        if ($stmt->affected_rows === 0) {
            throw new Exception("Order not found");
        }
        
        $stmt->close();
        
        // Commit transaction
        $conn->commit();
        
        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'Order deleted successfully']);
        
    } catch (Exception $e) {
        // Rollback on error
        $conn->rollback();
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid action']);
}

$conn->close();
exit();