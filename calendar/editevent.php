<?php
    require "database.php";
    header("Content-Type: application/json");
    ini_set("session.cookie_httponly", 1);
    session_start();

    //Because you are posting the data via fetch(), php has to retrieve it elsewhere.
    $json_str = file_get_contents('php://input');
    //This will store the data into an associative array
    $json_obj = json_decode($json_str, true);
    
    $event_id = htmlentities($json_obj['event_id']);
    $date = htmlentities($json_obj['date']);
    $time = htmlentities($json_obj['time']);
    $text = htmlentities($json_obj['text']);

    if($date == "" || $time == "" || $text ==""){
        echo json_encode(array(
            "success" => false,
            "message" => "Missing Event Info"
        ));
        exit;
    }
    if(!hash_equals($_SESSION['token'], $json_obj['token'])){
        die("Request forgery detected");
    }
    $stmt = $mysqli->prepare("update event set title=(?), date=(?), time=(?) where event_id=(?)");
    $stmt->bind_param('ssss', $text,  $date,  $time, $event_id);

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
        "date" => $date,
        "time" => $time,
        "text" => $text,
        "success" => true
    ));
    exit;
?>