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
        if(!isset($_SESSION['username'])){
            echo json_encode(array(
                "success" => false,
                "message" => "User Not Logged In"
            ));
            exit;
        }
        $date = htmlentities($json_obj['date']);
        $time = htmlentities($json_obj['time']);
        $text = htmlentities($json_obj['text']);
        $tag = htmlentities($json_obj['tag']);

        if($date == "" || $time == "" || $text ==""){
            echo json_encode(array(
                "success" => false,
                "message" => "Missing Event Info"
            ));
            exit;
        }

        $user_id = $_SESSION['user_id'];
        if(!hash_equals($_SESSION['token'], $json_obj['token'])){
            die("Request forgery detected");
        }

        if($tag != "Reminders" && $tag != "Tasks" && $tag != "Birthdays" && $tag != "Classes"){
            $tag = "Default";
        }

        $stmt = $mysqli->prepare("insert into event (uploader_user_id, title, date, time, tag) values (?, ?, ?, ?, ?)");
        $stmt->bind_param('sssss', $user_id, $text, $date, $time, $tag);
        if(!$stmt){
            echo json_encode(array(
                "success" => false,
                "message" => "Server Connection Failed"
            ));
            exit;
        }
        $stmt->execute();
        $stmt->close();



        echo json_encode(array(
            "date" => $date,
            "time" => $time,
            "text" => $text,
            "tag" => $tag,
            "success" => true
        ));
        exit;
?>