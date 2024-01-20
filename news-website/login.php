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
        require 'database.php';
        session_start();

        
        $stmt = $mysqli->prepare("SELECT COUNT(*), user_id, password FROM user WHERE username=?");

        // Bind the parameter
        $user = $_POST['usernameinput'];
        $stmt->bind_param('s', $user);
        $stmt->execute();

        // Bind the results
        $stmt->bind_result($cnt, $user_id, $pwd_hash);
        $stmt->fetch();
        
        $pwd_guess = $_POST['passwordinput'];
        // Compare the submitted password to the actual password hash
        
        if($cnt == 1 && password_verify($pwd_guess, $pwd_hash)){
            // Login succeeded!
            $_SESSION['user_id'] = $user_id;
            $_SESSION['username'] = $user;
            // Redirect to your target page
            header("location: loginsuccess.html");
            exit();
        } else{
            echo "<br>";
            echo $cnt . " " . $user . " " . $pwd_hash . " " . $pwd_guess;
            // Login failed; redirect back to the login screen
            header("location: loginfailure.html");
            exit();
        }

    ?>


</body>
</html>