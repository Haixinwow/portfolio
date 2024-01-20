<?php
    require "database.php";
    header("Content-Type: application/json");
    ini_set("session.cookie_httponly", 1);
    session_start();

    $json_str = file_get_contents('php://input');
    $json_obj = json_decode($json_str, true);
    
    $recipient_name = htmlentities($json_obj['recipient_name']);
    $event_id = htmlentities($json_obj['event_id']);
    $user_id = $_SESSION['user_id'];

    if(!isset($_SESSION['username'])){
        echo json_encode(array(
            "success" => false,
            "message" => "User Not Logged In"
        ));
        exit;
    }

    if($recipient_name == ""){
        echo json_encode(array(
            "success" => false,
            "message" => "Missing Recipient Username"
        ));
        exit;
    }

    if(!hash_equals($_SESSION['token'], $json_obj['token'])){
        die("Request forgery detected");
    }
    $stmt = $mysqli->prepare("SELECT user_id FROM user WHERE username=?");
    
    if(!$stmt){
        echo json_encode(array(
            "success" => false,
            "message" => "Server Connection Failed 1"
        ));
        exit;
    }
    $stmt->bind_param("s", $recipient_name);
    $stmt->execute();
    $stmt->bind_result($recipient_id);
    $stmt->fetch();
    $stmt->close();

    $stmt = $mysqli->prepare("insert into groupevent (event_id, share_id, recipient_id) values (?, ?, ?)");
    $stmt->bind_param('sss', $event_id, $user_id, $recipient_id);
    if(!$stmt){
        echo json_encode(array(
            "success" => false,
            "message" => "Server Connection Failed 2"
        ));
        exit;
    } 
    //$stmt->execute();
    if(!$stmt->execute()){
        echo json_encode(array(
            "success" => false,
            "recipient_name" => $recipient_name,
            "recipient_id" => $recipient_id,
            "event_id" => $event_id,
            "message" => "Execution Failed"
        ));
        exit;
    }
   
 

    echo json_encode(array(
        "recipient_name" => $recipient_name,
        "recipient_id" => $recipient_id,
        "event_id" => $event_id,
        "success" => true
    ));
    exit;
?>