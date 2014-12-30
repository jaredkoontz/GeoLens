<?php
header("Content-Type: application/text");
$callback = $_GET["callback"];
$message = $_GET["message"] . " you got a response from server yipeee!!!";
$jsonResponse = "{\"message\":\"" . $message . "\"}";
echo $callback . "(" . $jsonResponse . ")";
?>