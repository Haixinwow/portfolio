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
        $filename = "/srv/uploads/" . $_SESSION['username'] . "/" . $_SESSION['filename'];
        unlink($filename);
        unset($_SESSION['filename']);
        header("Location: fileSharing.php");
        exit;
    ?>


    </body>
</html>