<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Egg Records</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">

</head>
<body>

<?php include 'includes/sidebar.php'; ?>
<!-- <php include 'includes/formal-modal.php'; ?> -->

<div class="container content" data-record-type="eggs">
    <table id="egg-records-table">
        <thead>
            <tr>
                <th>Date</th>
                <th>Egg Count</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <!-- Dynamic rows will be inserted here -->
        </tbody>
    </table>

    <?php include 'includes/pagination.php'; ?>

    <!-- Wrap the button in a div for centering -->
    <div class="button-container">
        <button class="button-primary" onclick="openForm()">Add a New Record</button>
    </div>

    <?php include 'includes/modal.php'; ?>
</div>

<!-- Include the JavaScript files -->
<script src="js/records.js"></script>
<script src="js/table-records.js"></script>

</body>
</html>
