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

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['action'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid request']);
    exit();
}

$action = $input['action'];

if ($action === 'login') {
    if (!isset($input['login']) || !isset($input['password'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Missing login or password']);
        exit();
    }

    $login_input = trim($input['login']);
    $password_input = trim($input['password']);

    if (empty($login_input) || empty($password_input)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Login and password must not be empty']);
        exit();
    }

    $stmt = $conn->prepare("SELECT id, name, login, password, email, role, image FROM users WHERE login = ? OR email = ?");
    $stmt->bind_param("ss", $login_input, $login_input);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();
        if ($password_input === $user['password']) {
            session_regenerate_id(true);
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['name'] = $user['name'];
            $_SESSION['login'] = $user['login'];
            $_SESSION['email'] = $user['email'];
            $_SESSION['role'] = $user['role'];
            $_SESSION['image'] = $user['image'];

            // Check if guest cart exists in request and process it
            if (isset($input['guestCart']) && is_array($input['guestCart'])) {
                foreach ($input['guestCart'] as $item) {
                    if (!isset($item['id']) || !isset($item['quantity'])) continue;
                    
                    $book_id = (int)$item['id'];
                    $quantity = (int)$item['quantity'];
                    
                    // Check if item already exists in cart
                    $cart_stmt = $conn->prepare("SELECT id, quantity FROM carts WHERE user_id = ? AND book_id = ? AND status = 0");
                    $cart_stmt->bind_param("ii", $user['id'], $book_id);
                    $cart_stmt->execute();
                    $cart_result = $cart_stmt->get_result();
                    
                    if ($cart_result->num_rows > 0) {
                        // Update existing cart item
                        $cart_row = $cart_result->fetch_assoc();
                        $new_quantity = $cart_row['quantity'] + $quantity;
                        
                        $update_stmt = $conn->prepare("UPDATE carts SET quantity = ? WHERE id = ?");
                        $update_stmt->bind_param("ii", $new_quantity, $cart_row['id']);
                        $update_stmt->execute();
                    } else {
                        // Add new item to cart
                        $insert_stmt = $conn->prepare("INSERT INTO carts (user_id, book_id, quantity) VALUES (?, ?, ?)");
                        $insert_stmt->bind_param("iii", $user['id'], $book_id, $quantity);
                        $insert_stmt->execute();
                    }
                }
            }

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Login successful',
                'user' => [
                    'id' => $user['id'],
                    'name' => $user['name'],
                    'login' => $user['login'],
                    'email' => $user['email'],
                    'role' => $user['role'],
                    'image' => $user['image']
                ]
            ]);
        } else {
            http_response_code(401);
            echo json_encode(['success' => false, 'error' => 'Invalid login or password']);
        }
    } else {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Invalid login or password']);
    }
    $stmt->close();

} elseif ($action === 'register') {
    if (!isset($input['name']) || !isset($input['login']) || !isset($input['password']) || !isset($input['email'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Missing required fields']);
        exit();
    }

    $name = trim($input['name']);
    $login = trim($input['login']);
    $email = trim($input['email']);
    $password = trim($input['password']);
    $role = 'user';
    $phone = isset($input['phone']) ? trim($input['phone']) : null;
    $image = isset($input['image']) ? trim($input['image']) : null;

    if (empty($name) || empty($login) || empty($email) || empty($password)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Fields must not be empty']);
        exit();
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid email format']);
        exit();
    }

    $stmt = $conn->prepare("SELECT id FROM users WHERE login = ?");
    $stmt->bind_param("s", $login);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows > 0) {
        http_response_code(409);
        echo json_encode(['success' => false, 'error' => 'Login already exists']);
        $stmt->close();
        $conn->close();
        exit();
    }
    $stmt->close();

    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows > 0) {
        http_response_code(409);
        echo json_encode(['success' => false, 'error' => 'Email is already in use']);
        $stmt->close();
        $conn->close();
        exit();
    }
    $stmt->close();

    $stmt = $conn->prepare("INSERT INTO users (name, login, password, email, phone, role, image) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssssss", $name, $login, $password, $email, $phone, $role, $image);

    if ($stmt->execute()) {
        // Get new user ID for further operations
        $new_user_id = $conn->insert_id;
        
        // If guest cart data is provided, add it to the new user's cart
        if (isset($input['guestCart']) && is_array($input['guestCart'])) {
            foreach ($input['guestCart'] as $item) {
                if (!isset($item['id']) || !isset($item['quantity'])) continue;
                
                $book_id = (int)$item['id'];
                $quantity = (int)$item['quantity'];
                
                $cart_stmt = $conn->prepare("INSERT INTO carts (user_id, book_id, quantity) VALUES (?, ?, ?)");
                $cart_stmt->bind_param("iii", $new_user_id, $book_id, $quantity);
                $cart_stmt->execute();
            }
        }
        
        http_response_code(201);
        echo json_encode(['success' => true, 'message' => 'Registration successful']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Registration failed']);
    }
    $stmt->close();

} elseif ($action === 'logout') {
    // Clear session data
    $_SESSION = array();
    
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }
    
    session_destroy();
    
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Logout successful']);
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid action']);
}

$conn->close();
exit();