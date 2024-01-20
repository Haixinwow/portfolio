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
            if(!isset($_SESSION['filename'])){
                header("Location: fileSharing.php");
            }
            $filename = $_SESSION['filename']; 
            $username = $_SESSION['username'];
            echo $filename;
            echo "test";
            echo $username;
            if( !preg_match('/^[\w_\-]+$/', $username) ){
                echo "Invalid username";
                exit;
            }
            
            $full_path = sprintf("/srv/uploads/%s/%s", $username, $filename);$finfo = new finfo(FILEINFO_MIME_TYPE);
            $mime = $finfo->file($full_path);
            
            header("Content-Type: ".$mime);
            header('content-disposition: inline; filename="'.$filename.'";');
            ob_clean();
            readFile($full_path);
            exit;    
        ?>
    </body>
</html>