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
$username = $_SESSION['username'];

$filename = basename($_FILES['uploadedfile']['name']);
if( !preg_match('/^[\w_\.\-]+$/', $filename) ){
	header("Location: uploadFailure.html");
	exit;
}

$full_path = sprintf("/srv/uploads/%s/%s", $username, $filename);
echo $full_path;
if( move_uploaded_file($_FILES['uploadedfile']['tmp_name'], $full_path) ){
	header("Location: uploadSuccess.html");
	exit;
}else{
	header("Location: uploadFailure.html");
	exit;
}
?>


</body>
</html>