<?php
// login_ajax.php
require "database.php";
header("Content-Type: application/json");
ini_set("session.cookie_httponly", 1);
session_start();

//Because you are posting the data via fetch(), php has to retrieve it elsewhere.
$json_str = file_get_contents('php://input');
//This will store the data into an associative array
$json_obj = json_decode($json_str, true);

if(isset($_SESSION['username'])){
    echo json_encode(array(
        "success" => false,
        "message" => "User Already Logged In"
    ));
    exit;
}
$username = htmlentities($json_obj['username']);

if($username == ""){
    echo json_encode(array(
        "success" => false,
        "message" => "No Username Entered"
    ));
    exit;
}

//check repetition
$stmt = $mysqli->prepare("select count(*) from user where username=?");
if(!$stmt){
    echo json_encode(array(
        "success" => false,
        "message" => "Server Connection Failed"
    ));
    exit;
}
$stmt->bind_param("s", $username);
$stmt->execute();
$stmt->bind_result($count);
$stmt->fetch();
$stmt->close();

$password = htmlentities($json_obj['password']);
if($password == ""){
    echo json_encode(array(
        "success" => false,
        "message" => "Password Not Entered"
    ));
    exit;
}

if($count > 0){
    echo json_encode(array(
        "success" => false,
        "message" => "Repeat Username"
    ));
    exit;
}

$password = password_hash($password, PASSWORD_BCRYPT);

if(!hash_equals($_SESSION['token'], $json_obj['token'])){
	die("Request forgery detected");
}
$stmt = $mysqli->prepare("insert into user (username, password) values (?, ?)");

$stmt->bind_param('ss', $username, $password);
if(!$stmt){
    echo json_encode(array(
        "success" => false,
        "message" => "Server Connection Failed"
    ));
    exit;
}

$stmt->execute();
$user_id = $mysqli->insert_id;

$stmt->close();

$_SESSION['user_id'] = $user_id;
$_SESSION['username'] = $username;
//$_SESSION['token'] = bin2hex(openssl_random_pseudo_bytes(32));
//return success
echo json_encode(array(
    "username" => $username,
    "success" => true
));
exit;
?>