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

    if(!isset($_SESSION['username'])){
        $username = $_POST['usernameinput'];

        // Get the username and make sure it is valid (checks username with a space after since userlist is in that format)
        if( !preg_match("/$username\\s/", $userlist)){
            header("location: loginFailure.html");
            exit;
        }
    
        if($username == ""){
            header("location: loginFailure.html");
            exit;
        }

        $_SESSION['username'] = $username;
    }else{
        $username = $_SESSION['username'];
    }
    
?>

<p class = "title">File Sharing</p>

<div class = "panels">
    <div class = "column leftPanel">  
        <form enctype="multipart/form-data" action="fileUploading.php" method="POST">
            <p>
                <input type="hidden" name="MAX_FILE_SIZE" value="20000000" />
                <label for="uploadfile_input" class = "titleSmall">Choose a File to Upload:</label><br><br><input name="uploadedfile" type="file" id="uploadfile_input" class = "file"/>
            </p>
            <p>
                <input type="submit" value="Upload File" class = "file"/>
            </p>
        </form>
    </div>

    <div class = "column midPanel"> 
        <p class = "titleSmall"> Your Files </p>   
            <!-- display files -->
            <?php           
                $dir = "/srv/uploads/" .  $_SESSION['username'];

                $array = scandir($dir);

                $mystring = "";

                $action = "setFile.php";
                $method = "POST";
                //create a form to set the file to display info and such on the right
                echo "<form action=\"setFile.php\" method=\"POST\">";
                    foreach($array as $key => $value){
                        if($value !== ".." && $value !== "."){
                            //create a button for the post
                            echo "<button type=\"submit\" name=\"filename\" value=". $value ." class=\"fileLink file\">" . $value . "</button><br>";
                        }        
                    }
                echo "</form>"   
            ?>
        </p>
    </div>

    <div class = "column rightPanel"> 
        <p class = "titleSmall"> File Info </p>  
        
        <?php
            if(!isset($_SESSION['filename'])){
                echo "<p class = \"file\"> Select a File to View More Info </p>";
            }else{
                
                $filename = $_SESSION['filename'];
                $dir = "/srv/uploads/" .  $username . "/" . $filename;
                //name: (from: https://www.php.net/manual/en/function.pathinfo.php)
                $path_parts = pathinfo($dir);
                echo "<div class = \"file\"> <b>Name: </b>" . $path_parts['filename'] . "</div>";
                //type: (from: https://www.php.net/manual/en/function.pathinfo.php)
                echo "<div class = \"file\"> <b>Type: </b>" . $path_parts['extension'] . "</div>";
                //size
                echo "<div class = \"file\"> <b>Size: </b>" . filesize($dir) . " bytes </div>";
                //file time: (from:https://www.php.net/manual/en/function.filemtime.php) 
                echo "<div class = \"file\"> <b>Last Modified: </b>" . date("F d Y H:i:s.", filemtime($dir)) . " </div>";
            }
        ?>
        <form action="openFile.php" method="POST" class = "file">
            <input class = "file" type="submit" value="Open File">
        </form>
        
        <form action="fileDelete.php" method="POST" class = "file">
            <input type="submit" value="Delete File" class = "file">
        </form>

        <form action="fileShare.php" method="POST" class = "file">
            <input type="text" name="userinput" id="userinput" placeholder ="Enter User to Share With">
            <input type="submit" value="Share File" class = "file">
        </form>
    </div>
</div>

<form action="logOut.php" method="POST">
    <p>
        <input type="submit" value="Log Out" />
    </p>
</form>


</body>
</html>