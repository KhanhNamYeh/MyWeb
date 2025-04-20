<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include database configuration
require_once 'config.php';

// Check database connection
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Database connection error']);
    exit();
}

// Function to get all books with their categories
function getAllBooks($conn) {
    $books = [];
    
    // First, get all books
    $bookQuery = "SELECT id, name, title, author, price, sale, promotion, image FROM books";
    $bookResult = $conn->query($bookQuery);
    
    if ($bookResult && $bookResult->num_rows > 0) {
        while ($book = $bookResult->fetch_assoc()) {
            // Initialize categories array for this book
            $book['genres'] = [];
            
            // Get categories for this book
            $categoryQuery = "SELECT c.name 
                            FROM categories c
                            JOIN book_categories bc ON c.id = bc.category_id
                            WHERE bc.book_id = ?";
            
            $stmt = $conn->prepare($categoryQuery);
            $stmt->bind_param("i", $book['id']);
            $stmt->execute();
            $categoryResult = $stmt->get_result();
            
            if ($categoryResult && $categoryResult->num_rows > 0) {
                while ($category = $categoryResult->fetch_assoc()) {
                    $book['genres'][] = $category['name'];
                }
            }
            
            // Format book data to match the expected format in the React component
            $formattedBook = [
                'id' => $book['id'],
                'image' => $book['image'],
                'title' => $book['name'], // using 'name' from DB as 'title' in the frontend
                'author' => $book['author'],
                'genre' => implode(", ", $book['genres']), // Joining all genres with comma
                'price' => (float)$book['price'],
                'sale' => $book['sale'] ? (float)$book['sale'] : null,
                'promotion' => $book['promotion']
            ];
            
            $books[] = $formattedBook;
        }
    }
    
    return $books;
}

// Handle GET request - Get all books
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $books = getAllBooks($conn);
    
    http_response_code(200);
    echo json_encode(['success' => true, 'books' => $books]);
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
}

$conn->close();
exit();