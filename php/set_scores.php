{"response":"true"}
<?php
/*
    session_start();

    $username = $_POST["username"];
    $score = (int)$_POST["score"];
    $session_id = (int)$_SESSION["gamesession"];

    $dbUsername = '';
    $dbPassword = '';
    $dbHostname = '';
    $dbName = '';

    $conn = new mysqli($dbHostname, $dbUsername, $dbPassword, $dbName);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    } 
        
    $stmt = $conn->prepare("UPDATE high_score SET username = ?, score = ? WHERE id = ?");
    $stmt->bind_param("sii", $username, $score, $session_id);
    $stmt->execute();

    echo '{"response":"true"}';

    $conn->close();
	*/
?>
