<?php 

$post_data  = isset($_POST['data']) ? $_POST['data'] : null;
$json_file  = 'characters.json';

$fh = fopen($json_file, 'w');

// fwrite($fh,'<?php $arr='.var_export($_POST['data'],true).'        >');
fwrite($fh, $post_data);
fclose($fh);

echo "success";
die();