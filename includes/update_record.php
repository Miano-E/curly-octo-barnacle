<?php
// Include the database connection
include 'connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    $recordType = $_POST['recordType'];
    $recordId = $_POST['id'];
    $response = '';

    if ($recordType === 'eggs') {
        $eggCount = $_POST['eggCount'];
        $eggDate = $_POST['eggDate'];

        $sql = "UPDATE eggs SET egg_count = ?, date = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('isi', $eggCount, $eggDate, $recordId);

    } elseif ($recordType === 'birds') {
        $birdType = $_POST['birdType'];
        $birdQuantity = $_POST['birdQuantity'];

        $sql = "UPDATE birds SET bird_type = ?, bird_quantity = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('sii', $birdType, $birdQuantity, $recordId);

    } elseif ($recordType === 'feed') {
        $feedType = $_POST['feedType'];
        $feedQuantity = $_POST['feedQuantity'];

        $sql = "UPDATE feed SET feed_type = ?, feed_quantity = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('sii', $feedType, $feedQuantity, $recordId);

    } elseif ($recordType === 'employee') {
        $employeeName = $_POST['employeeName'];
        $employeeRole = $_POST['employeeRole'];
        $employeeSalary = $_POST['employeeSalary'];

        $sql = "UPDATE employees SET employee_name = ?, employee_role = ?, employee_salary = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('ssii', $employeeName, $employeeRole, $employeeSalary, $recordId);

    } elseif ($recordType === 'sales') {
        // Get form data
        $productName = $_POST['productName'];
        $quantitySold = $_POST['quantitySold'];
        $saleDate = $_POST['saleDate'];
        $totalAmount = $_POST['totalAmount'];

        // Prepare SQL query to update sales record
        $sql = "UPDATE sales SET product_name = ?, quantity_sold = ?, sale_date = ?, total_amount = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('sisii', $productName, $quantitySold, $saleDate, $totalAmount, $recordId);
    } else {
        $response = "Invalid record type!";
        echo $response;
        exit;
    }

    if ($stmt->execute()) {
        $response = "Record updated successfully!";
    } else {
        $response = "Error updating record: " . $conn->error;
    }

    $stmt->close();
    $conn->close();

    echo $response;
}
?>
