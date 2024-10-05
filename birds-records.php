<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Birds Records</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">

</head>
<body>

<?php include 'includes/sidebar.php'; ?>

<div class="container content" data-record-type="birds">    
    <table id="bird-records-table">
        <thead>
            <tr>
                <th>Type of Bird</th>
                <th>Flock Size</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <!-- The rows will be dynamically inserted here via JavaScript -->
        </tbody>
    </table>
    <?php include 'includes/pagination.php'; ?>

    <div class="button-container">
        <button class="button-primary" onclick="openForm()">Add a New Record</button>
    </div>

    <?php include 'includes/modal.php'; ?>
</div>

<script src="js/records.js"></script>
<script src="js/table-records.js"></script>


</body>
</html>
