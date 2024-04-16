<?php

$maxSize = 2147483648;

$file_name =  $_FILES["file"]["name"];
$tmp_name = $_FILES["file"]["tmp_name"];
$target_dir = dirname(__FILE__) . "/../files/";
$target_file = $target_dir . $file_name;

$ok = 1;

if ($_FILES["file"]["size"] > $maxSize) {
    echo "File too large";
    $ok = 0;
}

if (!move_uploaded_file($tmp_name, $target_file)) {
    echo "Failed moving file", $tmp_name, $target_file;
    $ok = 0;
}

if ($ok == 0) {
    echo "<br>Failed uploading";
} else {
    $output = null;
    $retval = null;
    $f = '"' . htmlspecialchars($target_file, ENT_QUOTES, 'UTF-8') . '"';
    echo "\n" . $f .  "\n\n";
    exec("latexwrapper " . $f . " 2>&1", $output, $retval);
    foreach ($output as $line) {
        echo $line, "\n";
    }
    echo "\nLOG:\n";
    $log = str_replace(".zip", ".log", $f);
    if (file_exists($log)) {
        exec("aha -n -b -f " . $log, $output, $retval);
        foreach ($output as $line) {
            echo $line, "\n";
        }
    } else {
        echo "FAILED";
        exec('echo $PATH', $output, $retval);
        foreach ($output as $line) {
            echo $line, "\n";
        }
    }
}

?>
