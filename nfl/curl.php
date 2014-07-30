<?php

$url          = $_REQUEST['url'];
$curl_handle  = curl_init();

curl_setopt($curl_handle, CURLOPT_URL, $url);
curl_setopt($curl_handle, CURLOPT_CONNECTTIMEOUT, 2);
curl_setopt($curl_handle, CURLOPT_SSL_VERIFYPEER, FALSE);
curl_setopt($curl_handle, CURLOPT_RETURNTRANSFER, 1);

$buffer = curl_exec($curl_handle);

curl_close($curl_handle);

if (empty($buffer)) {
  echo 'Error.';
} else {
  echo $buffer;
}