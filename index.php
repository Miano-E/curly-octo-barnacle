<?php

include 'includes/connect.php';

// Fetch the total eggs count
$queryEggs = "SELECT SUM(egg_count) AS total_eggs FROM eggs";
$resultEggs = $conn->query($queryEggs);
$totalEggs = 0;
if ($resultEggs) {
    $rowEggs = $resultEggs->fetch_assoc();
    $totalEggs = $rowEggs['total_eggs'] ?? 0;
}

$query = "SELECT SUM(bird_quantity) AS total_birds FROM birds";
$result = $conn->query($query);

$totalBirds = 0;

if ($result) {
    $row = $result->fetch_assoc();
    $totalBirds = $row['total_birds'];
}

$querySales = "SELECT SUM(total_amount) AS total_sales FROM sales";
$resultSales = $conn->query($querySales);
$totalSales = 0;
if ($resultSales) {
    $rowSales = $resultSales->fetch_assoc();
    $totalSales = $rowSales['total_sales'] ?? 0;
}

// Fetch the total employee count
$queryEmployees = "SELECT COUNT(*) AS total_employees FROM employees";
$resultEmployees = $conn->query($queryEmployees);
$totalEmployees = 0;
if ($resultEmployees) {
    $rowEmployees = $resultEmployees->fetch_assoc();
    $totalEmployees = $rowEmployees['total_employees'] ?? 0;
}

$eggThreshold = 100;
$birdThreshold = 250;

?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/x-icon" href="icons/egg-icon.png">
    <title>EPMS Dashboard</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
    </head>
<body>

<?php include 'includes/sidebar.php'; ?>



<div class="container content">
    <div class="top-section">
        <div class="stat <?php echo ($totalEggs < $eggThreshold) ? 'alert' : ''; ?>">
            <div class="stat__content">
                <?php if ($totalEggs < $eggThreshold): ?>
                    <div class="stat__alert">
                        ⚠️ Low egg stock! Only <?php echo number_format($totalEggs); ?> eggs left.
                    </div>
                <?php else: ?>
                    <h3>Total Eggs</h3>
                    <p><?php echo number_format($totalEggs); ?></p>
                <?php endif; ?>
            </div>
        </div>

        <div class="stat <?php echo ($totalBirds < $birdThreshold) ? 'alert' : ''; ?>">
            <div class="stat__content">
                <?php if ($totalBirds < $birdThreshold): ?>
                    <!-- Show the alert when stock is below the threshold -->
                    <div class="stat__alert">
                        ⚠️ Low bird stock! Only <?php echo number_format($totalBirds); ?> birds left.
                    </div>
                <?php else: ?>
                    <h3>Total Birds</h3>
                    <p><?php echo number_format($totalBirds); ?></p>
                <?php endif; ?>
            </div>
        </div>

        <div class="stat">
            <div class="stat__content">
                <h3>Total Sales</h3>
                <p><?php echo number_format($totalSales); ?></p>
            </div>
        </div>

        <div class="stat">
            <div class="stat__content">
                <h3>Total Employees</h3>
                <p><?php echo number_format($totalEmployees); ?></p>
            </div>
        </div>


    </div>

    <div class="main-section">
        <div class="chart-section">
            <div class="chart-card">
                <h3>Monthly Egg Production</h3>
                <canvas id="monthlyEggProductionChart"></canvas>
            </div>

            <div class="chart-card">
                <h3>Monthly Sales</h3>
                <canvas id="monthlySalesChart"></canvas>
            </div>

            <div class="chart-card">
                <h3>Feed Consumption</h3>
                <canvas id="feedConsumptionChart"></canvas>
            </div>

            <div class="chart-card">
                <h3>Employee Roles and Salaries</h3>
                <div id="employeeRolesChart"></div>
            </div>
        </div>
    </div>

</div>


<section class="bottom_section">
    <div class="container">
        <div class="bottom-section">
            <div class="record-type-section">
                <label for="record-type" class="record-type-label">Select Record Type</label>
                <select id="record-type">
                    <option value="eggs">Eggs</option>
                    <option value="birds">Birds</option>
                    <option value="feed">Feeds</option>
                    <option value="sales">Sales</option>
                    <option value="employee">Employees</option>
                </select>
                <button class="button-primary" onclick="openForm()">Add New Records</button>
    
            </div>
    
            <div class="view-type-section">
                <label for="view-type" class="view-type-label">View Records</label>
                <select id="view-type">
                    <option value="eggs">Eggs</option>
                    <option value="birds">Birds</option>
                    <option value="feed">Feeds</option>
                    <option value="sales">Sales</option>
                    <option value="employee">Employees</option>
                </select>
                <button class="button-primary" onclick="viewRecords()">View Records</button>
            </div>
        </div>
    
        <?php include 'includes/modal.php'; ?>
    </div>
</section>

    <script src="js/script.js"></script>
    <script src="js/records.js"></script>

</body>
</html>
