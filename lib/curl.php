<?php

require_once('./simplehtmldom.php');

$url          = $_REQUEST['url'];
$curl_handle  = curl_init();

curl_setopt($curl_handle, CURLOPT_URL, $url);
curl_setopt($curl_handle, CURLOPT_CONNECTTIMEOUT, 2);
curl_setopt($curl_handle, CURLOPT_SSL_VERIFYPEER, FALSE);
curl_setopt($curl_handle, CURLOPT_RETURNTRANSFER, 1);
// curl_setopt($curl_handle, CURLOPT_COOKIEJAR, $cookie_file_path);
// curl_setopt($curl_handle, CURLOPT_COOKIEFILE, $cookie_file_path);
//curl_setopt($curl_handle, CURLOPT_POST, 1);
//curl_setopt($curl_handle, CURLOPT_POSTFIELDS, $post);

$buffer = curl_exec($curl_handle);

curl_close($curl_handle);

if (empty($buffer)) {
  echo 'Something went wrong :(';
} else {
  echo $buffer;
}


// $html = file_get_html('https://www.google.com/');

// foreach( $html->find('img') as $element ) {
//   echo $element;
// }

// echo $html;