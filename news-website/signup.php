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
 
        if(isset($_SESSION['username'])){
            header("location: logoutFirst.html");
            exit;
        }
        $username = $_POST['registernameinput'];

        //check repetition
        $stmt = $mysqli->prepare("select count(*) from user where username=?");
        if(!$stmt){
            printf("Query Prep Failed: %s\n", $mysqli->error);
            exit;
        }
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $stmt->bind_result($count);
        $stmt->fetch();
        $stmt->close();
        if($count >0){
            header("location:duplicateNames.html");
        }

        $password = $_POST['registerpasswordinput'];
        if($password == ""){
            header("location: signupfailure.html");
            exit;
        }
        $password = password_hash($password, PASSWORD_BCRYPT);

        
        $stmt = $mysqli->prepare("insert into user (username, password) values (?, ?)");
        
        $stmt->bind_param('ss', $username, $password);
        if(!$stmt){
            printf("Query Prep Failed: %s\n", $mysqli->error);
            exit;
        }

        $stmt->execute();
        $user_id = $mysqli->insert_id;

        $stmt->close();

        $_SESSION['user_id'] = $user_id;
        $_SESSION['username'] = $username;

        header("location: signupsuccess.html");
    ?>
</body>
</html>