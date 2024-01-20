<?php
    ini_set("session.cookie_httponly", 1);
    session_start();
    header("Content-Type: application/json");
    $_SESSION['token'] = bin2hex(random_bytes(32));
    if(isset($_SESSION['username'])){
        echo json_encode(array(
            "success" => true,
            "username" => $_SESSION['username'],
            "token" => $_SESSION['token']
        ));
        exit;
    }else{
        echo json_encode(array(
            "success" => false,
            "message" => "Not Logged In",
            "token" => $_SESSION['token']
        ));
        exit;
    }
    
?>