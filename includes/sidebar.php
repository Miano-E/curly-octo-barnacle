<?php
$current_page = basename($_SERVER['PHP_SELF']);
$page_heading = '';

switch ($current_page) {
    case 'index.php':
        $page_heading = 'Dashboard';
        break;
    case 'eggs-records.php':
        $page_heading = 'Eggs Records';
        break;
    case 'birds-records.php':
        $page_heading = 'Birds Records';
        break;
    case 'feed-records.php':
        $page_heading = 'Feeds Records';
        break;
    case 'sales-records.php':
        $page_heading = 'Sales Records';
        break;
    case 'employee-records.php':
        $page_heading = 'Employees Records';
        break;
    case 'logout.php':
        $page_heading = 'Logout';
        break;
    default:
        $page_heading = 'EPMS';
}
?>

<header class="page-header">
    <h1><?php echo $page_heading; ?></h1>
    <button id="openSidebarBtn" class="toggle-btn">&#9776;</button> <!-- Hamburger menu for opening the sidebar -->
</header>

<div class="sidebar" id="sidebar">
    <button id="closeSidebarBtn" class="close-btn">&times;</button> <!-- Close icon inside the sidebar -->
    <p class="text-center"><span class="logo">EPMS</span></p>

    <ul class="sidebar__menu">
        <li><a href="index.php" class="<?php echo $current_page == 'index.php' ? 'active' : ''; ?>"><i class="fa fa-home"></i>Dashboard</a></li>
        <li><a href="eggs-records.php" class="<?php echo $current_page == 'eggs-records.php' ? 'active' : ''; ?>"><i class="fa fa-egg"></i>Eggs</a></li>
        <li><a href="birds-records.php" class="<?php echo $current_page == 'birds-records.php' ? 'active' : ''; ?>"><i class="fa fa-dove"></i>Birds</a></li>
        <li><a href="feed-records.php" class="<?php echo $current_page == 'feed-records.php' ? 'active' : ''; ?>"><i class="fa fa-leaf"></i>Feeds</a></li>
        <li><a href="sales-records.php" class="<?php echo $current_page == 'sales-records.php' ? 'active' : ''; ?>"><i class="fa fa-line-chart"></i>Sales</a></li>
        <li><a href="employee-records.php" class="<?php echo $current_page == 'employee-records.php' ? 'active' : ''; ?>"><i class="fa fa-user"></i>Employees</a></li>
        <li><a href="logout.php" class="<?php echo $current_page == 'logout.php' ? 'active' : ''; ?>"><i class="fa fa-power-off"></i>Logout</a></li>
    </ul>
</div>


<script>
    document.addEventListener('DOMContentLoaded', function() {
        var sidebar = document.getElementById('sidebar');
        var openBtn = document.getElementById('openSidebarBtn');
        var closeBtn = document.getElementById('closeSidebarBtn');

        // Open sidebar
        openBtn.addEventListener('click', function() {
            sidebar.classList.add('open');
        });

        // Close sidebar
        closeBtn.addEventListener('click', function() {
            sidebar.classList.remove('open');
        });
    });

</script>