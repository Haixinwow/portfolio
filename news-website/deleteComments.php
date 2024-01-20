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

        $comment_id = $_POST['comment_id'];

        $stmt = $mysqli->prepare("delete from comments where comment_id=(?)");
        $stmt->bind_param('i', $comment_id);
        if(!$stmt){
            printf("Query Prep Failed: %s\n", $mysqli->error);
            exit;
        }
        if(!$stmt->execute()){
            printf("Execute Failed: %s\n", $mysqli->error);
            exit;
        }
        $stmt->fetch();
        $stmt->close();

        header("location: home.php");
    ?>
</body>
</html>