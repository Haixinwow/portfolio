<!DOCTYPE html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>File Sharing</title>
    <link rel="stylesheet" href="fileSharing.css"> 
</head>
    <body>
    <?php
        session_start();
        $userdir = "/srv/uploads/users.txt";
        $users = fopen($userdir, "r");
        $userlist;
        while( !feof($users) ){
            $userlist .= fgets($users);
        }
        //add a space after last entry so all of them have a space after for preg_match
        $userlist .= " ";
        fclose($h);

        $filename = "/srv/uploads/" . $_SESSION['username'] . "/" . $_SESSION['filename'];
        $user = $_POST['userinput'];
        if( !preg_match("/$user\\s/", $userlist)){
            header("Location: sharingFailure.html");
            exit;
        }
    
        if($user == ""){
            header("Location: sharingFailure.html");
            exit;
        }
        
        $destination = "/srv/uploads/" . $user . "/" . $_SESSION['filename'];
        echo $destination;

        if( !copy($filename, $destination) ) { 
            header("Location: copyFailure.html");
        } 
        else { 
            header("Location: copySuccess.html");
        } 

        exit;
    ?>


    </body>
</html>