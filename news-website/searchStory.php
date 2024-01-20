<!DOCTYPE html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>News</title>
    <link rel="stylesheet" href="home.css"> 
</head>
<body>
    <p class="title">
    <?php
        require "database.php";
        session_start();
        $searchname = $_POST['title_input'];
        $searchquery = '%'. $_POST['title_input'] . '%';
        //help for like statement from: https://stackoverflow.com/questions/59401125/how-do-i-use-the-like-operator-in-sql-with-php-user-input
        $stmt = $mysqli->prepare("select count(*) from story where story_title like (?)");
        if(!$stmt){
            printf("Query Prep Failed: %s\n", $mysqli->error);
            exit;
        }

        $stmt->bind_param("s", $searchquery);
        $stmt->execute();
        $stmt->bind_result($count);
        $stmt->fetch();
        $stmt->close();
        echo "There are " . $count . " stories containing the title " . $searchname;
    ?>
    </p>
    <form action="home.php" method="POST">
        <p>
            <input type="submit" value="Return">
        </p>
    </form>
    
</body>
</html>