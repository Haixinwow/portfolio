<?php
require 'database.php';
header("Content-Type: application/json");
ini_set("session.cookie_httponly", 1);
session_start();
$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);

if(!isset($_SESSION['username'])){
    echo json_encode(array(
        "success" => false,
        "message" => "User not logged in"
    ));
    exit;
}
$user_id = $_SESSION['user_id'];


$stmt = $mysqli->query("SELECT * FROM groupevent");
if(!$stmt){
    echo json_encode(array(
        "success" => false,
        "message" => "Query prep failed"
    ));
    exit;
}

while($result = $stmt->fetch_object()){
    $group[] = $result;
}

$groupeventid = array();
foreach($group as $groups){

        $id = $groups->event_id;
        $share_id = $groups->share_id;
        $recipient_id = $groups->recipient_id;
       
        if($user_id == $recipient_id){
            array_push($groupeventid, $id);
        }
}

// $stmt = $mysqli->prepare("SELECT share_id FROM shareevent WHERE recipient_id=?");
    
// if(!$stmt){
//     echo json_encode(array(
//         "success" => false,
//         "message" => "Server Connection Failed 1"
//     ));
//     exit;
// }
// $stmt->bind_param("s", $user_id);
// $stmt->execute();
// $stmt->bind_result($shareentire_id);
// $stmt->fetch();
// $stmt->close();

$stmt = $mysqli->query("SELECT * FROM shareevent");
if(!$stmt){
    echo json_encode(array(
        "success" => false,
        "message" => "Query prep failed"
    ));
    exit;
}

while($result = $stmt->fetch_object()){
    $share[] = $result;
}
$shareeventid = array();
foreach($share as $shares){

        $share_id = $shares->share_id;
        $recipient_id = $shares->recipient_id;
       
        if($user_id == $recipient_id){
            array_push($shareeventid, $share_id);
        }
}

// if(!$stmt->execute()){
//     echo json_encode(array(
//         "success" => false,
//         "message" => "Execution Failed"
//     ));
//     exit;
// }
// $stmt->close();

//query for stories            
$stmt = $mysqli->query("SELECT * FROM event");
if(!$stmt){
    echo json_encode(array(
        "success" => false,
        "message" => "Query prep failed"
    ));
    exit;
}

//add stories to an array
while($result = $stmt->fetch_object()){
    $events[] = $result;
}
$userevent = array();
//display each story
foreach($events as $event){

        $title = $event->title;
        $date = $event->date;
        $time = $event->time;
        $id = $event->event_id;
        $uploader_id = $event->uploader_user_id;
        $tag = $event->tag;
       
        if($user_id == $uploader_id){
            $arraytoadd = array('title' => $title, 'time' => $time, 'date' => $date, 'id'=> $id, 'uploader_id' => $uploader_id, 'tag' => $tag);
            array_push($userevent, $arraytoadd);
        }
        else {
            // echo "test";
            foreach($shareeventid as $target_id){
                if($uploader_id == $target_id){
                    $arraytoadd = array('title' => $title, 'time' => $time, 'date' => $date, 'id'=> $id, 'uploader_id' => $uploader_id, 'tag' => $tag);
                    array_push($userevent, $arraytoadd);
                }
                
            }
            foreach($groupeventid as $target_id){
                if($id == $target_id){
                    $arraytoadd = array('title' => $title, 'time' => $time, 'date' => $date, 'id'=> $id, 'uploader_id' => $uploader_id, 'tag' => $tag);
                    array_push($userevent, $arraytoadd);
                }
                
            }
        }
}

echo json_encode(array(
    "success" => true, 
    "events" => $userevent
));
exit;
?>