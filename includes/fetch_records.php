<?php
include 'connect.php';

// Check if it's a delete request
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['id'])) {
    // Perform deletion logic
    $recordId = $_POST['id'];
    $recordType = $_POST['type'] ?? 'eggs';

    // Prepare the delete query based on the record type
    switch ($recordType) {
        case 'eggs':
            $deleteQuery = "DELETE FROM eggs WHERE id = ?";
            break;
        case 'birds':
            $deleteQuery = "DELETE FROM birds WHERE id = ?";
            break;
        case 'feed':
            $deleteQuery = "DELETE FROM feed WHERE id = ?";
            break;
        case 'sales':
            $deleteQuery = "DELETE FROM sales WHERE id = ?";
            break;
        case 'employee':
            $deleteQuery = "DELETE FROM employees WHERE id = ?";
            break;
        default:
            die(json_encode(['error' => 'Invalid record type']));
    }

    // Prepare and execute the delete statement
    $stmt = $conn->prepare($deleteQuery);
    $stmt->bind_param("i", $recordId);
    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to delete the record']);
    }

    $stmt->close();
    $conn->close();
    exit;
}

// If not a delete request, proceed with fetching records
$recordType = $_GET['type'] ?? 'eggs';

// Prepare the SQL query based on the selected record type
switch ($recordType) {
    case 'eggs':
        $query = "SELECT * FROM eggs";
        break;
    case 'birds':
        $query = "SELECT * FROM birds";
        break;
    case 'feed':
        $query = "SELECT * FROM feed";
        break;
    case 'sales':
        $query = "SELECT * FROM sales";
        break;
    case 'employee':
        $query = "SELECT * FROM employees";
        break;
    case 'weekly_eggs':
        $query = "SELECT egg_count, date
                  FROM eggs
                  WHERE date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
                  ORDER BY date ASC;";
        break;
    case 'monthly_eggs':
        $query = "SELECT SUM(egg_count) as total_eggs, DATE_FORMAT(date, '%Y-%m-%d') as date 
                  FROM eggs 
                  WHERE MONTH(date) = MONTH(CURDATE()) 
                  AND YEAR(date) = YEAR(CURDATE()) 
                  GROUP BY date";
        break;
    case 'monthly_sales':
        $query = "SELECT SUM(total_amount) as total_sales, MONTH(sale_date) as sale_month
                  FROM sales 
                  WHERE YEAR(sale_date) = YEAR(CURDATE()) 
                  GROUP BY MONTH(sale_date)";
        break;
    case 'monthly_feed':
        $query = "SELECT SUM(feed_quantity) AS total_feed, MONTH(feed_date) AS month
                  FROM feed
                  GROUP BY MONTH(feed_date)
                  ORDER BY MONTH(feed_date)";
        break;
    case 'employee_roles':
        $query = "SELECT employee_role, employee_salary FROM employees";
        break;
    case 'birds_count':
        $query = "SELECT COUNT(bird_quantity) FROM birds";
        break;
    default:
        die(json_encode(['error' => 'Invalid record type']));
}

// Execute the query and fetch records
$result = $conn->query($query);

// Check for query success and fetch records
if ($result && $result->num_rows > 0) {
    $records = [];
    while ($row = $result->fetch_assoc()) {
        $records[] = $row;
    }

    // Set the correct Content-Type and output JSON
    header('Content-Type: application/json');
    echo json_encode($records);
} else {
    // If no records found, return an empty array
    header('Content-Type: application/json');
    echo json_encode([]);
}

$conn->close();
?>
