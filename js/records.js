function openForm() {
    const recordTypeDropdown = document.getElementById('record-type');
    const recordType = recordTypeDropdown ? recordTypeDropdown.value : document.querySelector('.container.content').getAttribute('data-record-type');
    
    // Blur the background
    document.querySelector('.container.content').classList.add('blur');

    // Open the modal
    const modal = document.getElementById('form-modal');
    modal.style.display = 'flex';

    // Center the modal on the screen
    modal.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Set modal title to "Add New" for all record types
    const modalTitle = document.getElementById('modal-title');
    modalTitle.textContent = `Add New ${recordType.charAt(0).toUpperCase() + recordType.slice(1)} Record`;

    // Clear any existing form content
    const form = document.getElementById('record-form');
    form.innerHTML = '';

    // Generate form fields based on record type (adding only)
    if (recordType === 'eggs') {
        form.innerHTML += `
            <label>Egg Count</label>
            <input type="number" id="egg-count" value=""<br>
        `;
        form.innerHTML += `
            <label>Date</label>
            <input type="date" id="egg-date" value=""<br>
        `;
    } else if (recordType === 'birds') {
        form.innerHTML += `
            <label>Type of Bird (e.g., Broiler, Layer)</label>
            <input type="text" id="bird-type" value=""<br>
        `;
        form.innerHTML += `
            <label>Number of Birds</label>
            <input type="number" id="bird-quantity" value=""<br>
        `;
    } else if (recordType === 'feed') {
        form.innerHTML += `
            <label>Type of Feed (e.g., Pellets, Mash)</label>
            <input type="text" id="feed-type" value=""<br>
        `;
        form.innerHTML += `
            <label>Quantity (kg)</label>
            <input type="number" id="feed-quantity" value=""<br>
        `;
        form.innerHTML += `
            <label>Date</label>
            <input type="date" id="feed-date" value=""<br>
        `;
    } else if (recordType === 'employee') {
        form.innerHTML += `
            <label>Employee Name</label>
            <input type="text" id="employee-name" value=""<br>
        `;
        form.innerHTML += `
            <label>Role</label>
            <input type="text" id="employee-role" value=""<br>
        `;
        form.innerHTML += `
            <label>Salary</label>
            <input type="number" id="employee-salary" value=""<br>
        `;
    } else if (recordType === 'sales') {
        form.innerHTML += `
            <label>Product Name</label>
            <input type="text" id="product-name" value=""<br>
        `;
        form.innerHTML += `
            <label>Quantity Sold</label>
            <input type="number" id="quantity-sold" value=""<br>
        `;
        form.innerHTML += `
            <label>Sale Date</label>
            <input type="date" id="sale-date" value=""<br>
        `;
        form.innerHTML += `
            <label>Total Amount (Ksh)</label>
            <input type="number" id="total-amount" value=""<br>
        `;
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

    // Create a new FormData object to hold the form data
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

    // Submit form data to the server endpoint
    const endpoint = './includes/submit_record.php';

    fetch(endpoint, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            // If submission is successful, show success message and refresh page
            displayMessage(data.message, 'success');
            closeForm(); // Close the modal after submission
            setTimeout(() => {
                window.location.reload(); // Reload the page to reflect the newly added record
            }, 2000);
        } else {
            // If there is an error, show the error message
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
    
        // Find the content container and append the message box there
        const contentContainer = document.querySelector('.container.content');
        if (contentContainer) {
            contentContainer.appendChild(messageBox);
        } else {
            document.body.appendChild(messageBox);  // Fallback if no container found
        }
    
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
