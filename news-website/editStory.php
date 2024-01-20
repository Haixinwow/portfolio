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
  
        $story_id = $_POST['story_id'];
        $story_title = $_POST['titleinput'];
        $story_link = $_POST['linkinput'];
        $story_content = $_POST['contentinput'];

        $stmt = $mysqli->prepare("update story set story_title=(?), story_link=(?), story_content=(?) where story_id=(?)");
        $stmt->bind_param('ssss', $story_title,  $story_link,  $story_content, $story_id);

        if(!$stmt){
            printf("Query Prep Failed: %s\n", $mysqli->error);
            exit;
        }
        if(!$stmt->execute()){
            printf("Execute Failed: %s\n", $mysqli->error);
            exit;
        }

        //$stmt->bind_results($random);
        $stmt->fetch();
        $stmt->close();

        header("location: home.php");
    ?>
</body>
</html>