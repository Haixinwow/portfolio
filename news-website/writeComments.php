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

    <form action="writeComment.php" method="POST" class="center">
    <input type="hidden" name="token" value="<?php echo $_SESSION['token'];?>" />
        <p class="title">Write a comment</p>
        <div class="writeeditcomments">
            <p class="writeeditcommentsp">
                <label for="contentinput">Comment:</label><br>
                <textarea type="text" name="contentinput" id="commenttextarea"></textarea>
            </p>
        </div>
        <p class="commentbutton">
            <button type='submit' name = 'story_id2' value = '<?php echo $_POST['story_id']; ?>'>
                Write a Comment
            </button>
        </p>
    </form>
</body>