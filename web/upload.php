<?php

require "common.php";

$file_name =  $_FILES["file"]["name"];
$tmp_name = $_FILES["file"]["tmp_name"];
$target_file = $target_dir . $file_name;

$ok = 1;

// cleanups
cleanup($target_dir, $maxAge);

// limit size
if ($_FILES["file"]["size"] > $maxSize) {
    echo "File too large";
    $ok = 0;
}

// move to srv dir
if (!move_uploaded_file($tmp_name, $target_file)) {
    echo "Failed moving file '", $tmp_name, "' to '", $target_file, "'";
    $ok = 0;
}

if ($ok == 0) {
    echo "<br>Failed uploading";
    echo "\nLOG:\nFAILED\n";
} else {
    $zip = $target_file;
    $pdf = str_replace(".zip", ".pdf", $zip);
    $log = str_replace(".zip", ".log", $zip);

    if (file_exists($log)) {
        unlink($log);
    }
    if (file_exists($pdf)) {
        unlink($pdf);
    }

    // compile
    $output = null;
    $retval = null;
    exec("export PATH && latexwrapper " . str($zip) . " 2>&1", $output, $retval);
    foreach ($output as $line) {
        echo $line, "\n";
    }

    // get logs
    echo "\nLOG:\n";
    if (file_exists($log)) {
        $output = null;
        $retval = null;
        exec("aha -n -b -f " . str($log), $output, $retval);
        foreach ($output as $line) {
            echo $line, "\n";
        }
    } else {
        echo "FAILED\n";
    }

    // client uses response.split("LOG:")[2] to check if ok
    echo "\nLOG:\n";
    if (file_exists($pdf)) {
        echo "OK\n";
    } else {
        echo "No PDF generated\n";
    }
}

?>
