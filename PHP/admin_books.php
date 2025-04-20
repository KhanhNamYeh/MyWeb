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

// Function to get categories IDs from names
function getCategoryIds($conn, $genreString) {
    $categoryIds = [];
    $genreArray = explode(',', $genreString);
    
    foreach ($genreArray as $genre) {
        $genre = trim($genre);
        if (empty($genre)) continue;
        
        // Check if category exists
        $stmt = $conn->prepare("SELECT id FROM categories WHERE name = ?");
        $stmt->bind_param("s", $genre);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $categoryIds[] = $row['id'];
        } else {
            // Create new category
            $stmt = $conn->prepare("INSERT INTO categories (name) VALUES (?)");
            $stmt->bind_param("s", $genre);
            $stmt->execute();
            $categoryIds[] = $conn->insert_id;
        }
        
        $stmt->close();
    }
    
    return $categoryIds;
}

// Handle add book action
if ($action === 'add_book') {
    if (!isset($input['book_data'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Book data missing']);
        exit();
    }
    
    $bookData = $input['book_data'];
    
    // Validate required fields
    if (empty($bookData['title']) || empty($bookData['author']) || !isset($bookData['price'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Required fields missing']);
        exit();
    }
    
    // Start transaction
    $conn->begin_transaction();
    
    try {
        // Insert into books table
        $stmt = $conn->prepare("INSERT INTO books (name, author, price, sale, promotion, image) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssddss", 
            $bookData['title'], 
            $bookData['author'], 
            $bookData['price'],
            $bookData['sale'],
            $bookData['promotion'],
            $bookData['image']
        );
        
        if (!$stmt->execute()) {
            throw new Exception("Failed to insert book");
        }
        
        $bookId = $conn->insert_id;
        $stmt->close();
        
        // Process categories
        if (!empty($bookData['genre'])) {
            $categoryIds = getCategoryIds($conn, $bookData['genre']);
            
            foreach ($categoryIds as $categoryId) {
                $stmt = $conn->prepare("INSERT INTO book_categories (book_id, category_id) VALUES (?, ?)");
                $stmt->bind_param("ii", $bookId, $categoryId);
                if (!$stmt->execute()) {
                    throw new Exception("Failed to assign category");
                }
                $stmt->close();
            }
        }
        
        // Commit transaction
        $conn->commit();
        
        http_response_code(201);
        echo json_encode(['success' => true, 'message' => 'Book added successfully', 'book_id' => $bookId]);
        
    } catch (Exception $e) {
        // Rollback on error
        $conn->rollback();
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    
// Handle update book action
} elseif ($action === 'update_book') {
    if (!isset($input['book_id']) || !isset($input['book_data'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Book ID or data missing']);
        exit();
    }
    
    $bookId = $input['book_id'];
    $bookData = $input['book_data'];
    
    // Start transaction
    $conn->begin_transaction();
    
    try {
        // Update books table
        $stmt = $conn->prepare("UPDATE books SET name = ?, author = ?, price = ?, sale = ?, promotion = ?, image = ? WHERE id = ?");
        $stmt->bind_param("ssddssi", 
            $bookData['title'], 
            $bookData['author'], 
            $bookData['price'],
            $bookData['sale'],
            $bookData['promotion'],
            $bookData['image'],
            $bookId
        );
        
        if (!$stmt->execute()) {
            throw new Exception("Failed to update book");
        }
        $stmt->close();
        
        // Delete existing category relationships
        $stmt = $conn->prepare("DELETE FROM book_categories WHERE book_id = ?");
        $stmt->bind_param("i", $bookId);
        if (!$stmt->execute()) {
            throw new Exception("Failed to clear categories");
        }
        $stmt->close();
        
        // Process categories
        if (!empty($bookData['genre'])) {
            $categoryIds = getCategoryIds($conn, $bookData['genre']);
            
            foreach ($categoryIds as $categoryId) {
                $stmt = $conn->prepare("INSERT INTO book_categories (book_id, category_id) VALUES (?, ?)");
                $stmt->bind_param("ii", $bookId, $categoryId);
                if (!$stmt->execute()) {
                    throw new Exception("Failed to assign category");
                }
                $stmt->close();
            }
        }
        
        // Commit transaction
        $conn->commit();
        
        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'Book updated successfully']);
        
    } catch (Exception $e) {
        // Rollback on error
        $conn->rollback();
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    
// Handle delete book action
} elseif ($action === 'delete_book') {
    if (!isset($input['book_id'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Book ID missing']);
        exit();
    }
    
    $bookId = $input['book_id'];
    
    // Start transaction
    $conn->begin_transaction();
    
    try {
        // Delete category relationships first (foreign key constraint)
        $stmt = $conn->prepare("DELETE FROM book_categories WHERE book_id = ?");
        $stmt->bind_param("i", $bookId);
        if (!$stmt->execute()) {
            throw new Exception("Failed to delete book categories");
        }
        $stmt->close();
        
        // Delete the book
        $stmt = $conn->prepare("DELETE FROM books WHERE id = ?");
        $stmt->bind_param("i", $bookId);
        if (!$stmt->execute()) {
            throw new Exception("Failed to delete book");
        }
        $stmt->close();
        
        // Commit transaction
        $conn->commit();
        
        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'Book deleted successfully']);
        
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