{"results":[]}
<?php
    /*
    $dbUsername = '';
    $dbPassword = '';
    $dbHostname = '';
    $dbName = '';

    $conn = new mysqli($dbHostname, $dbUsername, $dbPassword, $dbName);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    } 

    $result = mysqli_query($conn,"SELECT * FROM high_score ORDER BY score DESC LIMIT 10");

    $response = '{"results":[';

    $row = mysqli_fetch_assoc($result);

    while($row){
        $response .= '{"username":"'.$row['username'].'","score":"'.$row['score'].'"},';
        $row = mysqli_fetch_assoc($result);
    }
    
    if($result->num_rows > 0){
        $response = substr($response,0,-1);
    }

    $response .= ']}';

    echo $response;

    $conn->close();
	*/
?>

