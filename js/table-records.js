document.addEventListener('DOMContentLoaded', function() {
    const tableMap = {
        'eggs': '#egg-records-table tbody',
        'birds': '#bird-records-table tbody',
        'feed': '#feeds-records-table tbody',
        'sales': '#sales-records-table tbody',
        'employee': '#employees-records-table tbody'
    };

    // Select the container div and determine the record type
    const containerDiv = document.querySelector('.container.content');
    const recordType = containerDiv.getAttribute('data-record-type');
    const tableSelector = tableMap[recordType];
    const tableBody = document.querySelector(tableSelector);

    // If table body is not found, exit
    if (!tableBody) {
        console.error('Table body not found for record type:', recordType);
        return;
    }

    // Initialize pagination variables
    let recordsPerPage = 5;
    let currentPage = 1;
    let totalPages = 1;
    let recordsData = [];

    // Select pagination controls
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');
    const pageInfo = document.getElementById('page-info');

    // Fetch records from the server using AJAX
    function fetchRecords() {
        fetch(`./includes/fetch_records.php?type=${recordType}`)
            .then(response => response.text())
            .then(data => {
                try {
                    recordsData = JSON.parse(data);
                    totalPages = Math.ceil(recordsData.length / recordsPerPage);
                    renderTablePage(currentPage);
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                }
            })
            .catch(error => console.error('Error fetching records:', error));
    }

    // Render the records for the current page
    function renderTablePage(page) {
        const startIndex = (page - 1) * recordsPerPage;
        const endIndex = startIndex + recordsPerPage;
        const recordsToDisplay = recordsData.slice(startIndex, endIndex);
        
        // Clear the table before rendering
        tableBody.innerHTML = '';
        
        // Render the rows
        recordsToDisplay.forEach(record => {
            const row = tableBody.insertRow(-1);
            row.setAttribute('data-id', record.id); // Attach the record's ID to the row

            if (recordType === 'eggs') {
                row.insertCell(0).textContent = record.date;
                row.insertCell(1).textContent = `${record.egg_count} Eggs`;
            } else if (recordType === 'birds') {
                row.insertCell(0).textContent = record.bird_type;
                row.insertCell(1).textContent = `${record.bird_quantity} Birds`;
            } else if (recordType === 'feed') {
                row.insertCell(0).textContent = record.feed_date;
                row.insertCell(1).textContent = record.feed_type;
                row.insertCell(2).textContent = `${record.feed_quantity} Kgs`;
            } else if (recordType === 'sales') {
                row.insertCell(0).textContent = record.product_name;
                row.insertCell(1).textContent = record.quantity_sold;
                row.insertCell(2).textContent = record.sale_date;

                const formattedTotalAmount = Number(record.total_amount).toLocaleString();
                row.insertCell(3).textContent = `${formattedTotalAmount} Ksh`;
            } else if (recordType === 'employee') {
                row.insertCell(0).textContent = record.employee_name;
                row.insertCell(1).textContent = record.employee_role;

                const formattedSalary = Number(record.employee_salary).toLocaleString();
                row.insertCell(2).textContent = `${formattedSalary} Ksh`;
            }

            // Add Edit/Delete actions
            const actionsCell = row.insertCell(-1);
            actionsCell.innerHTML = `
                <a href="#" class="edit-record" data-id="${record.id}" onclick="editRow(this, '${recordType}')">
                    <i class="fas fa-edit"></i> Edit
                </a>
                <a href="#" class="delete-record" data-id="${record.id}" data-type="${recordType}" onclick="deleteRow(this)">
                    <i class="fas fa-trash-alt"></i> Delete
                </a>
            `;
        });

        addDeleteEventListeners();

        updatePaginationControls();
    }


    // Update pagination controls and page info
    function updatePaginationControls() {
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === totalPages;
    }

    // Pagination button listeners
    prevButton.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            renderTablePage(currentPage);
        }
    });

    nextButton.addEventListener('click', function() {
        if (currentPage < totalPages) {
            currentPage++;
            renderTablePage(currentPage);
        }
    });

    // Add delete event listeners
    function addDeleteEventListeners() {
        document.querySelectorAll('.delete-record').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const id = this.getAttribute('data-id');
                const recordType = this.getAttribute('data-type');
    
                // Show confirmation dialog before deleting
                if (confirm('Are you sure you want to delete this record?')) {
                    deleteRecord(id, recordType);
                }
            });
        });
    }

    // Function to handle record deletion logic
    function deleteRecord(recordId, recordType) {
        const rowToDelete = document.querySelector(`.delete-record[data-id='${recordId}']`).closest('tr');
        if (rowToDelete) {
            rowToDelete.remove(); // Remove the row from the table immediately
        }
    
        // Remove record from the database via an AJAX POST request
        fetch('./includes/fetch_records.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `id=${recordId}&type=${recordType}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log(`Record with ID ${recordId} deleted successfully`);
            } else {
                alert('Failed to delete the record. Please try again.');
            }
        })
        .catch(error => {
            alert('An error occurred while deleting the record.');
        });
    }

    // Fetch records on page load
    fetchRecords();
});

// Function to make a row editable
function editRow(editButton, recordType) {
    const row = editButton.closest('tr');
    row.classList.add('edit-mode');

    // Get the original data from the row's cells
    const cells = row.querySelectorAll('td');
    let originalData = Array.from(cells).map(cell => cell.textContent);

    // Convert the fields to editable inputs
    if (recordType === 'eggs') {
        cells[0].innerHTML = `<input type="date" class="egg-date-input" value="${originalData[0]}">`;
        cells[1].innerHTML = `<input type="number" class="egg-count-input" value="${parseInt(originalData[1])}">`;
    } else if (recordType === 'birds') {
        cells[0].innerHTML = `<input type="text" class="bird-type-input" value="${originalData[0]}">`;
        cells[1].innerHTML = `<input type="number" class="bird-quantity-input" value="${parseInt(originalData[1])}">`;
    } else if (recordType === 'feed') {
        cells[0].innerHTML = `<input type="date" class="feed-date-input" value="${originalData[0]}">`;
        cells[1].innerHTML = `<input type="text" class="feed-type-input" value="${originalData[1]}">`;
        cells[2].innerHTML = `<input type="number" class="feed-quantity-input" value="${parseInt(originalData[2])}">`;
    } else if (recordType === 'sales') {
        cells[0].innerHTML = `<input type="text" class="product-name-input" value="${originalData[0]}">`;
        cells[1].innerHTML = `<input type="number" class="quantity-sold-input" value="${parseInt(originalData[1])}">`;
        cells[2].innerHTML = `<input type="date" class="sale-date-input" value="${originalData[2]}">`;
        cells[3].innerHTML = `<input type="number" class="total-amount-input" value="${parseInt(originalData[3].replace(/\D/g, ''))}">`;
    } else if (recordType === 'employee') {
        cells[0].innerHTML = `<input type="text" class="employee-name-input" value="${originalData[0]}">`;
        cells[1].innerHTML = `<input type="text" class="employee-role-input" value="${originalData[1]}">`;
        cells[2].innerHTML = `<input type="number" class="employee-salary-input" value="${parseInt(originalData[2].replace(/\D/g, ''))}">`;
    }

    // Add Save and Cancel buttons
    const actionsCell = row.querySelector('td:last-child');
    actionsCell.innerHTML = `
        <a href="#" class="save-record" onclick="saveRow(this, '${recordType}')">
            <i class="fas fa-save"></i> Save
        </a>
        <a href="#" class="cancel-edit" data-original='${JSON.stringify(originalData)}' onclick="cancelEdit(this, '${recordType}')">
            <i class="fas fa-times"></i> Cancel
        </a>
    `;
}

function displayMessage(message, type) {
    const messageBox = document.createElement('div');
    messageBox.className = `message-box ${type}`;  // 'type' can be 'success' or 'error'
    messageBox.innerHTML = `${message} <span class="close-btn">&times;</span>`;
    
    document.body.appendChild(messageBox);
    
    // Add event listener to close the message box when the close button is clicked
    const closeBtn = messageBox.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        messageBox.remove();
    });

    // Automatically remove the message after 5 seconds
    setTimeout(() => {
        messageBox.remove();
    }, 5000);
}

function saveRow(saveButton, recordType) {
    const row = saveButton.closest('tr');
    const recordId = row.getAttribute('data-id'); // Fetch the record ID
    const cells = row.querySelectorAll('td');

    // Prepare an object to store the updated data
    let updatedData = { id: recordId, recordType: recordType };

    // Collect the updated values based on the record type
    if (recordType === 'eggs') {
        updatedData.eggDate = cells[0].querySelector('input').value;
        updatedData.eggCount = cells[1].querySelector('input').value;
    } else if (recordType === 'birds') {
        updatedData.birdType = cells[0].querySelector('input').value;
        updatedData.birdQuantity = cells[1].querySelector('input').value;
    } else if (recordType === 'feed') {
        updatedData.feedDate = cells[0].querySelector('input').value;
        updatedData.feedType = cells[1].querySelector('input').value;
        updatedData.feedQuantity = cells[2].querySelector('input').value;
    } else if (recordType === 'sales') {
        updatedData.productName = cells[0].querySelector('input').value;
        updatedData.quantitySold = cells[1].querySelector('input').value;
        updatedData.saleDate = cells[2].querySelector('input').value;
        updatedData.totalAmount = cells[3].querySelector('input').value;
    } else if (recordType === 'employee') {
        updatedData.employeeName = cells[0].querySelector('input').value;
        updatedData.employeeRole = cells[1].querySelector('input').value;
        updatedData.employeeSalary = cells[2].querySelector('input').value;
    }

    // Send the updated data to the server via AJAX
    fetch('./includes/update_record.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(updatedData).toString()
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            // If the update was successful, update the table row with the new data
            if (recordType === 'eggs') {
                cells[0].textContent = updatedData.eggDate;
                cells[1].textContent = `${updatedData.eggCount} Eggs`;
            } else if (recordType === 'birds') {
                cells[0].textContent = updatedData.birdType;
                cells[1].textContent = `${updatedData.birdQuantity} Birds`;
            } else if (recordType === 'feed') {
                cells[0].textContent = updatedData.feedDate;
                cells[1].textContent = updatedData.feedType;
                cells[2].textContent = `${updatedData.feedQuantity} Kgs`;
            } else if (recordType === 'sales') {
                cells[0].textContent = updatedData.productName;
                cells[1].textContent = updatedData.quantitySold;
                cells[2].textContent = updatedData.saleDate;
                const formattedTotalAmount = Number(updatedData.totalAmount).toLocaleString();
                cells[3].textContent = `${formattedTotalAmount} Ksh`;
            } else if (recordType === 'employee') {
                cells[0].textContent = updatedData.employeeName;
                cells[1].textContent = updatedData.employeeRole;
                const formattedSalary = Number(updatedData.employeeSalary).toLocaleString();
                cells[2].textContent = `${formattedSalary} Ksh`;
            }

            // Restore the original Edit/Delete buttons
            const actionsCell = row.querySelector('td:last-child');
            actionsCell.innerHTML = `
                <a href="#" class="edit-record" onclick="editRow(this, '${recordType}')">
                    <i class="fas fa-edit"></i> Edit
                </a>
                <a href="#" class="delete-record" onclick="deleteRow(this)">
                    <i class="fas fa-trash-alt"></i> Delete
                </a>
            `;

            // Show success message using displayMessage
            displayMessage('Record updated successfully.', 'success');
            row.classList.remove('edit-mode');
        } else {
            // Show error message using displayMessage
            displayMessage('Failed to update the record. Please try again.', 'error');
        }
    })
    .catch(error => {
        console.error('Error occurred while sending request:', error);  // Log fetch errors
        displayMessage('An error occurred while saving the record.', 'error');
    });
}


// Function to save the edited row
// function saveRow(saveButton, recordType) {
//     const row = saveButton.closest('tr');
//     const recordId = row.getAttribute('data-id'); // Fetch the record ID
//     const cells = row.querySelectorAll('td');

//     // Prepare an object to store the updated data
//     let updatedData = { id: recordId, recordType: recordType };

//     // Collect the updated values based on the record type
//     if (recordType === 'eggs') {
//         updatedData.eggDate = cells[0].querySelector('input').value;
//         updatedData.eggCount = cells[1].querySelector('input').value;
//     } else if (recordType === 'birds') {
//         updatedData.birdType = cells[0].querySelector('input').value;
//         updatedData.birdQuantity = cells[1].querySelector('input').value;
//     } else if (recordType === 'feed') {
//         updatedData.feedDate = cells[0].querySelector('input').value;
//         updatedData.feedType = cells[1].querySelector('input').value;
//         updatedData.feedQuantity = cells[2].querySelector('input').value;
//     } else if (recordType === 'sales') {
//         updatedData.productName = cells[0].querySelector('input').value;
//         updatedData.quantitySold = cells[1].querySelector('input').value;
//         updatedData.saleDate = cells[2].querySelector('input').value;
//         updatedData.totalAmount = cells[3].querySelector('input').value;
//     } else if (recordType === 'employee') {
//         updatedData.employeeName = cells[0].querySelector('input').value;
//         updatedData.employeeRole = cells[1].querySelector('input').value;
//         updatedData.employeeSalary = cells[2].querySelector('input').value;
//     }

//     console.log('Updated data being sent:', updatedData);  // Log the data being sent

//     // Send the updated data to the server via AJAX
//     fetch('./includes/update_record.php', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         body: new URLSearchParams(updatedData).toString()
//     })
//     .then(response => response.json())
//     .then(data => {
//         console.log('Raw response from server:', data);  // Log the server response

//         if (data.status === 'success') {
//             // If the update was successful, update the table row with the new data
//             if (recordType === 'eggs') {
//                 cells[0].textContent = updatedData.eggDate;
//                 cells[1].textContent = `${updatedData.eggCount} Eggs`;
//             } else if (recordType === 'birds') {
//                 cells[0].textContent = updatedData.birdType;
//                 cells[1].textContent = `${updatedData.birdQuantity} Birds`;
//             } else if (recordType === 'feed') {
//                 cells[0].textContent = updatedData.feedDate;
//                 cells[1].textContent = updatedData.feedType;
//                 cells[2].textContent = `${updatedData.feedQuantity} Kgs`;
//             } else if (recordType === 'sales') {
//                 cells[0].textContent = updatedData.productName;
//                 cells[1].textContent = updatedData.quantitySold;
//                 cells[2].textContent = updatedData.saleDate;

//                 const formattedTotalAmount = Number(updatedData.totalAmount).toLocaleString();
//                 cells[3].textContent = `${formattedTotalAmount} Ksh`;
//             } else if (recordType === 'employee') {
//                 cells[0].textContent = updatedData.employeeName;
//                 cells[1].textContent = updatedData.employeeRole;

//                 const formattedSalary = Number(updatedData.employeeSalary).toLocaleString();
//                 cells[2].textContent = `${formattedSalary} Ksh`;
//             }

//             // Restore the original Edit/Delete buttons
//             const actionsCell = row.querySelector('td:last-child');
//             actionsCell.innerHTML = `
//                 <a href="#" class="edit-record" onclick="editRow(this, '${recordType}')">
//                     <i class="fas fa-edit"></i> Edit
//                 </a>
//                 <a href="#" class="delete-record" onclick="deleteRow(this)">
//                     <i class="fas fa-trash-alt"></i> Delete
//                 </a>
//             `;

//             alert('Record updated successfully.');
//             row.classList.remove('edit-mode');

//         } else {
//             console.error('Error updating record:', data.message);  // Log the error message
//             alert('Failed to update the record. Please try again.');
//         }
//     })
//     .catch(error => {
//         console.error('Error occurred while sending request:', error);  // Log fetch errors
//         alert('An error occurred while saving the record.');
//     });
// }



// Cancel the edit and restore the original data
function cancelEdit(cancelButton, recordType) {
    const originalData = JSON.parse(cancelButton.getAttribute('data-original')); // Retrieve the original data
    const row = cancelButton.closest('tr');
    const cells = row.querySelectorAll('td');
    row.classList.remove('edit-mode');


    // Revert the fields back to their original values
    if (recordType === 'eggs') {
        cells[0].textContent = originalData[0];
        cells[1].textContent = originalData[1];
    } else if (recordType === 'birds') {
        cells[0].textContent = originalData[0];
        cells[1].textContent = originalData[1];
    } else if (recordType === 'feed') {
        cells[0].textContent = originalData[0];
        cells[1].textContent = originalData[1];
        cells[2].textContent = originalData[2];
    } else if (recordType === 'sales') {
        cells[0].textContent = originalData[0];
        cells[1].textContent = originalData[1];
        cells[2].textContent = originalData[2];
        cells[3].textContent = originalData[3];
    } else if (recordType === 'employee') {
        cells[0].textContent = originalData[0];
        cells[1].textContent = originalData[1];
        cells[2].textContent = originalData[2];
    }

    // Restore the original Edit/Delete buttons
    const actionsCell = row.querySelector('td:last-child');
    actionsCell.innerHTML = `
        <a href="#" class="edit-record" onclick="editRow(this, '${recordType}')">
            <i class="fas fa-edit"></i> Edit
        </a>
        <a href="#" class="delete-record" onclick="deleteRow(this)">
            <i class="fas fa-trash-alt"></i> Delete
        </a>
    `;
}


// // Save the edited row
// function saveRow(saveButton, recordType) {
//     const row = saveButton.closest('tr');
//     const recordId = row.getAttribute('data-id'); // Get the ID from the row

//     // Ensure the recordId is properly retrieved
//     if (!recordId) {
//         console.error('Record ID not found in the row.');
//         alert('Record ID is missing. Please refresh the page and try again.');
//         return;
//     }

//     // Collect updated data from the inputs
//     let updatedData = {};
    
//     if (recordType === 'eggs') {
//         updatedData = {
//             eggDate: row.querySelector('.egg-date-input').value,
//             eggCount: row.querySelector('.egg-count-input').value
//         };
//     } else if (recordType === 'birds') {
//         updatedData = {
//             birdType: row.querySelector('.bird-type-input').value,
//             birdQuantity: row.querySelector('.bird-quantity-input').value
//         };
//     } else if (recordType === 'feed') {
//         updatedData = {
//             feedDate: row.querySelector('.feed-date-input').value,
//             feedType: row.querySelector('.feed-type-input').value,
//             feedQuantity: row.querySelector('.feed-quantity-input').value
//         };
//     } else if (recordType === 'sales') {
//         updatedData = {
//             productName: row.querySelector('.product-name-input').value,
//             quantitySold: row.querySelector('.quantity-sold-input').value,
//             saleDate: row.querySelector('.sale-date-input').value,
//             totalAmount: row.querySelector('.total-amount-input').value
//         };
//     } else if (recordType === 'employee') {
//         updatedData = {
//             employeeName: row.querySelector('.employee-name-input').value,
//             employeeRole: row.querySelector('.employee-role-input').value,
//             employeeSalary: row.querySelector('.employee-salary-input').value
//         };
//     }

//     // Log for debugging
//     console.log("Record ID:", recordId);
//     console.log("Updated Data:", updatedData);

//     // Send updated data to the server via AJAX
//     fetch('./includes/update_record.php', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         body: `id=${recordId}&recordType=${recordType}&${serializeData(updatedData)}` // Serialize the updated data
//     })
//     .then(response => response.json())
//     .then(data => {
//         if (data.status === 'success') {
//             console.log('Record updated successfully');

//             // Update the data-original attribute with the new data
//             const originalDataElement = row.querySelector('[data-original]');
//             if (originalDataElement) {
//                 originalDataElement.setAttribute('data-original', JSON.stringify(Object.values(updatedData)));
//             } else {
//                 console.error('Element with data-original not found.');
//             }

//             // Exit the editing mode and reflect the updated data
//             cancelEdit(saveButton, recordType); // Use the updated data-original
//         } else {
//             alert('Failed to save changes. Please try again.');
//             console.error('Error:', data.message);
//         }
//     })
//     .catch(error => {
//         console.error('An error occurred:', error);
//         alert('An error occurred while saving the changes.');
//     });
// }



// // Cancel editing and restore original data
// function cancelEdit(cancelButton, recordType) {
//     // Retrieve the original data from the data-original attribute
//     const originalData = JSON.parse(cancelButton.getAttribute('data-original'));
//     if (!originalData) {
//         console.error("Original data is null or not found");
//         return;
//     }

//     const row = cancelButton.closest('tr');
//     const cells = row.querySelectorAll('td');

//     // Revert the fields back to their original values
//     if (recordType === 'sales') {
//         cells[0].textContent = originalData[0]; // productName
//         cells[1].textContent = originalData[1]; // quantitySold
//         cells[2].textContent = originalData[2]; // saleDate
//         cells[3].textContent = originalData[3]; // totalAmount
//     }

//     // Restore the original Edit/Delete buttons
//     const actionsCell = row.querySelector('td:last-child');
//     actionsCell.innerHTML = `
//         <a href="#" class="edit-record" onclick="editRow(this, '${recordType}')">
//             <i class="fas fa-edit"></i> Edit
//         </a>
//         <a href="#" class="delete-record" onclick="deleteRow(this)">
//             <i class="fas fa-trash-alt"></i> Delete
//         </a>
//     `;
// }




// // Helper function to serialize the data
// function serializeData(data) {
//     return Object.keys(data)
//         .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
//         .join('&');
// }




















// document.addEventListener('DOMContentLoaded', function() {
//     const tableMap = {
//         'eggs': '#egg-records-table tbody',
//         'birds': '#bird-records-table tbody',
//         'feed': '#feeds-records-table tbody',
//         'sales': '#sales-record-type tbody',
//         'employee': '#employees-record-type tbody'
//     };

//     // Using the div with data-record-type instead of the body
//     const containerDiv = document.querySelector('.container.content');
//     const recordType = containerDiv.getAttribute('data-record-type'); // Get record type from the div attribute
//     const tableSelector = tableMap[recordType]; // Get the correct table selector
//     const records = JSON.parse(localStorage.getItem(recordType)) || [];

//     const tableBody = document.querySelector(tableSelector);

//     // Ensure tableBody exists
//     if (!tableBody) {
//         console.error('Table body not found for record type:', recordType);
//         return;
//     }

//     function renderTable() {
//         tableBody.innerHTML = ''; // Clear the table before rendering

//         records.forEach((record, index) => {
//             const row = tableBody.insertRow(-1);

//             if (recordType === 'eggs') {
//                 row.insertCell(0).textContent = record.date;
//                 row.insertCell(1).textContent = record.eggCount;
//             } else if (recordType === 'birds') {
//                 row.insertCell(0).textContent = record.birdType;
//                 row.insertCell(1).textContent = record.birdQuantity;
//             } else if (recordType === 'feed') {
//                 row.insertCell(0).textContent = record.feedType;
//                 row.insertCell(1).textContent = `${record.feedQuantity} kg`;
//             } else if (recordType === 'sales') {
//                 row.insertCell(0).textContent = record.productName;
//                 row.insertCell(1).textContent = record.quantitySold;
//                 row.insertCell(2).textContent = record.saleDate;
//                 row.insertCell(3).textContent = Number(record.totalAmount).toLocaleString() + " Ksh";
//             } else if (recordType === 'employee') {
//                 row.insertCell(0).textContent = record.employeeName;
//                 row.insertCell(1).textContent = record.employeeRole;
//                 row.insertCell(2).textContent = Number(record.employeeSalary).toLocaleString() + " Ksh";
//             }

//             const actionsCell = row.insertCell(-1);
//             actionsCell.classList.add('actions');
//             actionsCell.innerHTML = `
//             <div class="action-btns">
//                 <a href="#" class="edit-record" data-index="${index}"><i class="fas fa-pencil-alt"></i> Edit</a>
//                 <a href="#" class="delete-record" data-index="${index}"><i class="fas fa-trash"></i> Delete</a>
//             </div>
//         `;

//         });
        
//         addEditEventListeners();
//         addDeleteEventListeners();

//     }

//     function addDeleteEventListeners() {
//         document.querySelectorAll('.delete-record').forEach(button => {
//             button.addEventListener('click', function(e) {
//                 e.preventDefault();
//                 const index = this.getAttribute('data-index');

//                 const confirmDelete = confirm('Are you sure you want to delete this record?');
//                 if (confirmDelete) {
//                     // Remove the record from array
//                     records.splice(index, 1);

//                     // Update localStorage
//                     localStorage.setItem(recordType, JSON.stringify(records));

//                     // Re-render the table
//                     renderTable();
//                 }
//             });
//         });
//     }

//     function addEditEventListeners() {
//         document.querySelectorAll('.edit-record').forEach(button => {
//             button.addEventListener('click', function(e) {
//                 e.preventDefault();
//                 const index = this.getAttribute('data-index');
//                 const record = records[index];
    
//                 // Open the modal
//                 const editModal = document.getElementById('edit-form-modal');
//                 editModal.style.display = 'block';
    
//                 // Populate the modal form with the correct record data
//                 const editForm = document.getElementById('edit-record-form');
//                 editForm.innerHTML = ''; // Clear any existing form content
    
//                 if (recordType === 'eggs') {
//                     editForm.innerHTML += `
//                         <label>Date:</label>
//                         <input type="date" name="date" value="${record.date}">
//                         <label>Egg Count:</label>
//                         <input type="number" name="eggCount" value="${record.eggCount}">
//                     `;
//                 } else if (recordType === 'birds') {
//                     editForm.innerHTML += `
//                         <label>Bird Type:</label>
//                         <input type="text" name="birdType" value="${record.birdType}">
//                         <label>Bird Quantity:</label>
//                         <input type="number" name="birdQuantity" value="${record.birdQuantity}">
//                     `;
//                 } else if (recordType === 'feed') {
//                     editForm.innerHTML += `
//                         <label>Feed Type:</label>
//                         <input type="text" name="feedType" value="${record.feedType}">
//                         <label>Feed Quantity (kg):</label>
//                         <input type="number" name="feedQuantity" value="${record.feedQuantity}">
//                     `;
//                 } else if (recordType === 'sales') {
//                     editForm.innerHTML += `
//                         <label>Product Name:</label>
//                         <input type="text" name="productName" value="${record.productName}">
//                         <label>Quantity Sold:</label>
//                         <input type="number" name="quantitySold" value="${record.quantitySold}">
//                         <label>Sale Date:</label>
//                         <input type="date" name="saleDate" value="${record.saleDate}">
//                         <label>Total Amount (Ksh):</label>
//                         <input type="number" name="totalAmount" value="${record.totalAmount}">
//                     `;
//                 } else if (recordType === 'employee') {
//                     editForm.innerHTML += `
//                         <label>Employee Name:</label>
//                         <input type="text" name="employeeName" value="${record.employeeName}">
//                         <label>Employee Role:</label>
//                         <input type="text" name="employeeRole" value="${record.employeeRole}">
//                         <label>Employee Salary (Ksh):</label>
//                         <input type="number" name="employeeSalary" value="${record.employeeSalary}">
//                     `;
//                 }
    
//                 // Add hidden index field to track which record is being edited
//                 editForm.innerHTML += `<input type="hidden" name="recordIndex" value="${index}">`;
    
//                 // Handle form submission
//                 document.querySelector('#edit-record-form').addEventListener('submit', function(event) {
//                     event.preventDefault(); // Prevent the form from refreshing the page
                    
//                     // Update record in records array
//                     const updatedRecord = new FormData(editForm);
//                     records[index] = Object.fromEntries(updatedRecord.entries());
    
//                     // Save updated record back to localStorage
//                     localStorage.setItem(recordType, JSON.stringify(records));
    
//                     // Re-render the table with updated data
//                     renderTable();
    
//                     // Close the modal
//                     editModal.style.display = 'none';
//                 });
//             });
//         });
//     }
    
//     // Initial table rendering
//     renderTable();
// });
