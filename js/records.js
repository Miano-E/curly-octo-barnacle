function openForm(record = null) {
    const recordTypeDropdown = document.getElementById('record-type');
    const recordType = recordTypeDropdown ? recordTypeDropdown.value : document.querySelector('.container.content').getAttribute('data-record-type');

    // Open the modal
    document.getElementById('form-modal').style.display = 'flex';

    // Set modal title: Add or Edit depending on whether a record is passed
    const modalTitle = document.getElementById('modal-title');
    if (record) {
        modalTitle.textContent = `Edit ${recordType.charAt(0).toUpperCase() + recordType.slice(1)} Record`;
    } else {
        modalTitle.textContent = `Add New ${recordType.charAt(0).toUpperCase() + recordType.slice(1)} Record`;
    }

    const form = document.getElementById('record-form');
    form.innerHTML = ''; // Clear previous form fields

    // Generate form fields based on record type and populate if editing
    if (recordType === 'eggs') {
        form.innerHTML += `<label>Egg Count</label><input type="number" id="egg-count" value="${record ? record.egg_count : ''}"><br>`;
        form.innerHTML += `<label>Date</label><input type="date" id="egg-date" value="${record ? record.date : ''}"><br>`;
    } else if (recordType === 'birds') {
        form.innerHTML += `<label>Type of Bird (e.g., Broiler, Layer)</label><input type="text" id="bird-type" value="${record ? record.bird_type : ''}"><br>`;
        form.innerHTML += `<label>Number of Birds</label><input type="number" id="bird-quantity" value="${record ? record.bird_quantity : ''}"><br>`;
    } else if (recordType === 'feed') {
        form.innerHTML += `<label>Type of Feed (e.g., Pellets, Mash)</label><input type="text" id="feed-type" value="${record ? record.feed_type : ''}"><br>`;
        form.innerHTML += `<label>Quantity (kg)</label><input type="number" id="feed-quantity" value="${record ? record.feed_quantity : ''}"><br>`;
        form.innerHTML += `<label>Date</label><input type="date" id="feed-date" value="${record ? record.feed_date : ''}"><br>`;
    } else if (recordType === 'employee') {
        form.innerHTML += `<label>Employee Name</label><input type="text" id="employee-name" value="${record ? record.employee_name : ''}"><br>`;
        form.innerHTML += `<label>Role</label><input type="text" id="employee-role" value="${record ? record.employee_role : ''}"><br>`;
        form.innerHTML += `<label>Salary</label><input type="number" id="employee-salary" value="${record ? record.employee_salary : ''}"><br>`;
    } else if (recordType === 'sales') {
        form.innerHTML += `<label>Product Name</label><input type="text" id="product-name" value="${record ? record.product_name : ''}"><br>`;
        form.innerHTML += `<label>Quantity Sold</label><input type="number" id="quantity-sold" value="${record ? record.quantity_sold : ''}"><br>`;
        form.innerHTML += `<label>Sale Date</label><input type="date" id="sale-date" value="${record ? record.sale_date : ''}"><br>`;
        form.innerHTML += `<label>Total Amount (Ksh)</label><input type="number" id="total-amount" value="${record ? record.total_amount : ''}"><br>`;
    }

    // If editing, set the record ID on the form for use during submission
    if (record) {
        form.setAttribute('data-edit-id', record.id);
    } else {
        form.removeAttribute('data-edit-id'); // For adding new, make sure the ID is not set
    }
}



function closeForm() {
    document.getElementById('form-modal').style.display = 'none';
    document.querySelector('.container.content').classList.remove('blur');
}

window.addEventListener('click', function(event) {
    const modal = document.getElementById('form-modal');
    const modalContent = document.querySelector('.modal-content');

    if (event.target === modal) {
        closeForm();
    }
});


function submitForm() {
    let recordType;

    const recordTypeDropdown = document.getElementById('record-type');
    
    if (recordTypeDropdown) {
        recordType = recordTypeDropdown.value;
    } else {
        const contentContainer = document.querySelector('.container.content');
        recordType = contentContainer.getAttribute('data-record-type');
    }

    let formData = new FormData();
    formData.append('recordType', recordType);

    const form = document.getElementById('record-form');
    const editId = form.getAttribute('data-edit-id');

    if (editId) {
        formData.append('id', editId);  // If we're editing, append the ID
    }

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

    // Determine the correct endpoint (submit_record.php for new records, update_record.php for edits)
    const endpoint = editId ? './includes/update_record.php' : './includes/submit_record.php';

    fetch(endpoint, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())  // Expecting JSON response
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
        const messageBox = document.createElement('div');
        messageBox.className = `message-box ${type}`;
        messageBox.innerHTML = `${message} <span class="close-btn">&times;</span>`;
        
        document.body.appendChild(messageBox);
        
        const closeBtn = messageBox.querySelector('.close-btn');
        closeBtn.addEventListener('click', () => {
            messageBox.remove();
        });

        setTimeout(() => {
            messageBox.remove();
        }, 5000);
    }
}

function viewRecords() {
    const viewType = document.getElementById('view-type').value;
    window.location.href = `${viewType}-records.php`;
}
