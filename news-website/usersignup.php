<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>News</title>
    <link rel="stylesheet" href="home.css">
</head>

<body>
    <div class="header">
        <div class="headerLeft">
            <a href="home.php">News</a>
        </div>
        <div class="headerRight">
            <a href="usersignup.html">Register</a>
            <a href="userlogin.html">Login</a>
            <a href="logout.php">Log Out</a>

        </div>
    </div>

    <form action="signup.php" method="POST" class="center">
        <input type="hidden" name="token" value="<?php echo $_SESSION['token'];?>" />
        <p class="title">Register</p>
        <p>
            <label for="registernameinput">Username:</label>
            <input type="text" name="registernameinput" id="registernameinput">
        </p>
        <p>
            <label for="registerpasswordinput">Password:</label>
            <input type="text" name="registerpasswordinput" id="registerpasswordinput">
        </p>
        <p>
            <input type="submit" value="Create your Account">
        </p>
    </form>
</body>