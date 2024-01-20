<!DOCTYPE html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>News</title>
    <link rel="stylesheet" href="home.css"> 
</head>
<body>
    <?php
        require "database.php";
        session_start();

        $username = $_SESSION['username'];
        $content = $_POST['contentinput'];
        $userid = $_SESSION['user_id'];
        $storyid = $_POST['story_id2'];
        
        if($content == ""){
            header("location: writeCommentFailure.html");
            exit;
        }

        

        $stmt = $mysqli->prepare("insert into comments (comment_username, comment_content, comment_user_id, comment_story_id) values (?, ?, ?, ?)");
        $stmt->bind_param('ssii', $username, $content, $userid, $storyid);
        if(!$stmt){
            printf("Query Prep Failed: %s\n", $mysqli->error);
            exit;
        }
        $stmt->execute();
        $stmt->close();

        header("location: writeCommentSuccess.html");
    ?>
</body>
</html>