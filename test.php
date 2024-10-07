<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test</title>
    <style>
        table {
            width: 80%;
            border-collapse: collapse;
            background-color: #bec6dc;
            font-size: 1.2rem;
            margin: 1.5rem auto;
            border: 1px solid #cdd3e6;
        }

        th, td {
            padding: 1rem;
        }

        th, tr {
            text-align: left;
        }

        th {
            background-color: #cdd3e6;
            border-bottom: 1px solid gray;
        }

        tr:nth-of-type(2n) {
            background-color: #cdd3e6;
        }

        /* Table container for overflow handling on smaller screens */
        .table-container {
            max-width: 80%;
            overflow-x: auto;
            margin: 1.5rem auto;
            border-radius: 8px;
        }

        .table-container::-webkit-scrollbar {
            height: 6px;
        }

        .table-container::-webkit-scrollbar-thumb {
            background-color: #888;
            border-radius: 10px;
        }

        .table-container::-webkit-scrollbar-track {
            background-color: #f1f1f1;
        }

        /* Row highlight when editing */
        tr.editing {
            background-color: #e9f7e9; /* Subtle light green background */
            transition: background-color 0.3s ease; /* Smooth transition */
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* Slight shadow to make it pop */
        }

        /* Responsive design for smaller screens */
        @media (max-width: 768px) {
            table {
                width: 100%;
                margin: 0;
                border: none;
            }

            th {
                display: none; /* Hide table headers on small screens */
            }

            td {
                display: grid;
                grid-template-columns: 15ch auto;
                padding: 0.5rem 1rem;
            }

            .action-btns {
                display: flex;
                flex-direction: column;
                gap: 0.3em;
            }

            table td input {
                width: 100%;
                padding: 5px;
                font-size: 1rem;
            }

            table td .actions button {
                margin: 5px 0;
                padding: 5px 10px;
                font-size: 0.9rem;
                border-radius: 5px;
                background-color: #4a8a47;
                color: white;
                border: none;
                cursor: pointer;
            }

            table td .actions .delete-record {
                background-color: #bc6363;
            }

            table tr.editing {
                background-color: #e9f7e9;
            }
        }



    </style>
    <!-- <link rel="stylesheet" href="css/style.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script> -->
</head>
<body>

<div class="table-container">
    <table id="egg-records-table">
        <thead>
            <tr>
                <th>Date</th>
                <th>Egg Count</th>
                <th>Date</th>
                <th>Egg Count</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <tr data-id="1">
                <td class="date">2024-09-01</td>
                <td class="egg-count">200</td>
                <td class="date">2024-09-01</td>
                <td class="egg-count">200</td>
                <td class="actions">
                    <button class="edit-record" onclick="editRow(this)">Edit</button>
                    <button class="delete-record" onclick="deleteRow(this)">Delete</button>
                </td>
            </tr>
    
            <tr data-id="2">
                <td class="date">2024-09-01</td>
                <td class="egg-count">200</td>
                <td class="date">2024-09-01</td>
                <td class="egg-count">200</td>
                <td class="actions">
                    <button class="edit-record" onclick="editRow(this)">Edit</button>
                    <button class="delete-record" onclick="deleteRow(this)">Delete</button>
                </td>
            </tr>
    
            <tr data-id="3">
                <td class="date">2024-09-01</td>
                <td class="egg-count">200</td>
                <td class="date">2024-09-01</td>
                <td class="egg-count">200</td>
                <td class="actions">
                    <button class="edit-record" onclick="editRow(this)">Edit</button>
                    <button class="delete-record" onclick="deleteRow(this)">Delete</button>
                </td>
            </tr>
    
            <tr data-id="4">
                <td class="date">2024-09-01</td>
                <td class="egg-count">200</td>
                <td class="date">2024-09-01</td>
                <td class="egg-count">200</td>
                <td class="actions">
                    <button class="edit-record" onclick="editRow(this)">Edit</button>
                    <button class="delete-record" onclick="deleteRow(this)">Delete</button>
                </td>
            </tr>
    
            <tr data-id="5">
                <td class="date">2024-09-01</td>
                <td class="egg-count">200</td>
                <td class="date">2024-09-01</td>
                <td class="egg-count">200</td>
                <td class="actions">
                    <button class="edit-record" onclick="editRow(this)">Edit</button>
                    <button class="delete-record" onclick="deleteRow(this)">Delete</button>
                </td>
            </tr>
        </tbody>
    </table>
</div>

<script>
function editRow(button) {
    // Remove the 'editing' class from any currently edited row
    const allRows = document.querySelectorAll('#egg-records-table tbody tr');
    allRows.forEach(row => row.classList.remove('editing'));

    // Get the row of the clicked edit button
    var row = button.closest('tr');

    // Add the 'editing' class to highlight the current row
    row.classList.add('editing');

    // Get the existing data
    var date = row.querySelector('.date').innerText;
    var eggCount = row.querySelector('.egg-count').innerText;

    // Replace the static text with input fields for editing
    row.querySelector('.date').innerHTML = `<input type="date" value="${date}">`;
    row.querySelector('.egg-count').innerHTML = `<input type="number" value="${eggCount}">`;

    // Change the edit button to a save button
    button.textContent = 'Save';
    button.onclick = function () { saveRow(this); };

    // Hide the delete button
    var deleteButton = row.querySelector('.delete-record');
    if (deleteButton) {
        deleteButton.style.display = 'none';
    }

    // Add a cancel button if it doesn't already exist
    var cancelButton = row.querySelector('.cancel-edit');
    if (!cancelButton) {
        cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.classList.add('cancel-edit');
        cancelButton.onclick = function () { cancelEdit(row, button); };
        row.querySelector('.actions').appendChild(cancelButton);
    }
}

// Function to save the edited row
function saveRow(button) {
    var row = button.closest('tr');

    // Get the input values
    var dateInput = row.querySelector('.date input');
    var eggCountInput = row.querySelector('.egg-count input');
    var newDate = dateInput.value;
    var newEggCount = eggCountInput.value;

    // Update the row with the new values
    row.querySelector('.date').innerText = newDate;
    row.querySelector('.egg-count').innerText = newEggCount;

    // Change the save button back to an edit button
    button.textContent = 'Edit';
    button.onclick = function () { editRow(this); };

    // Show the delete button again
    var deleteButton = row.querySelector('.delete-record');
    if (deleteButton) {
        deleteButton.style.display = 'inline-block';
    }

    // Remove the cancel button
    var cancelButton = row.querySelector('.cancel-edit');
    if (cancelButton) {
        cancelButton.remove();
    }

    // Remove the editing class to remove the highlight
    row.classList.remove('editing');
}

// Function to cancel the editing and revert changes
function cancelEdit(row, editButton) {
    // Get the original data from the dataset (if you have it, else you need to implement this)
    var originalDate = row.dataset.originalDate || row.querySelector('.date input').value;
    var originalEggCount = row.dataset.originalEggCount || row.querySelector('.egg-count input').value;

    // Revert the input fields back to text
    row.querySelector('.date').innerText = originalDate;
    row.querySelector('.egg-count').innerText = originalEggCount;

    // Change the save button back to the edit button
    editButton.textContent = 'Edit';
    editButton.onclick = function () { editRow(editButton); };

    // Show the delete button again
    var deleteButton = row.querySelector('.delete-record');
    if (deleteButton) {
        deleteButton.style.display = 'inline-block';
    }

    // Remove the cancel button
    var cancelButton = row.querySelector('.cancel-edit');
    if (cancelButton) {
        cancelButton.remove();
    }

    // Remove the editing class to remove the highlight
    row.classList.remove('editing');
}

function deleteRow(button) {
    var row = button.closest('tr');
    row.remove(); // You can replace this with an actual delete request
}

</script>

<!-- <table>
  <caption>The Snacks Available in the Inventory</caption>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Quantity</th>
      <th>Price</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td data-cell="name">Chips</td>
      <td data-cell="type">Snack</td>
      <td data-cell="quantity">50</td>
      <td data-cell="price">KES 100</td>
      <td data-cell="actions">
        <div class="action-btns">
          <button class="btn-delete" onclick="confirmDeleteSnack(1, 'Chips')">Delete</button>
          <button class="btn-consume" onclick="showConsumeForm(1)">Consume</button>
        </div>
      </td>
    </tr>
    <tr>
      <td data-cell="name">Cookies</td>
      <td data-cell="type">Snack</td>
      <td data-cell="quantity">30</td>
      <td data-cell="price">KES 150</td>
      <td data-cell="actions">
        <div class="action-btns">
          <button class="btn-delete" onclick="confirmDeleteSnack(2, 'Cookies')">Delete</button>
          <button class="btn-consume" onclick="showConsumeForm(2)">Consume</button>
        </div>
      </td>
    </tr>
    <tr>
      <td data-cell="name">Soda</td>
      <td data-cell="type">Beverage</td>
      <td data-cell="quantity">20</td>
      <td data-cell="price">KES 80</td>
      <td data-cell="actions">
        <div class="action-btns">
          <button class="btn-delete" onclick="confirmDeleteSnack(3, 'Soda')">Delete</button>
          <button class="btn-consume" onclick="showConsumeForm(3)">Consume</button>
        </div>
      </td>
    </tr>
    <tr>
      <td data-cell="name">Juice</td>
      <td data-cell="type">Beverage</td>
      <td data-cell="quantity">40</td>
      <td data-cell="price">KES 120</td>
      <td data-cell="actions">
        <div class="action-btns">
          <button class="btn-delete" onclick="confirmDeleteSnack(4, 'Juice')">Delete</button>
          <button class="btn-consume" onclick="showConsumeForm(4)">Consume</button>
        </div>
      </td>
    </tr>
  </tbody>
</table> -->


<!-- <div class="container content">
    <div class="bottom-section">
        <-- Dropdown for selecting record type 
        <div class="record-type-section">
            <label for="record-type" class="record-type-label">Select Record Type</label>
            <select id="record-type">
                <option value="eggs">Eggs</option>
                <option value="birds">Birds</option>
                <option value="feed">Feeds</option>
                <option value="sales">Sales</option>
                <option value="employee">Employee</option>
            </select>
            <button class="button-primary" onclick="openForm()">Add New Record</button>

        </div>
    </div>
    <div id="form-modal" class="modal" style="display:none;">
        <div class="modal-content">
            <span class="close" onclick="closeForm()">&times;</span>
            <h3 id="modal-title">Add New Record</h3>
            <form id="record-form">
            </form>
            <button type="submit" class="button-primary" onclick="submitForm()">Submit</button>
        </div>
    </div>
</div>
<script src="js/records.js"></script> -->

</body>
</html>