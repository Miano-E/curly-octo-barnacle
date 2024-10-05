function openForm() {
    // Try to get the record type from the dropdown (if it exists, like on the dashboard)
    const recordTypeDropdown = document.getElementById('record-type');
    
    // If the dropdown exists, get the selected value; otherwise, use the data-record-type attribute
    const recordType = recordTypeDropdown ? recordTypeDropdown.value : document.querySelector('.container.content').getAttribute('data-record-type');
    
    // Open the modal
    document.getElementById('form-modal').style.display = 'flex';

    // Update modal title
    const modalTitle = document.getElementById('modal-title');
    modalTitle.textContent = `Add New ${recordType.charAt(0).toUpperCase() + recordType.slice(1)} Record`;
    
    const form = document.getElementById('record-form');
    form.innerHTML = ''; // Clear previous form fields

    // Generate form fields based on record type
    if (recordType === 'eggs') {
        form.innerHTML += '<label>Egg Count</label><input type="number" id="egg-count"><br>';
        form.innerHTML += '<label>Date</label><input type="date" id="egg-date"><br>';
    } else if (recordType === 'birds') {
        form.innerHTML += '<label>Type of Bird (e.g., Broiler, Layer)</label><input type="text" id="bird-type"><br>';
        form.innerHTML += '<label>Number of Birds</label><input type="number" id="bird-quantity"><br>';
    } else if (recordType === 'feed') {
        form.innerHTML += '<label>Type of Feed (e.g., Pellets, Mash)</label><input type="text" id="feed-type"><br>';
        form.innerHTML += '<label>Quantity (kg)</label><input type="number" id="feed-quantity"><br>';
        form.innerHTML += '<label>Date</label><input type="date" id="feed-date"><br>';
    } else if (recordType === 'employee') {
        form.innerHTML += '<label>Employee Name</label><input type="text" id="employee-name"><br>';
        form.innerHTML += '<label>Role</label><input type="text" id="employee-role"><br>';
        form.innerHTML += '<label>Salary</label><input type="number" id="employee-salary"><br>';
    } else if (recordType === 'sales') {
        form.innerHTML += '<label>Product Name</label><input type="text" id="product-name"><br>';
        form.innerHTML += '<label>Quantity Sold</label><input type="number" id="quantity-sold"><br>';
        form.innerHTML += '<label>Sale Date</label><input type="date" id="sale-date"><br>';
        form.innerHTML += '<label>Total Amount (Ksh)</label><input type="number" id="total-amount"><br>';
    }
}


// function openForm() {
//     const recordType = document.getElementById('record-type').value;
//     document.getElementById('form-modal').style.display = 'flex';
    
//     // Blur the background content
//     // document.querySelector('.container.content').classList.add('blur');

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

function closeForm() {
    document.getElementById('form-modal').style.display = 'none';
    document.querySelector('.container.content').classList.remove('blur');
}

// Add event listener to close the modal when clicking outside of the modal-content
window.addEventListener('click', function(event) {
    const modal = document.getElementById('form-modal');
    const modalContent = document.querySelector('.modal-content');

    if (event.target === modal) {
        closeForm();
    }
});

function submitForm() {
    let recordType;

    // Check if the record type is selected from the dropdown (dashboard)
    const recordTypeDropdown = document.getElementById('record-type');
    
    if (recordTypeDropdown) {
        // If the dropdown exists, get the selected value
        recordType = recordTypeDropdown.value;
    } else {
        // If not, get the record type from the data attribute (individual pages)
        const contentContainer = document.querySelector('.container.content');
        recordType = contentContainer.getAttribute('data-record-type');
    }

    

    let formData = new FormData();
    formData.append('recordType', recordType);

    // Add form-specific data based on the record type
    if (recordType === 'eggs') {
        formData.append('eggCount', document.getElementById('egg-count').value);
        formData.append('eggDate', document.getElementById('egg-date').value);
    } else if (recordType === 'birds') {
        formData.append('birdType', document.getElementById('bird-type').value);
        formData.append('birdQuantity', document.getElementById('bird-quantity').value);
    } else if (recordType === 'feed') {
        formData.append('feedType', document.getElementById('feed-type').value);
        formData.append('feedQuantity', document.getElementById('feed-quantity').value);
        formData.append('feedDate', document.getElementById('feed-date').value);
    } else if (recordType === 'employee') {
        formData.append('employeeName', document.getElementById('employee-name').value);
        formData.append('employeeRole', document.getElementById('employee-role').value);
        formData.append('employeeSalary', document.getElementById('employee-salary').value);
    } else if (recordType === 'sales') {
        formData.append('productName', document.getElementById('product-name').value);
        formData.append('quantitySold', document.getElementById('quantity-sold').value);
        formData.append('saleDate', document.getElementById('sale-date').value);
        formData.append('totalAmount', document.getElementById('total-amount').value);
    }

    // Send the data to the server using fetch
    fetch('./includes/submit_record.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            displayMessage(data.message, 'success');
            closeForm();
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } else {
            displayMessage(data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        displayMessage('An unexpected error occurred.', 'error');
    });

    function displayMessage(message, type) {
        // Create the message box container
        const messageBox = document.createElement('div');
        messageBox.className = `message-box ${type}`;
        messageBox.innerHTML = `${message} <span class="close-btn">&times;</span>`;
        
        // Append the message box to the body
        document.body.appendChild(messageBox);
        
        // Add event listener to close the message box when 'x' is clicked
        const closeBtn = messageBox.querySelector('.close-btn');
        closeBtn.addEventListener('click', () => {
            messageBox.remove();
        });
    
        // Automatically remove the message box after 5 seconds (5000 milliseconds)
        setTimeout(() => {
            messageBox.remove();
        }, 5000);
    }
    
    
}




function viewRecords() {
    const viewType = document.getElementById('view-type').value;
    window.location.href = `${viewType}-records.php`;
}


// function openForm() {
//     const recordType = document.getElementById('record-type').value;
//     document.getElementById('form-modal').style.display = 'flex';

//     // Clear any previous error messages
//     document.getElementById('error-message').style.display = 'none';
//     document.getElementById('error-message').textContent = '';

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

// function closeForm() {
//     document.getElementById('form-modal').style.display = 'none';
// }

// function submitForm() {
//     const recordType = document.getElementById('record-type').value;
//     let formData = new FormData();
//     let hasError = false;
//     let errorMessage = '';

//     // Client-side validation based on record type
//     if (recordType === 'eggs') {
//         const eggCount = document.getElementById('egg-count').value;
//         const eggDate = document.getElementById('egg-date').value;

//         if (!eggCount || eggCount <= 0) {
//             hasError = true;
//             errorMessage += 'Egg Count must be a positive number.\n';
//         }
//         if (!eggDate) {
//             hasError = true;
//             errorMessage += 'Date is required.\n';
//         }

//         formData.append('eggCount', eggCount);
//         formData.append('eggDate', eggDate);
//     } else if (recordType === 'birds') {
//         const birdType = document.getElementById('bird-type').value;
//         const birdQuantity = document.getElementById('bird-quantity').value;

//         if (!birdType) {
//             hasError = true;
//             errorMessage += 'Type of Bird is required.\n';
//         }
//         if (!birdQuantity || birdQuantity <= 0) {
//             hasError = true;
//             errorMessage += 'Number of Birds must be a positive number.\n';
//         }

//         formData.append('birdType', birdType);
//         formData.append('birdQuantity', birdQuantity);
//     } else if (recordType === 'feed') {
//         const feedType = document.getElementById('feed-type').value;
//         const feedQuantity = document.getElementById('feed-quantity').value;
//         const feedDate = document.getElementById('feed-date').value;

//         if (!feedType) {
//             hasError = true;
//             errorMessage += 'Type of Feed is required.\n';
//         }
//         if (!feedQuantity || feedQuantity <= 0) {
//             hasError = true;
//             errorMessage += 'Quantity of Feed must be a positive number.\n';
//         }
//         if (!feedDate) {
//             hasError = true;
//             errorMessage += 'Date is required.\n';
//         }

//         formData.append('feedType', feedType);
//         formData.append('feedQuantity', feedQuantity);
//         formData.append('feedDate', feedDate);
//     } else if (recordType === 'employee') {
//         const employeeName = document.getElementById('employee-name').value;
//         const employeeRole = document.getElementById('employee-role').value;
//         const employeeSalary = document.getElementById('employee-salary').value;

//         if (!employeeName) {
//             hasError = true;
//             errorMessage += 'Employee Name is required.\n';
//         }
//         if (!employeeRole) {
//             hasError = true;
//             errorMessage += 'Employee Role is required.\n';
//         }
//         if (!employeeSalary || employeeSalary <= 0) {
//             hasError = true;
//             errorMessage += 'Employee Salary must be a positive number.\n';
//         }

//         formData.append('employeeName', employeeName);
//         formData.append('employeeRole', employeeRole);
//         formData.append('employeeSalary', employeeSalary);
//     } else if (recordType === 'sales') {
//         const productName = document.getElementById('product-name').value;
//         const quantitySold = document.getElementById('quantity-sold').value;
//         const saleDate = document.getElementById('sale-date').value;
//         const totalAmount = document.getElementById('total-amount').value;

//         if (!productName) {
//             hasError = true;
//             errorMessage += 'Product Name is required.\n';
//         }
//         if (!quantitySold || quantitySold <= 0) {
//             hasError = true;
//             errorMessage += 'Quantity Sold must be a positive number.\n';
//         }
//         if (!saleDate) {
//             hasError = true;
//             errorMessage += 'Sale Date is required.\n';
//         }
//         if (!totalAmount || totalAmount <= 0) {
//             hasError = true;
//             errorMessage += 'Total Amount must be a positive number.\n';
//         }

//         formData.append('productName', productName);
//         formData.append('quantitySold', quantitySold);
//         formData.append('saleDate', saleDate);
//         formData.append('totalAmount', totalAmount);
//     }

//     // Display errors if any validation fails
//     if (hasError) {
//         document.getElementById('error-message').style.display = 'block';
//         document.getElementById('error-message').textContent = errorMessage;
//         return; // Prevent form submission if there are errors
//     }

//     // If no errors, proceed with form submission
//     fetch('./includes/submit_record.php', {
//         method: 'POST',
//         body: formData
//     })
//     .then(response => response.text())
//     .then(data => {
//         alert(data); // Show success message
//         closeForm(); // Close the modal
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });
// }
