<?php
// SET VARS FROM REQUEST
$manifestJson = file_get_contents("php://input");
$manifestID = $_REQUEST["id"];
$del = $_REQUEST["del"];

if (!is_dir("res/data")) {
    mkdir("res/data");
}

if ($del == 1) {
    $paths = glob("res/data/*");
    foreach($paths as $file) {
        unlink($file);
    }
    echo "DEL OK";
} else {

    if ($manifestID != NULL) {
        $path = "res/data/".$manifestID.".manifest";
    } else {
        die("NO MANIFEST");
    }
    
    if ($manifestJson == NULL) { // RETRIEVE MANIFEST
        if (file_exists($path)) {
            $file = fopen($path, "r") or die("RETRIEVE FAILED");
            $manifestJson = fread($file, filesize($path));
            fclose($file);
            
            echo $manifestJson;
        } else {
            echo NULL;
        }
    
    } else { // SAVE MANIFEST
        $file = fopen($path, "w") or die("SAVE FAILED");
        fwrite($file, $manifestJson);
        fclose($file);
    
        //echo "SAVE OK";
        echo strlen($manifestJson);
    }

}

?>