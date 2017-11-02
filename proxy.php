<?php
    //$feedUrl = $_GET ['feedUrl'];
	$feedUrl = $_GET ['https://tek.westerdals.no/~juvsil14/Oppgave2/StedsnavnMini2.geojson'];
	//$feed_url = 'https://tek.westerdals.no/~juvsil14/Oppgave2/StedsnavnMini2.geojson';
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $feedUrl);
	//curl_setopt($ch, CURLOPT_URL, $xml_feed_url);
    curl_setopt($ch, CURLOPT_HEADER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $xml = curl_exec($ch);
    curl_close($ch);
    echo $xml;
?>
