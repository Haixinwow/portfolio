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

        $title = $_POST['titleinput'];
        $link = $_POST['linkinput'];
        $content = $_POST['contentinput'];
        if($title == "" || $content == ""){
            header("location: writeStoryFailure.html");
            exit;
        }

        $user_id = $_SESSION['user_id'];

        $stmt = $mysqli->prepare("insert into story (story_title, uploader_username, uploader_user_id, story_content, story_link) values (?, ?, ?, ?, ?)");
        $stmt->bind_param('ssiss', $title, $username, $user_id, $content, $link);
        if(!$stmt){
            printf("Query Prep Failed: %s\n", $mysqli->error);
            exit;
        }
        $stmt->execute();
        $stmt->close();

        header("location: writeStorySuccess.html");
    ?>
</body>
</html>