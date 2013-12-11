<?php
	session_start();
	require_once("twitteroauth-master/twitteroauth/twitteroauth.php"); //Path to twitteroauth library

	$consumerkey = "E4NfBPZAwsMETbITylk1ww";
	$consumersecret = "PSoyC4nOWBH6JbpKoh0DDJcseydTipK0k4gdzsckcw";
	$accesstoken = "242535849-XUB2mgJOzB8ahgfYmiwR0Rlh5PsJ3pMnAJXgW1Ro";
	$accesstokensecret = "UvuPEOpQzqY0FhsBWiF2ABn58RQgaetVtWc0WMTabvzJo";

	function getConnectionWithAccessToken($cons_key, $cons_secret, $oauth_token, $oauth_token_secret) {
	  $connection = new TwitterOAuth($cons_key, $cons_secret, $oauth_token, $oauth_token_secret);
	  return $connection;
	}

	$connection = getConnectionWithAccessToken($consumerkey, $consumersecret, $accesstoken, $accesstokensecret);

	$tweets = $connection->get("https://api.twitter.com/1.1/search/tweets.json?q=to%3Atweetasnowman&src=typd&count=14");

	echo json_encode($tweets);
?>