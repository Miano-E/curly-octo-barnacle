<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test</title>
    <link rel="stylesheet" href="css/style.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>


<div class="container content">
    <div class="bottom-section">
        <!-- Dropdown for selecting record type -->
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
<script src="js/records.js"></script>

</body>
</html>