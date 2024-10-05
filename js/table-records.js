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
                <a href="#" class="edit-record" data-id="${record.id}">
                    <i class="fas fa-edit"></i> Edit
                </a>
                <a href="#" class="delete-record" data-id="${record.id}" data-type="${recordType}">
                    <i class="fas fa-trash-alt"></i> Delete
                </a>
            `;
        });

        // Re-attach event listeners after rendering
        addEditEventListeners();
        addDeleteEventListeners();

        // Update pagination controls
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

    // Add edit event listeners
    function addEditEventListeners() {
        document.querySelectorAll('.edit-record').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const id = this.getAttribute('data-id');
                console.log('Editing record with ID:', id);
                // Logic for editing the record can go here
            });
        });
    }

    // Add delete event listeners
    function addDeleteEventListeners() {
        document.querySelectorAll('.delete-record').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const id = this.getAttribute('data-id');
                const recordType = this.getAttribute('data-type'); // Get the record type from the button
    
                // Show confirmation dialog before deleting
                if (confirm('Are you sure you want to delete this record?')) {
                    console.log('Deleting record with ID:', id);
                    deleteRecord(id, recordType); // Call deleteRecord with the ID and type
                } else {
                    console.log('Deletion canceled');
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
                console.error('Error deleting the record from the database');
                alert('Failed to delete the record. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error during record deletion:', error);
            alert('An error occurred while deleting the record.');
        });
    }
    


    // Fetch records on page load
    fetchRecords();
});




















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
