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
        </div>
    </div>

    <form action="editComment.php" method="POST" class="center">
    <input type="hidden" name="token" value="<?php echo $_SESSION['token'];?>" />
        <p class="title">Edit comment</p>
        <div class="writeeditcomments">
            <p class="writeeditcommentsp">
                <label for="contentinput">Comment:</label><br>
                <textarea type="text" name="contentinput" id="commenttextarea"></textarea>
            </p>
        </div>
        <p class="commentbutton">
            <button type='submit' name='comment_id' value = '<?php echo $_POST['comment_id']; ?>'>
                Edit Comment
            </button>
        </p>
    </form>
</body>