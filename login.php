<?php
session_start();
require 'includes/connect.php';

// Check if user is already logged in
if (isset($_SESSION['user_id'])) {
    header('Location: index.php');
    exit;
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = trim($_POST['username']);
    $password = trim($_POST['password']);

    if (!empty($username) && !empty($password)) {
        // Query to check user in the database
        $stmt = $conn->prepare("SELECT id, username, password, color FROM users WHERE username = ?");
        $stmt->bind_param('s', $username);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            $stmt->bind_result($id, $db_username, $db_password, $db_color);
            $stmt->fetch();

            // Verify password
            if (password_verify($password, $db_password)) {
                // Start session and store user information
                $_SESSION['user_id'] = $id;
                $_SESSION['username'] = $db_username;
                $_SESSION['color'] = $db_color;

                header('Location: index.php'); // Redirect to dashboard
                exit;
            } else {
                $error = 'Invalid password.';
            }
        } else {
            $error = 'No user found with that username.';
        }
        $stmt->close();
    } else {
        $error = 'Please fill in all fields.';
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login | EPMS</title>
    <link rel="stylesheet" href="css/login.css">
</head>
<body>
    <div class="login-container">
        <form method="POST" action="#">
            <h2>Login to EPMS</h2>
            <?php if ($error): ?>
                <p class="error"><?php echo $error; ?></p>
            <?php endif; ?>
            <div class="input-group">
                <label for="username">Username</label>
                <input type="text" name="username" id="username" required>
            </div>
            <div class="input-group">
                <label for="password">Password</label>
                <input type="password" name="password" id="password" required>
                <p class="demo-credentials">Test Account: <strong>Demo</strong> / <strong>Demo@123</strong></p>
            </div>
            <button type="submit" class="btn">Login</button>
            <p class="status">Don't have an account? <a href="signup.php">Create</a></p>
        </form>
    </div>
</body>
</html>
