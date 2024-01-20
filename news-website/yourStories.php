<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>News</title>
    <link rel="stylesheet" href="home.css"> 
</head>
<body>
    <div class="header">
        <div class="headerLeft">
            <a href="home.php">News</a>
        </div>
        <div class="headerRight">
            <a href="usersignup.html">Register</a>
            <a href="userlogin.html">Login</a>
            <a href="logout.php">Log Out</a>

        </div>
    </div>
    <div class = "stories">
        <div class = "storyTitle">
            <?php
                session_start();
                if(!isset($_SESSION['username'])){
                    echo "Not Logged In";
                }else{
                    echo $_SESSION['username']."'s Stories";
                        
                }
            ?>
        </div>
        <br><br>
        <div class = "storiesLeft">
        <?php 
                require 'database.php';
                
                $user_id = $_SESSION['user_id'];

                //query for stories            
                $stmt = $mysqli->query("SELECT * FROM story");
                if(!$stmt){
                    printf("Query Prep Failed: %s\n", $mysqli->error);
                    exit;
                }

                //add stories to an array
                while($result = $stmt->fetch_object()){
                    $stories[] = $result;
                }
                //display even nums on left, odd on right
                $count = 0;
                //display each story
                foreach($stories as $story){
                    if($count % 2 == 0){
                    
                        $title = $story->story_title;
                        $username = $story->uploader_username;
                        $content = $story->story_content;
                        $link = $story->story_link;
                        $id = $story->story_id;
                        $uploader_id = $story->uploader_user_id;
                        if($user_id != $uploader_id){
                            continue;
                        }
                        //if there is a link, show it, else dont
                        if($link){
                            printf ("<div class = 'story'>
                                        <div class = 'storyTitle'>
                                            %s
                                        </div>
                                        <div class = 'author'>
                                            %s%s
                                        </div>
                                        <div class = 'content'>
                                            %s
                                        </div>
                                        <div class = 'link'>
                                            <a href='%s'>%s</a>
                                        </div>
                                ",$title, 'By: ', $username, $content, $link, $link);
                        }else{
                            printf ("<div class = 'story'>
                                        <div class = 'storyTitle'>
                                            %s
                                        </div>
                                        <div class = 'author'>
                                            By: %s
                                        </div>
                                        <div class = 'content'>
                                            %s
                                        </div>                          
                                
                                ",$title, $username, $content);
                        }

                        if($uploader_id == $user_id){
                            printf("
                                <form action='deleteStory.php' method='POST'>
                                    <button type='submit' name='story_id' value = '%s'>
                                        Delete Story
                                    </button>
                                </form>
                                <form action='editStoryPage.php' method='POST'>
                                    <button type='submit' value = '%s' name='story_id'>
                                        Edit Story
                                    </button>
                                </form>
                                ", $id, $id);
                        }
                        //comments section
                        $stmt = $mysqli->query("SELECT * FROM comments");
                        if(!$stmt){
                            printf("Query Prep Failed: %s\n", $mysqli->error);
                            exit;
                        }

                        //add comments to an array
                        while($result = $stmt->fetch_object()){
                            $comments[] = $result;
                        }

                        echo "<div class = 'comments'><div class = 'commentsTitle'>Comments</div>";
                        printf("<form action='writeComments.php' method='POST'>
                                    <button type='submit' name = 'story_id' value = '%s'>
                                        Write a Comment
                                    </button>
                                </form>
                                ", $id); 
                        foreach($comments as $comment){
                            
                            $comment_story_id = $comment->comment_story_id;  
                            //check if the the comment is under the same id as the story
                            if($comment_story_id == $id){
                                $comment_id = $comment->comment_id;
                                $comment_username = $comment->comment_username;
                                $comment_content = $comment->comment_content;
                                $comment_uploader_id = $comment->comment_user_id;
                                printf("<div class = 'comment'>
                                            <div class = 'author'>
                                                By: %s
                                            </div>
                                            <div class = 'commentContent'>
                                                %s
                                            </div>
                                        </div>
                                        
                                        ",$comment_username, $comment_content);
                                if($comment_uploader_id == $user_id){
                                    printf("
                                        <form action='deleteComments.php' method='POST'>
                                            <button type='submit' name='comment_id' value = '%s'>
                                                Delete Comment
                                            </button>
                                        </form>
                                        <form action='editComment.php' method='POST'>
                                            <button type='submit' name='comment_id' value = '%s'>
                                                Edit Comment
                                            </button>
                                        </form>
                                        ", $comment_id, $comment_id);
                                }         
                            }  
                        } 
                        echo "</div></div>";
                    }
                    $count++;
                }          
            ?>
        </div> 
        
        <div class = "storiesRight">
            <?php 
                require 'database.php';
                
                $user_id = $_SESSION['user_id'];

                //query for stories            
                $stmt = $mysqli->query("SELECT * FROM story");
                if(!$stmt){
                    printf("Query Prep Failed: %s\n", $mysqli->error);
                    exit;
                }

                //add stories to an array
                while($result = $stmt->fetch_object()){
                    $stories2[] = $result;
                }
                //display even nums on left, odd on right
                $count = 0;
                //display each story
                foreach($stories2 as $story){
                    if($count % 2 != 0){
                    
                        $title = $story->story_title;
                        $username = $story->uploader_username;
                        $content = $story->story_content;
                        $link = $story->story_link;
                        $id = $story->story_id;
                        $uploader_id = $story->uploader_user_id;
                        if($user_id != $uploader_id){
                            continue;
                        }
                        //if there is a link, show it, else dont
                        if($link){
                            printf ("<div class = 'story'>
                                        <div class = 'storyTitle'>
                                            %s
                                        </div>
                                        <div class = 'author'>
                                            %s%s
                                        </div>
                                        <div class = 'content'>
                                            %s
                                        </div>
                                        <div class = 'link'>
                                            <a href='%s'>%s</a>
                                        </div>
                                ",$title, 'By: ', $username, $content, $link, $link);
                        }else{
                            printf ("<div class = 'story'>
                                        <div class = 'storyTitle'>
                                            %s
                                        </div>
                                        <div class = 'author'>
                                            By: %s
                                        </div>
                                        <div class = 'content'>
                                            %s
                                        </div>                          
                                
                                ",$title, $username, $content);
                        }

                        if($uploader_id == $user_id){
                            printf("
                                <form action='deleteStory.php' method='POST'>
                                    <button type='submit' name='story_id' value = '%s'>
                                        Delete Story
                                    </button>
                                </form>
                                <form action='editStoryPage.php' method='POST'>
                                    <button type='submit' value = '%s' name='story_id'>
                                        Edit Story
                                    </button>
                                </form>
                                ", $id, $id);
                        }
                        //comments section
                        $stmt = $mysqli->query("SELECT * FROM comments");
                        if(!$stmt){
                            printf("Query Prep Failed: %s\n", $mysqli->error);
                            exit;
                        }


                        //add comments to an array
                        while($result = $stmt->fetch_object()){
                            $comments[] = $result;
                        }

                        echo "<div class = 'comments'><div class = 'commentsTitle'>Comments</div>";
                        printf("<form action='writeComments.php' method='POST'>
                                    <button type='submit' name = 'story_id' value = '%s'>
                                        Write a Comment
                                    </button>
                                </form>
                                ", $id); 
                        foreach($comments as $comment){
                            
                            $comment_story_id = $comment->comment_story_id;  
                            //check if the the comment is under the same id as the story
                            if($comment_story_id == $id){
                                $comment_id = $comment->comment_id;
                                $comment_username = $comment->comment_username;
                                $comment_content = $comment->comment_content;
                                $comment_uploader_id = $comment->comment_user_id;
                                printf("<div class = 'comment'>
                                            <div class = 'author'>
                                                By: %s
                                            </div>
                                            <div class = 'commentContent'>
                                                %s
                                            </div>
                                        </div>
                                        
                                        ",$comment_username, $comment_content);
                                if($comment_uploader_id == $user_id){
                                    printf("
                                        <form action='deleteComment.php' method='POST'>
                                            <button type='submit' name='comment_id' value = '%s'>
                                                Delete Comment
                                            </button>
                                        </form>
                                        <form action='editComment.php' method='POST'>
                                            <button type='submit' name='comment_id' value = '%s'>
                                                Edit Comment
                                            </button>
                                        </form>
                                        ", $comment_id, $comment_id);
                                }         
                            }  
                        } 
                        echo "</div></div>";
                    }
                    $count++;
                }
                
            ?>
        </div>
    </div>
</body>
