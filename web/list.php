<?php

require "common.php";

cleanup($target_dir, $maxAge);

$output = null;
$retval = null;
exec("find " . str($target_dir) .
     " -maxdepth 1 -name '*.pdf' -exec basename {} \;", $output, $retval);
foreach ($output as $line) {
    echo $line, "\n";
}

?>
