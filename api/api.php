<?php 
	require_once('TwitterAPIExchange.php');

	header("Access-Control-Allow-Origin: *");
	
	$settings = array(
	    'oauth_access_token' => "49302333-hjrVJatuzWi4Vo1n8HBsizLlJHlpwKNT1AqKNI2y0",
	    'oauth_access_token_secret' => "nH8tpqbP2vbZjfom3P4VndkYOFfIXoUDlif2MT71ZxzjO",
	    'consumer_key' => "r2TxnHT1MKeNVx7eewq0L0pe3",
	    'consumer_secret' => "EDOOQXTsp8Uk2EU0dLuWHq0ZSm34a177eNYi7UayeIJGcL0hQy"
	);

	$max_position = $_GET['max_position'] || 0;
	$is_conversation = $_GET['action'] == 'conversation';
	if ($is_conversation) {
		$url = "https://twitter.com/i/".$_GET['user']."/conversation/".$_GET['tweetId'];
		$getfield = '?include_available_features=1&include_entities=1&max_position='.$_GET['max_position'];
	} else {
		$url = "https://twitter.com/".$_GET['user']."/status/".$_GET['tweetId'];
	}
	$requestMethod = 'GET';
	$twitter = new TwitterAPIExchange($settings);

	if ($is_conversation) {
		echo $twitter->setGetfield($getfield)->buildOauth($url, $requestMethod)->performRequest();
	} else {
		$result = array();
		$result["page"] = $twitter->setGetfield($getfield)->buildOauth($url, $requestMethod)->performRequest();
		echo json_encode($result);
	}
?>
