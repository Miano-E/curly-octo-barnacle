
<script>
document.addEventListener('DOMContentLoaded', function() {
    let recordType = document.querySelector('.container.content').getAttribute('data-record-type'); // Detect the record type dynamically
    let records = JSON.parse(localStorage.getItem(recordType)) || [];

    function openEditForm(index) {
        const record = records[index];
        const form = document.getElementById('edit-record-form');
        const modal = document.getElementById('edit-form-modal');

        form.innerHTML = ''; 

        // Generate dynamic form fields based on the record type
        if (recordType === 'eggs') {
            form.innerHTML += `<label>Date</label><input type="date" id="edit-egg-date" value="${record.date}"><br>`;
            form.innerHTML += `<label>Egg Count</label><input type="number" id="edit-egg-count" value="${record.eggCount}"><br>`;
        } else if (recordType === 'birds') {
            form.innerHTML += `<label>Type of Bird</label><input type="text" id="edit-bird-type" value="${record.birdType}"><br>`;
            form.innerHTML += `<label>Number of Birds</label><input type="number" id="edit-bird-quantity" value="${record.birdQuantity}"><br>`;
        } else if (recordType === 'feed') {
            form.innerHTML += `<label>Type of Feed</label><input type="text" id="edit-feed-type" value="${record.feedType}"><br>`;
            form.innerHTML += `<label>Quantity (kg)</label><input type="number" id="edit-feed-quantity" value="${record.feedQuantity}"><br>`;
        } else if (recordType === 'sales') {
            form.innerHTML += `<label>Product Name</label><input type="text" id="edit-product-name" value="${record.productName}"><br>`;
            form.innerHTML += `<label>Quantity Sold</label><input type="number" id="edit-quantity-sold" value="${record.quantitySold}"><br>`;
            form.innerHTML += `<label>Sale Date</label><input type="date" id="edit-sale-date" value="${record.saleDate}"><br>`;
            form.innerHTML += `<label>Total Amount (Ksh)</label><input type="number" id="edit-total-amount" value="${record.totalAmount}"><br>`;
        } else if (recordType === 'employee') {
            form.innerHTML += `<label>Employee Name</label><input type="text" id="edit-employee-name" value="${record.employeeName}"><br>`;
            form.innerHTML += `<label>Role</label><input type="text" id="edit-employee-role" value="${record.employeeRole}"><br>`;
            form.innerHTML += `<label>Salary</label><input type="number" id="edit-employee-salary" value="${record.employeeSalary}"><br>`;
        }

        form.setAttribute('data-index', index);

        // Show modal
        modal.style.display = 'block';
        document.querySelector('.container.content').classList.add('blur');
    }

    function closeEditForm() {
        const modal = document.getElementById('edit-form-modal');
        modal.style.display = 'none';
        document.querySelector('.container.content').classList.remove('blur');
    }

    // Function to handle form submission and record update
    function submitEditForm(e) {
        e.preventDefault();

        const index = document.getElementById('edit-record-form').getAttribute('data-index');
        let updatedRecord = {};

        // Collect updated data based on record type
        if (recordType === 'eggs') {
            updatedRecord.date = document.getElementById('edit-egg-date').value;
            updatedRecord.eggCount = document.getElementById('edit-egg-count').value;
        } else if (recordType === 'birds') {
            updatedRecord.birdType = document.getElementById('edit-bird-type').value;
            updatedRecord.birdQuantity = document.getElementById('edit-bird-quantity').value;
        } else if (recordType === 'feed') {
            updatedRecord.feedType = document.getElementById('edit-feed-type').value;
            updatedRecord.feedQuantity = document.getElementById('edit-feed-quantity').value;
        } else if (recordType === 'sales') {
            updatedRecord.productName = document.getElementById('edit-product-name').value;
            updatedRecord.quantitySold = document.getElementById('edit-quantity-sold').value;
            updatedRecord.saleDate = document.getElementById('edit-sale-date').value;
            updatedRecord.totalAmount = document.getElementById('edit-total-amount').value;
        } else if (recordType === 'employee') {
            updatedRecord.employeeName = document.getElementById('edit-employee-name').value;
            updatedRecord.employeeRole = document.getElementById('edit-employee-role').value;
            updatedRecord.employeeSalary = document.getElementById('edit-employee-salary').value;
        }

        // Update the record in the array
        records[index] = updatedRecord;

        // Save back to localStorage
        localStorage.setItem(recordType, JSON.stringify(records));

        // Close the form and refresh the table
        closeEditForm();
        renderTable();
    }

    // Function to render the table
    function renderTable() {
        const table = document.querySelector('#egg-records-table tbody');
        table.innerHTML = ''; // Clear the table before rendering new content

        records.forEach((record, index) => {
            const row = table.insertRow();
            const dateCell = row.insertCell(0);
            const eggCountCell = row.insertCell(1);
            const actionsCell = row.insertCell(2);

            dateCell.textContent = record.date;
            eggCountCell.textContent = record.eggCount || record.birdQuantity || record.feedQuantity || record.quantitySold || record.employeeSalary;

            actionsCell.innerHTML = `
                <div class="action-btns">
                    <a href="#" class="edit-record" data-index="${index}">Edit</a>
                    <a href="#" class="delete-record" data-index="${index}">Delete</a>
                </div>
            `;
        });

        bindEventListeners(); // Bind edit and delete buttons
    }

    // Function to bind event listeners to buttons
    function bindEventListeners() {
        document.querySelectorAll('.edit-record').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const index = this.getAttribute('data-index');
                openEditForm(index);
            });
        });

        document.querySelectorAll('.delete-record').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const index = this.getAttribute('data-index');
                if (confirm('Are you sure you want to delete this record?')) {
                    records.splice(index, 1); // Delete the record
                    localStorage.setItem(recordType, JSON.stringify(records)); // Update localStorage
                    renderTable(); // Re-render table
                }
            });
        });
    }

    // Add event listener for closing modal
    document.querySelector('.close').addEventListener('click', closeEditForm);

    // Add event listener to form submission
    document.getElementById('edit-record-form').addEventListener('submit', submitEditForm);

    // Initial table render
    renderTable();
});
</script>

<!-- More from submit_records.php file 
// function openForm() {
//     // Try to get the record type from the dropdown (if it exists, like on the dashboard)
//     const recordTypeDropdown = document.getElementById('record-type');
    
//     // If the dropdown exists, get the selected value; otherwise, use the data-record-type attribute
//     const recordType = recordTypeDropdown ? recordTypeDropdown.value : document.querySelector('.container.content').getAttribute('data-record-type');
    
//     // Open the modal
//     document.getElementById('form-modal').style.display = 'flex';

//     // Update modal title
//     const modalTitle = document.getElementById('modal-title');
//     modalTitle.textContent = `Add New ${recordType.charAt(0).toUpperCase() + recordType.slice(1)} Record`;
    
//     const form = document.getElementById('record-form');
//     form.innerHTML = ''; // Clear previous form fields

//     // Generate form fields based on record type
//     if (recordType === 'eggs') {
//         form.innerHTML += '<label>Egg Count</label><input type="number" id="egg-count"><br>';
//         form.innerHTML += '<label>Date</label><input type="date" id="egg-date"><br>';
//     } else if (recordType === 'birds') {
//         form.innerHTML += '<label>Type of Bird (e.g., Broiler, Layer)</label><input type="text" id="bird-type"><br>';
//         form.innerHTML += '<label>Number of Birds</label><input type="number" id="bird-quantity"><br>';
//     } else if (recordType === 'feed') {
//         form.innerHTML += '<label>Type of Feed (e.g., Pellets, Mash)</label><input type="text" id="feed-type"><br>';
//         form.innerHTML += '<label>Quantity (kg)</label><input type="number" id="feed-quantity"><br>';
//         form.innerHTML += '<label>Date</label><input type="date" id="feed-date"><br>';
//     } else if (recordType === 'employee') {
//         form.innerHTML += '<label>Employee Name</label><input type="text" id="employee-name"><br>';
//         form.innerHTML += '<label>Role</label><input type="text" id="employee-role"><br>';
//         form.innerHTML += '<label>Salary</label><input type="number" id="employee-salary"><br>';
//     } else if (recordType === 'sales') {
//         form.innerHTML += '<label>Product Name</label><input type="text" id="product-name"><br>';
//         form.innerHTML += '<label>Quantity Sold</label><input type="number" id="quantity-sold"><br>';
//         form.innerHTML += '<label>Sale Date</label><input type="date" id="sale-date"><br>';
//         form.innerHTML += '<label>Total Amount (Ksh)</label><input type="number" id="total-amount"><br>';
//     }
// }


// function submitForm() {
//     let recordType;

//     // Check if the record type is selected from the dropdown (dashboard)
//     const recordTypeDropdown = document.getElementById('record-type');
    
//     if (recordTypeDropdown) {
//         // If the dropdown exists, get the selected value
//         recordType = recordTypeDropdown.value;
//     } else {
//         // If not, get the record type from the data attribute (individual pages)
//         const contentContainer = document.querySelector('.container.content');
//         recordType = contentContainer.getAttribute('data-record-type');
//     }

    

//     let formData = new FormData();
//     formData.append('recordType', recordType);

//     // Add form-specific data based on the record type
//     if (recordType === 'eggs') {
//         formData.append('eggCount', document.getElementById('egg-count').value);
//         formData.append('eggDate', document.getElementById('egg-date').value);
//     } else if (recordType === 'birds') {
//         formData.append('birdType', document.getElementById('bird-type').value);
//         formData.append('birdQuantity', document.getElementById('bird-quantity').value);
//     } else if (recordType === 'feed') {
//         formData.append('feedType', document.getElementById('feed-type').value);
//         formData.append('feedQuantity', document.getElementById('feed-quantity').value);
//         formData.append('feedDate', document.getElementById('feed-date').value);
//     } else if (recordType === 'employee') {
//         formData.append('employeeName', document.getElementById('employee-name').value);
//         formData.append('employeeRole', document.getElementById('employee-role').value);
//         formData.append('employeeSalary', document.getElementById('employee-salary').value);
//     } else if (recordType === 'sales') {
//         formData.append('productName', document.getElementById('product-name').value);
//         formData.append('quantitySold', document.getElementById('quantity-sold').value);
//         formData.append('saleDate', document.getElementById('sale-date').value);
//         formData.append('totalAmount', document.getElementById('total-amount').value);
//     }

//     // Send the data to the server using fetch
//     fetch('./includes/submit_record.php', {
//         method: 'POST',
//         body: formData
//     })
//     .then(response => response.json())
//     .then(data => {
//         if (data.status === 'success') {
//             displayMessage(data.message, 'success');
//             closeForm();
//             setTimeout(() => {
//                 window.location.reload();
//             }, 2000);
//         } else {
//             displayMessage(data.message, 'error');
//         }
//     })
//     .catch(error => {
//         console.error('Error:', error);
//         displayMessage('An unexpected error occurred.', 'error');
//     });

//     function displayMessage(message, type) {
//         // Create the message box container
//         const messageBox = document.createElement('div');
//         messageBox.className = `message-box ${type}`;
//         messageBox.innerHTML = `${message} <span class="close-btn">&times;</span>`;
        
//         // Append the message box to the body
//         document.body.appendChild(messageBox);
        
//         // Add event listener to close the message box when 'x' is clicked
//         const closeBtn = messageBox.querySelector('.close-btn');
//         closeBtn.addEventListener('click', () => {
//             messageBox.remove();
//         });
    
//         // Automatically remove the message box after 5 seconds (5000 milliseconds)
//         setTimeout(() => {
//             messageBox.remove();
//         }, 5000);
//     }
    
    
// }

// Open modal for editing the record with pre-filled data
<!-- More from submit_records.php file -->





<!-- //submit_records code file -->

<!-- <php
include 'connect.php';

// Helper function to check if the product is egg-related
function isEggProduct($productName) {
    return stripos($productName, 'egg') !== false;
}

// Helper function to check if the product is bird-related
function isBirdProduct($productName) {
    // Convert to lowercase and check if it contains 'broiler', 'layer', or 'chick'
    $productNameLower = strtolower($productName);
    return (stripos($productNameLower, 'broiler') !== false ||
            stripos($productNameLower, 'layer') !== false ||
            stripos($productNameLower, 'chick') !== false);
}

// Function to validate non-empty input
function validateNotEmpty($input, $fieldName) {
    if (empty(trim($input))) {
        throw new Exception($fieldName . " is required.");
    }
    return $input;
}

// Function to validate numeric fields (separate empty check from format check)
function validateNumeric($input, $fieldName) {
    // First ensure the field is not empty
    validateNotEmpty($input, $fieldName);

    // Then check if it's a valid number
    if (!is_numeric($input)) {
        throw new Exception($fieldName . " must be a number.");
    }
    return $input;
}

// Function to validate dates (separate empty check from format check)
function validateDate($input, $fieldName) {
    // First ensure the field is not empty
    validateNotEmpty($input, $fieldName);

    // Then check if it's a valid date format
    if (!strtotime($input)) {
        throw new Exception("Invalid date format in " . $fieldName);
    }
    return $input;
}

$recordType = $_POST['recordType'] ?? '';

$response = [];

try {
    if ($recordType == 'eggs') {
        $eggCount = validateNumeric($_POST['eggCount'], 'Egg Count');
        $eggDate = validateDate($_POST['eggDate'], 'Egg Date');

        $stmt = $conn->prepare("INSERT INTO eggs (egg_count, date) VALUES (?, ?)");
        $stmt->execute([$eggCount, $eggDate]);

        $response['message'] = "Egg record added and inventory updated successfully!";

    } elseif ($recordType == 'birds') {
        $birdType = validateNotEmpty($_POST['birdType'], 'Bird Type');
        $birdQuantity = validateNumeric($_POST['birdQuantity'], 'Bird Quantity');

        $stmt = $conn->prepare("INSERT INTO birds (bird_type, bird_quantity) VALUES (?, ?)");
        $stmt->execute([$birdType, $birdQuantity]);

        $response['message'] = "Bird record added and inventory updated successfully!";

    } elseif ($recordType == 'feed') {
        $feedType = validateNotEmpty($_POST['feedType'], 'Feed Type');
        $feedQuantity = validateNumeric($_POST['feedQuantity'], 'Feed Quantity');
        $feedDate = validateDate($_POST['feedDate'], 'Feed Date');

        $stmt = $conn->prepare("INSERT INTO feed (feed_type, feed_quantity, feed_date) VALUES (?, ?, ?)");
        $stmt->execute([$feedType, $feedQuantity, $feedDate]);

        $response['message'] = "Feed record added and inventory updated successfully!";

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

        // Check if the product sold is eggs or birds, and handle accordingly
        if (isEggProduct($productName)) {
            // Start deduction from egg records in FIFO order
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

            // Record the sale after stock check for eggs passes
            $stmt = $conn->prepare("INSERT INTO sales (product_name, quantity_sold, sale_date, total_amount) VALUES (?, ?, ?, ?)");
            $stmt->execute([$productName, $quantitySold, $saleDate, $totalAmount]);

        } elseif (isBirdProduct($productName)) {
            // Start deduction from bird records
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

            // Record the sale after stock check for birds passes
            $stmt = $conn->prepare("INSERT INTO sales (product_name, quantity_sold, sale_date, total_amount) VALUES (?, ?, ?, ?)");
            $stmt->execute([$productName, $quantitySold, $saleDate, $totalAmount]);

        } else {
            throw new Exception("Invalid product name.");
        }

        $response['message'] = "Sales record added and inventory updated successfully!";
    }

    $response['status'] = 'success'; // Set success status

} catch (Exception $e) {
    $response['status'] = 'error';
    $response['message'] = 'Error: ' . $e->getMessage(); // Catch and display any error message
}

// Return the response as JSON
header('Content-Type: application/json');
echo json_encode($response);

?> -->

<!-- //submit_records code file -->




<!-- <script>
function openEditForm(recordType, record) {
    document.getElementById('edit-form-modal').style.display = 'flex';
    
    // Blur the background content
    document.querySelector('.container.content').classList.add('blur');

    const modalTitle = document.getElementById('edit-modal-title');
    modalTitle.textContent = `Edit ${recordType.charAt(0).toUpperCase() + recordType.slice(1)} Record`;

    const form = document.getElementById('edit-record-form');
    form.innerHTML = ''; // Clear previous form fields

    // Generate form fields and populate with the record data
    if (recordType === 'eggs') {
        form.innerHTML += `<label>Egg Count</label><input type="number" id="egg-count" value="${record.eggCount}"><br>`;
        form.innerHTML += `<label>Date</label><input type="date" id="egg-date" value="${record.date}"><br>`;
    } else if (recordType === 'birds') {
        form.innerHTML += `<label>Type of Bird</label><input type="text" id="bird-type" value="${record.birdType}"><br>`;
        form.innerHTML += `<label>Number of Birds</label><input type="number" id="bird-quantity" value="${record.birdQuantity}"><br>`;
    } else if (recordType === 'feed') {
        form.innerHTML += `<label>Type of Feed</label><input type="text" id="feed-type" value="${record.feedType}"><br>`;
        form.innerHTML += `<label>Quantity (kg)</label><input type="number" id="feed-quantity" value="${record.feedQuantity}"><br>`;
    } else if (recordType === 'sales') {
        form.innerHTML += `<label>Product Name</label><input type="text" id="product-name" value="${record.productName}"><br>`;
        form.innerHTML += `<label>Quantity Sold</label><input type="number" id="quantity-sold" value="${record.quantitySold}"><br>`;
        form.innerHTML += `<label>Sale Date</label><input type="date" id="sale-date" value="${record.saleDate}"><br>`;
        form.innerHTML += `<label>Total Amount (Ksh)</label><input type="number" id="total-amount" value="${record.totalAmount}"><br>`;
    } else if (recordType === 'employee') {
        form.innerHTML += `<label>Employee Name</label><input type="text" id="employee-name" value="${record.employeeName}"><br>`;
        form.innerHTML += `<label>Role</label><input type="text" id="employee-role" value="${record.employeeRole}"><br>`;
        form.innerHTML += `<label>Salary (Ksh)</label><input type="number" id="employee-salary" value="${record.employeeSalary}"><br>`;
    }
}

function closeEditForm() {
    document.getElementById('edit-form-modal').style.display = 'none';
    document.querySelector('.container.content').classList.remove('blur');
}

function submitEditForm() {
    // Logic to submit the edited form and update the record
    // Fetch the recordType, grab form values and update the respective record in localStorage
    // After submission, close the modal and refresh the table
    closeEditForm();
}
</script> -->
 -->
