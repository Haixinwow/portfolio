<?php
// login_ajax.php


require 'database.php';
header("Content-Type: application/json");
ini_set("session.cookie_httponly", 1);
session_start();
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

if(!hash_equals($_SESSION['token'], $json_obj['token'])){
	echo json_encode(array(
        "success" => false,
        "message" => "Hash Error"
    ));
    exit;
}

$stmt = $mysqli->prepare("SELECT COUNT(*), user_id, password FROM user WHERE username=?");
if(!$stmt){
    echo json_encode(array(
        "success" => false,
        "message" => "Server Connection Failed"
    ));
    exit;
}
// Bind the parameter
$username = htmlentities($json_obj['username']);

if($username == ""){
    echo json_encode(array(
        "success" => false,
        "message" => "No Username Entered"
    ));
    exit;
}

$stmt->bind_param('s', $username);
$stmt->execute();

// Bind the results
$stmt->bind_result($cnt, $user_id, $pwd_hash);
$stmt->fetch();

$pwd_guess = htmlentities($json_obj['password']);
if($pwd_guess == ""){
    echo json_encode(array(
        "success" => false,
        "message" => "No Password Entered"
    ));
    exit;
}
// Compare the submitted password to the actual password hash

if($cnt == 1 && password_verify($pwd_guess, $pwd_hash)){
    // Login succeeded!
    
    $_SESSION['user_id'] = $user_id;
    $_SESSION['username'] = $username;
    // Redirect to your target page
    echo json_encode(array(
        "success" => true,
        "username" => $username
    ));
    exit;
} else{
    // Login failed; redirect back to the login screen
    echo json_encode(array(
        "success" => false,
        "message" => "Incorrect Username or Password"
    ));
    exit;
}
?>