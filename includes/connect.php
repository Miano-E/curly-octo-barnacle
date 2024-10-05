<?php 

$servername = "localhost";
$username = "root";
$password = "";
$db_name = "epms";

// Create a connection
$conn = new mysqli($servername, $username, $password, $db_name);

// Check the connection
if ($conn->connect_error) {
    die("Error connecting to the database: " . $conn->connect_error);
}
?>
