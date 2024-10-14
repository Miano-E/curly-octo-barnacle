<?php
include 'connect.php';

function isEggProduct($productName) {
    return stripos($productName, 'egg') !== false;
}

function isBirdProduct($productName) {
    $productNameLower = strtolower($productName);
    return (stripos($productNameLower, 'broiler') !== false ||
            stripos($productNameLower, 'layer') !== false ||
            stripos($productNameLower, 'chick') !== false);
}

function isNonStockProduct($productName) {
    // List of products that don’t require stock validation (like manure, wings, etc.)
    $nonStockProducts = ['manure', 'chicken wings', 'sausage']; // You can add more products as needed
    foreach ($nonStockProducts as $product) {
        if (stripos($productName, $product) !== false) {
            return true;
        }
    }
    return false;
}

function validateNotEmpty($input, $fieldName) {
    if (empty(trim($input))) {
        throw new Exception($fieldName . " is required.");
    }
    return $input;
}

function validateNumeric($input, $fieldName) {
    if (!is_numeric($input)) {
        throw new Exception($fieldName . " must be a valid number and cannot be empty.");
    }
    return $input;
}

function validateDate($input, $fieldName) {
    if (!strtotime($input)) {
        throw new Exception("Invalid or empty date in " . $fieldName);
    }
    return $input;
}

$recordType = $_POST['recordType'] ?? '';

$response = [];

header('Content-Type: application/json');  // Ensure JSON response

try {
    if ($recordType == 'eggs') {
        $eggCount = validateNumeric($_POST['eggCount'], 'Egg Count');
        $eggDate = validateDate($_POST['eggDate'], 'Egg Date');

        $stmt = $conn->prepare("INSERT INTO eggs (egg_count, date) VALUES (?, ?)");
        $stmt->execute([$eggCount, $eggDate]);

        $response['message'] = "Egg record added and system updated successfully!";

    } elseif ($recordType == 'birds') {
        $birdType = validateNotEmpty($_POST['birdType'], 'Bird Type');
        $birdQuantity = validateNumeric($_POST['birdQuantity'], 'Bird Quantity');

        $stmt = $conn->prepare("INSERT INTO birds (bird_type, bird_quantity) VALUES (?, ?)");
        $stmt->execute([$birdType, $birdQuantity]);

        $response['message'] = "Bird record added and system updated successfully!";

    } elseif ($recordType == 'feed') {
        $feedType = validateNotEmpty($_POST['feedType'], 'Feed Type');
        $feedQuantity = validateNumeric($_POST['feedQuantity'], 'Feed Quantity');
        $feedDate = validateDate($_POST['feedDate'], 'Feed Date');

        $stmt = $conn->prepare("INSERT INTO feed (feed_type, feed_quantity, feed_date) VALUES (?, ?, ?)");
        $stmt->execute([$feedType, $feedQuantity, $feedDate]);

        $response['message'] = "Feed record added and system updated successfully!";

    } elseif ($recordType == 'employee') {
        $employeeName = validateNotEmpty($_POST['employeeName'], 'Employee Name');
        $employeeRole = validateNotEmpty($_POST['employeeRole'], 'Employee Role');
        $employeeSalary = validateNumeric($_POST['employeeSalary'], 'Employee Salary');

        $stmt = $conn->prepare("INSERT INTO employees (employee_name, employee_role, employee_salary) VALUES (?, ?, ?)");
        $stmt->execute([$employeeName, $employeeRole, $employeeSalary]);

        $response['message'] = "Employee record added successfully!";

    } elseif ($recordType == 'sales') {
        $productName = validateNotEmpty($_POST['productName'], 'Product Name');
        $quantitySold = validateNumeric($_POST['quantitySold'], 'Quantity Sold');
        $saleDate = validateDate($_POST['saleDate'], 'Sale Date');
        $totalAmount = validateNumeric($_POST['totalAmount'], 'Total Amount');
        
        // Handle eggs with stock validation
        if (isEggProduct($productName)) {
            $stmt = $conn->prepare("SELECT id, egg_count FROM eggs WHERE egg_count > 0 ORDER BY date ASC");
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result) {
                $remainingQuantityToDeduct = $quantitySold;

                while ($row = $result->fetch_assoc()) {
                    $eggRecordId = $row['id'];
                    $availableEggs = (int)$row['egg_count'];

                    if ($availableEggs >= $remainingQuantityToDeduct) {
                        $newCount = $availableEggs - $remainingQuantityToDeduct;
                        $stmtUpdate = $conn->prepare("UPDATE eggs SET egg_count = ? WHERE id = ?");
                        $stmtUpdate->execute([$newCount, $eggRecordId]);

                        $remainingQuantityToDeduct = 0;
                        break;
                    } else {
                        $stmtUpdate = $conn->prepare("UPDATE eggs SET egg_count = 0 WHERE id = ?");
                        $stmtUpdate->execute([$eggRecordId]);

                        $remainingQuantityToDeduct -= $availableEggs;
                    }
                }

                if ($remainingQuantityToDeduct > 0) {
                    throw new Exception("Not enough egg stock to cover this sale.");
                }

            } else {
                throw new Exception("Failed to fetch egg stock.");
            }

            $stmt = $conn->prepare("INSERT INTO sales (product_name, quantity_sold, sale_date, total_amount) VALUES (?, ?, ?, ?)");
            $stmt->execute([$productName, $quantitySold, $saleDate, $totalAmount]);

        // Handle birds with stock validation
        } elseif (isBirdProduct($productName)) {
            $stmt = $conn->prepare("SELECT id, bird_quantity FROM birds WHERE bird_type = ? AND bird_quantity > 0 ORDER BY id ASC");
            $stmt->execute([$productName]);
            $result = $stmt->get_result();

            if ($result && $result->num_rows > 0) {
                $remainingQuantityToDeduct = $quantitySold;

                while ($row = $result->fetch_assoc()) {
                    $birdRecordId = $row['id'];
                    $availableBirds = (int)$row['bird_quantity'];

                    if ($availableBirds >= $remainingQuantityToDeduct) {
                        $newCount = $availableBirds - $remainingQuantityToDeduct;
                        $stmtUpdate = $conn->prepare("UPDATE birds SET bird_quantity = ? WHERE id = ?");
                        $stmtUpdate->execute([$newCount, $birdRecordId]);

                        $remainingQuantityToDeduct = 0;
                        break;
                    } else {
                        $stmtUpdate = $conn->prepare("UPDATE birds SET bird_quantity = 0 WHERE id = ?");
                        $stmtUpdate->execute([$birdRecordId]);

                        $remainingQuantityToDeduct -= $availableBirds;
                    }
                }

                if ($remainingQuantityToDeduct > 0) {
                    throw new Exception("Not enough bird stock to cover this sale.");
                }

            } else {
                throw new Exception("No bird stock available for the sale or product does not exist.");
            }

            $stmt = $conn->prepare("INSERT INTO sales (product_name, quantity_sold, sale_date, total_amount) VALUES (?, ?, ?, ?)");
            $stmt->execute([$productName, $quantitySold, $saleDate, $totalAmount]);

        // Handle non-stock products (like manure, wings, etc.)
        } elseif (isNonStockProduct($productName)) {
            // Simply record the sale without stock validation for non-stock products
            $stmt = $conn->prepare("INSERT INTO sales (product_name, quantity_sold, sale_date, total_amount) VALUES (?, ?, ?, ?)");
            $stmt->execute([$productName, $quantitySold, $saleDate, $totalAmount]);

        } else {
            throw new Exception("Invalid product or unrecognized product category.");
        }

        $response['message'] = "Sales record added and system updated successfully!";
    }

    $response['status'] = 'success';

} catch (Exception $e) {
    $response['status'] = 'error';
    $response['message'] = 'Error: ' . $e->getMessage();
}

echo json_encode($response);
?>
