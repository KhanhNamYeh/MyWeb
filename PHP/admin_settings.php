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

// Define the settings file path
$settingsFilePath = dirname(__FILE__) . '/settings.json';

// Create settings file if it doesn't exist
if (!file_exists($settingsFilePath)) {
    $defaultSettings = [
        'site_name' => 'READGO',
        'site_description' => 'Your one-stop shop for books',
        'contact_email' => 'admin@example.com',
        'contact_phone' => '+1234567890',
        'social_media' => [
            'facebook' => 'https://www.facebook.com/',
            'twitter' => 'https://x.com/',
            'instagram' => 'https://www.instagram.com/'
        ],
        'shipping_info' => 'Free shipping on orders over $50',
        'maintenance_mode' => false
    ];
    file_put_contents($settingsFilePath, json_encode($defaultSettings, JSON_PRETTY_PRINT));
}

// Get and decode request data
$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['action'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid request']);
    exit();
}

$action = $input['action'];

// Handle get settings action
if ($action === 'get_settings') {
    try {
        if (!file_exists($settingsFilePath)) {
            throw new Exception("Settings file not found");
        }
        
        $settings = json_decode(file_get_contents($settingsFilePath), true);
        
        if ($settings === null) {
            throw new Exception("Invalid settings format");
        }
        
        http_response_code(200);
        echo json_encode(['success' => true, 'settings' => $settings]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    
// Handle update settings action
} elseif ($action === 'update_settings') {
    if (!isset($input['settings']) || !is_array($input['settings'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Settings data missing or invalid']);
        exit();
    }
    
    $updatedSettings = $input['settings'];
    
    // Validate required fields
    $requiredFields = ['site_name', 'contact_email'];
    foreach ($requiredFields as $field) {
        if (!isset($updatedSettings[$field]) || empty($updatedSettings[$field])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => "Field '$field' is required"]);
            exit();
        }
    }
    
    try {
        // Load current settings
        $currentSettings = [];
        if (file_exists($settingsFilePath)) {
            $currentSettings = json_decode(file_get_contents($settingsFilePath), true) ?: [];
        }
        
        // Merge new settings with existing ones
        $mergedSettings = array_merge($currentSettings, $updatedSettings);
        
        // Write updated settings to file
        if (file_put_contents($settingsFilePath, json_encode($mergedSettings, JSON_PRETTY_PRINT)) === false) {
            throw new Exception("Failed to write settings file");
        }
        
        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'Settings updated successfully']);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid action']);
}

exit();