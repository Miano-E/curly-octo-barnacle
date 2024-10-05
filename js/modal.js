// Opens the modal and populates it with the selected record's data
function openEditModal(recordType, record, index) {
    const editModal = document.getElementById('edit-form-modal');
    editModal.style.display = 'flex'; // Show modal

    const editForm = document.getElementById('edit-record-form');
    editForm.innerHTML = ''; // Clear any previous content

    // Populate the form with fields based on record type
    if (recordType === 'eggs') {
        editForm.innerHTML += `
            <label>Date:</label>
            <input type="date" name="date" value="${record.date}">
            <label>Egg Count:</label>
            <input type="number" name="eggCount" value="${record.eggCount}">
        `;
    } else if (recordType === 'birds') {
        editForm.innerHTML += `
            <label>Bird Type:</label>
            <input type="text" name="birdType" value="${record.birdType}">
            <label>Bird Quantity:</label>
            <input type="number" name="birdQuantity" value="${record.birdQuantity}">
        `;
    }
    // Add more record types as needed

    // Hidden input to store the index of the record being edited
    editForm.innerHTML += `<input type="hidden" name="recordIndex" value="${index}">`;
}

// Handles the form submission, updates the record, and re-renders the table
function submitEditForm() {
    const form = document.getElementById('edit-record-form');
    const index = form.querySelector('input[name="recordIndex"]').value;
    const recordType = document.querySelector('.container.content').getAttribute('data-record-type');
    const records = JSON.parse(localStorage.getItem(recordType)) || [];

    // Update the specific record with the new data from the form
    const updatedRecord = {};
    new FormData(form).forEach((value, key) => {
        updatedRecord[key] = value;
    });
    records[index] = updatedRecord;

    // Save updated records to localStorage
    localStorage.setItem(recordType, JSON.stringify(records));

    // Re-render the table
    document.querySelector('table tbody').innerHTML = ''; // Clear existing rows
    tableBody = document.querySelector(`table[data-record-type="${recordType}"] tbody`);
    records.forEach((record, index) => {
        const row = tableBody.insertRow();
        // populate row with updated data as in the previous function
    });

    closeEditForm(); // Close modal
}

// Closes the modal
function closeEditForm() {
    document.getElementById('edit-form-modal').style.display = 'none';
}
