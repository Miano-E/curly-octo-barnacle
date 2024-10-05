<?php
// Include the database connection
include 'connect.php';

header('Content-Type: application/json');  // Ensure the response is always JSON

$response = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $recordType = $_POST['recordType'] ?? '';
    $recordId = $_POST['id'] ?? '';
    
    if (empty($recordType) || empty($recordId)) {
        // Return a JSON response for missing fields
        echo json_encode(['status' => 'error', 'message' => 'Invalid record type or ID']);
        exit;
    }

    if ($recordType === 'eggs') {
        $eggCount = $_POST['eggCount'] ?? null;
        $eggDate = $_POST['eggDate'] ?? null;

        $sql = "UPDATE eggs SET egg_count = ?, date = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('isi', $eggCount, $eggDate, $recordId);

    } elseif ($recordType === 'birds') {
        $birdType = $_POST['birdType'] ?? '';
        $birdQuantity = $_POST['birdQuantity'] ?? null;

        $sql = "UPDATE birds SET bird_type = ?, bird_quantity = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('sii', $birdType, $birdQuantity, $recordId);

    } elseif ($recordType === 'feed') {
        $feedType = $_POST['feedType'] ?? '';
        $feedQuantity = $_POST['feedQuantity'] ?? null;

        $sql = "UPDATE feed SET feed_type = ?, feed_quantity = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('sii', $feedType, $feedQuantity, $recordId);

    } elseif ($recordType === 'employee') {
        $employeeName = $_POST['employeeName'] ?? '';
        $employeeRole = $_POST['employeeRole'] ?? '';
        $employeeSalary = $_POST['employeeSalary'] ?? null;

        $sql = "UPDATE employees SET employee_name = ?, employee_role = ?, employee_salary = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('ssii', $employeeName, $employeeRole, $employeeSalary, $recordId);

    } elseif ($recordType === 'sales') {
        $productName = $_POST['productName'] ?? '';
        $quantitySold = $_POST['quantitySold'] ?? null;
        $saleDate = $_POST['saleDate'] ?? '';
        $totalAmount = $_POST['totalAmount'] ?? null;

        $sql = "UPDATE sales SET product_name = ?, quantity_sold = ?, sale_date = ?, total_amount = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('sisii', $productName, $quantitySold, $saleDate, $totalAmount, $recordId);

    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid record type!']);
        exit;
    }

    if ($stmt->execute()) {
        $response = ['status' => 'success', 'message' => 'Record updated successfully!'];
    } else {
        $response = ['status' => 'error', 'message' => 'Error updating record: ' . $conn->error];
    }

    $stmt->close();
    $conn->close();

    echo json_encode($response);
    exit;
}
?>
