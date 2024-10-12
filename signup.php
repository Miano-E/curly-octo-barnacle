<?php
session_start();
require_once 'includes/connect.php'; // Database connection

// Initialize variables
$colors = [
    '#2C3E50', // Dark Blue
    '#34495E', // Dark Gray Blue
    '#4A4A4A', // Dark Gray
    '#7F8C8D', // Grayish
    '#8E44AD', // Dark Purple
    '#C0392B', // Dark Red
    '#D35400', // Dark Orange
    '#27AE60', // Dark Green
    '#2980B9', // Dark Teal Blue
];

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username']);
    $password = trim($_POST['password']);
    $role = trim($_POST['role']);

    // Validate inputs
    if (empty($username) || empty($password) || empty($role)) {
        $error = 'Please fill in all the fields.';
    } else {
        // Check if username is already taken
        $sql = "SELECT id FROM users WHERE username = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('s', $username);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            $error = 'Username already exists.';
        } else {
            // Hash the password
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);

            $color = $colors[array_rand($colors)]; // Randomly select a color

            // Insert the new user into the database
            $sql = "INSERT INTO users (username, password, role, color) VALUES (?, ?, ?, ?)";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param('ssss', $username, $hashed_password, $role, $color);
                        
            if ($stmt->execute()) {
                // Redirect to login page or dashboard after successful signup
                header('Location: login.php');
                exit();
            } else {
                $error = 'Error creating account. Please try again.';
            }
        }

        $stmt->close();
    }
}

$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign up | EPMS</title>
    <link rel="stylesheet" href="css/login.css">
</head>
<body>
<div class="signup-container">
    <form method="POST" action="signup.php">
        <h2>Create an Account</h2>
        <?php if ($error): ?>
            <p class="error"><?php echo $error; ?></p>
        <?php endif; ?>
        <div class="input-group">
            <label for="username">Username</label>
            <input type="text" name="username" id="username">
        </div>
        <div class="input-group">
            <label for="password">Password</label>
            <input type="password" name="password" id="password">
        </div>
        <div class="input-group">
            <label for="role">Role</label>
            <select name="role" id="role">
                <option value="admin">Admin</option>
                <option value="employee">Employee</option>
            </select>
        </div>
        <button type="submit" class="btn">Sign Up</button>
        <p class="status">Already have an account? <a href="login.php">Login</a></p>

    </form>
</div>

</body>
</html>

