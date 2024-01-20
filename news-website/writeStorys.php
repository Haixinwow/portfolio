<!DOCTYPE html>

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
            <?php
                session_start();
                if(!isset($_SESSION['username'])){
                    header("location: loginFirst.html");
                    exit;
                }
            ?>
        </div>
    </div>

    <form action="writeStory.php" method="POST" class="center">
    <input type="hidden" name="token" value="<?php echo $_SESSION['token'];?>" />
        <p class="title">Write a Story</p>
        <div class="writeeditcomments">
            <div id="titleAndLink">
                <p>
                    <label for="titleinput">Title:</label><br>
                    <textarea type="text" name="titleinput" id="titleinput"></textarea>
                </p>
                <p>
                    <label for="linkinput">Link:</label><br>
                    <textarea type="text" name="linkinput" id="linkinput"></textarea>
                </p>
            </div>

            <p id="contentinput">
                <label for="contentinput">Content:</label><br>
                <textarea type="text" name="contentinput" id="contentinput2"></textarea>
            </p>
        </div>
        <p class="margin20">
            
            <input type="submit" value="Submit">
        </p>
    </form>
</body>