<?php
    require "database.php";
    header("Content-Type: application/json");
    ini_set("session.cookie_httponly", 1);
    session_start();
    //Because you are posting the data via fetch(), php has to retrieve it elsewhere.
    $json_str = file_get_contents('php://input');
    //This will store the data into an associative array
    $json_obj = json_decode($json_str, true);
    
    // $username = $_SESSION['username'];
    $event_id = $json_obj['event_id'];
    $stmt = $mysqli->prepare("delete from event where event_id=(?)");
    $stmt->bind_param('s', $event_id);
   
    if(!$stmt){
        echo json_encode(array(
               "success" => false,
               "message" => "Server Connection Failed"
           ));
       exit;
   }
   if(!$stmt->execute()){
       echo json_encode(array(
           "success" => false,
           "message" => "Execution Failed"
       ));
       exit;
   }

    $stmt->fetch();
    $stmt->close();

    echo json_encode(array(
        "success" => true,
        "message" => "Event Deleted"
    ));
    exit;
?>