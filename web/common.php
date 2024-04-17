<?php

$maxSize = 2147483648;
$maxAge = 24*60*60;
$target_dir = dirname(__FILE__) . "/files/";

// cleanups
function cleanup($target_dir, $maxAge) {
    $now = time();
    foreach (glob($target_dir . "*") as $filename) {
        $age = $now - filemtime($filename);
        if ($age > $maxAge) {
            echo "deleted '", $filename, "' (age = ", $age, " > ", $maxAge, ") <br>";
            unlink($filename);
        }
    }
}

// for use in exec
function str($s) {
    return '"' . htmlspecialchars($s, ENT_QUOTES, 'UTF-8') . '"';
}

?>
