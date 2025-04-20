<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
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

$input = json_decode(file_get_contents('php://input'), true);

// Get user ID from session if logged in
$user_id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null;

// Handle cart operations based on request method
switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        // Get cart items for the current user
        if ($user_id) {
            $stmt = $conn->prepare("
                SELECT c.id, c.book_id, c.quantity, b.name as title, b.author, b.price, b.sale, b.image
                FROM carts c
                JOIN books b ON c.book_id = b.id
                WHERE c.user_id = ? AND c.status = 0
            ");
            $stmt->bind_param("i", $user_id);
            $stmt->execute();
            $result = $stmt->get_result();
            
            $cartItems = [];
            while ($row = $result->fetch_assoc()) {
                $cartItems[] = [
                    'id' => (int)$row['book_id'],
                    'title' => $row['title'],
                    'author' => $row['author'],
                    'price' => (float)$row['price'],
                    'sale' => $row['sale'] ? (float)$row['sale'] : null,
                    'image' => $row['image'],
                    'quantity' => (int)$row['quantity'],
                    'cart_id' => (int)$row['id']
                ];
            }
            
            echo json_encode(['success' => true, 'cart' => $cartItems]);
        } else {
            echo json_encode(['success' => true, 'cart' => []]);
        }
        break;
        
    case 'POST':
        // Add item to cart or update quantity
        if (!isset($input['book_id']) || !isset($input['quantity'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Missing book_id or quantity']);
            exit();
        }
        
        $book_id = (int)$input['book_id'];
        $quantity = (int)$input['quantity'];
        
        if ($user_id) {
            // Check if item already exists in cart
            $stmt = $conn->prepare("SELECT id, quantity FROM carts WHERE user_id = ? AND book_id = ? AND status = 0");
            $stmt->bind_param("ii", $user_id, $book_id);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result->num_rows > 0) {
                // Update existing cart item
                $row = $result->fetch_assoc();
                $new_quantity = $row['quantity'] + $quantity;
                
                $update_stmt = $conn->prepare("UPDATE carts SET quantity = ? WHERE id = ?");
                $update_stmt->bind_param("ii", $new_quantity, $row['id']);
                $success = $update_stmt->execute();
                
                echo json_encode(['success' => $success, 'message' => $success ? 'Cart updated' : 'Failed to update cart']);
            } else {
                // Add new item to cart
                $insert_stmt = $conn->prepare("INSERT INTO carts (user_id, book_id, quantity) VALUES (?, ?, ?)");
                $insert_stmt->bind_param("iii", $user_id, $book_id, $quantity);
                $success = $insert_stmt->execute();
                
                echo json_encode(['success' => $success, 'message' => $success ? 'Added to cart' : 'Failed to add to cart']);
            }
        } else {
            // For non-logged in users, return success but items will be stored in local state
            echo json_encode(['success' => true, 'message' => 'Item added to temporary cart']);
        }
        break;
        
    case 'PUT':
        // Update cart item quantity
        if (!isset($input['book_id']) || !isset($input['quantity'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Missing book_id or quantity']);
            exit();
        }
        
        $book_id = (int)$input['book_id'];
        $quantity = (int)$input['quantity'];
        
        if ($user_id) {
            $stmt = $conn->prepare("UPDATE carts SET quantity = ? WHERE user_id = ? AND book_id = ? AND status = 0");
            $stmt->bind_param("iii", $quantity, $user_id, $book_id);
            $success = $stmt->execute();
            
            echo json_encode(['success' => $success, 'message' => $success ? 'Quantity updated' : 'Failed to update quantity']);
        } else {
            echo json_encode(['success' => true, 'message' => 'Quantity updated in temporary cart']);
        }
        break;
        
    case 'DELETE':
        // Remove item from cart
        if (!isset($input['book_id'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Missing book_id']);
            exit();
        }
        
        $book_id = (int)$input['book_id'];
        
        if ($user_id) {
            $stmt = $conn->prepare("DELETE FROM carts WHERE user_id = ? AND book_id = ? AND status = 0");
            $stmt->bind_param("ii", $user_id, $book_id);
            $success = $stmt->execute();
            
            echo json_encode(['success' => $success, 'message' => $success ? 'Item removed from cart' : 'Failed to remove item']);
        } else {
            echo json_encode(['success' => true, 'message' => 'Item removed from temporary cart']);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'error' => 'Method not allowed']);
        break;
}

$conn->close();
exit();