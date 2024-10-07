<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Employees</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body>
    <?php include 'includes/sidebar.php'; ?>
    <div class="container content" data-record-type="employee">
        <div class="table-container">
            <table id="employees-records-table">
                <thead>
                    <tr>
                        <th>Employee Name</th>
                        <th>Employee Role</th>
                        <th>Employee Salary</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
        </div>
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