/* Parameters
hat ......... : {none} [santa] [tophat]
scarf ....... : {none} [scarf]
height ...... : {tall} [short] [tall]
noselength .. : {normal} [pinnochio]
eyes ,,,,,,,, : {normal} [wink]
color ....... : {Any non-transluscent valid css color}
                Invalid colors:
                    transparent
                    rgba(X,X,X,X)
*/

var $html = $("html");
var $body = $("body");
var $tester = $("#tester");
var $snowman_container = $(".snowman-container");
var $slider = $(".slider");
var $scroll_left = $(".scroller.left");
var $scroll_right = $(".scroller.right");


function skyColor() {
	var date = new Date();
	var hour = date.getHours();

	if(hour > 17 || hour < 7) {
		$html.addClass("night");
	}
}


function requestTweets() {
	console.log("requestTweets();");

    $.ajaxSetup({ cache: true });

	var ajax_url = "server/search.php";
    $.getJSON(ajax_url, function(data){

        $slider.empty();

		var count = 0;
        $.each(data.statuses, function(i, tweet){
        	count++;

        	if(count !== data.statuses.length) {
	            if(tweet.text !== undefined){
	            	console.log(tweet.text);
	        		parseTweet(tweet);
				}
			} else {

				// get width of window
				window_width = $(window).width();
				slider_width = $slider.outerWidth();

				var move = slider_width - window_width;

				if(slider_width > window_width){
					$snowman_container.append('<div id="scroll_left" class="scroller left"></div><div id="scroll_right" class="scroller right"></div>');

					$(window).resize(function() {
						window_width = $(window).width();
						slider_width = $slider.outerWidth();

						var move = slider_width - window_width;

						snowmanScroller(move);
					});

					$html.addClass("overflowed");

					snowmanScroller(move);
				}
			}
		});
	});
}

function snowmanScroller(move) {

	pos = 0;
	function moveRight() {
		if(pos < move) {

			$("#msg").text("moveRight();");

			pos+=10;

			var moveleft = '-' + pos;
			var moveleft = { '-webkit-transform' : 'translate3d(-' + pos + 'px,0,0)',
						 	    '-moz-transform' : 'translate3d(-' + pos + 'px,0,0)',
						 	         'transform' : 'translate3d(-' + pos + 'px,0,0)' }

			$slider.css(moveleft);

			$html.removeClass("maxleft");
		} else {

			$("#msg").text("moveRight(); maxright");

			$html.addClass("maxright");
		}
	}


	function moveLeft() {
		if(pos <= move) {

			$("#msg").text("moveLeft();");

			pos-=10;

			var moveright = { '-webkit-transform' : 'translate3d(-' + pos + 'px,0,0)',
						 	    '-moz-transform' : 'translate3d(-' + pos + 'px,0,0)',
						 	         'transform' : 'translate3d(-' + pos + 'px,0,0)' }

			$slider.css(moveright);
			$html.removeClass("maxright");

		} else {
			$("#msg").text("moveLeft(); maxleft");

			$html.addClass("maxleft");
		}
	}


	$("#scroll_right").hover(
		function(){
			righthovered = setInterval(moveRight, 15);

		}, function(){
            clearInterval(righthovered);
		}
	);

	$("#scroll_left").hover(
		function(){
			lefthovered = setInterval(moveLeft, 15);
		}, function(){
            clearInterval(lefthovered);

		}
	);

}

function parseTweet(tweet) {
	var recipie = [];

	// Remove the twitter handle
	var string = tweet.text.replace("@tweetasnowman ", "");


	// Hex color regex (e.g. #ab3fe1, #010)
	var hexRegex = /(#?([A-Fa-f0-9]){3}(([A-Fa-f0-9]){3})?)/gm;

	// rgb color regex
    var rgbRegex = /rgb\(\s*((?:[0-2]?[0-9])?[0-9])\s*,\s*((?:[0-2]?[0-9])?[0-9])\s*,\s*((?:[0-2]?[0-9])?[0-9])\s*\)$/;


	// CSS color name regex
	var csscolors = ['aliceblue','antiquewhite','aqua','aquamarine','azure','beige','bisque','black','blanchedalmond','blue','blueviolet','brown','burlywood','cadetblue','chartreuse','chocolate','coral','cornflowerblue','cornsilk','crimson','cyan','darkblue','darkcyan','darkgoldenrod','darkgray','darkgreen','darkgrey','darkkhaki','darkmagenta','darkolivegreen','darkorange','darkorchid','darkred','darksalmon','darkseagreen','darkslateblue','darkslategray','darkslategrey','darkturquoise','darkviolet','deeppink','deepskyblue','dimgray','dimgrey','dodgerblue','firebrick','floralwhite','forestgreen','fuchsia','gainsboro','ghostwhite','gold','goldenrod','gray','green','greenyellow','grey','honeydew','hotpink','indianred','indigo','ivory','khaki','lavender','lavenderblush','lawngreen','lemonchiffon','lightblue','lightcoral','lightcyan','lightgoldenrodyellow','lightgray','lightgreen','lightgrey','lightpink','lightsalmon','lightseagreen','lightskyblue','lightslategray','lightslategrey','lightsteelblue','lightyellow','lime','limegreen','linen','magenta','maroon','mediumaquamarine','mediumblue','mediumorchid','mediumpurple','mediumseagreen','mediumslateblue','mediumspringgreen','mediumturquoise','mediumvioletred','midnightblue','mintcream','mistyrose','moccasin','navajowhite','navy','oldlace','olive','olivedrab','orange','orangered','orchid','palegoldenrod','palegreen','paleturquoise','palevioletred','papayawhip','peachpuff','peru','pink','plum','powderblue','purple','red','rosybrown','royalblue','saddlebrown','salmon','sandybrown','seagreen','seashell','sienna','silver','skyblue','slateblue','slategray','slategrey','snow','springgreen','steelblue','tan','teal','thistle','tomato','turquoise','violet','wheat','white','whitesmoke','yellow','yellowgreen'];
	var nameRegex = RegExp('^' + csscolors.join('|') + '$');
	// NEED RGB/RGBA REGEX GOES HERE

    var color = string.match(hexRegex) || string.match(nameRegex) || string.match(rgbRegex);

    // Other snowman features
  	if (string.match(/(wink)/)) { recipie.push("wink") }
  	if (string.match(/(short|little)/)) { recipie.push("short") }
  	if (string.match(/(scarf)/)) { recipie.push("withscarf") }
  	if (string.match(/(hat|lincoln)/)) { recipie.push("tophat") }
  	if (string.match(/(earmuff)/)) { recipie.push("withearmuffs") }
  	if (string.match(/(santa)/)) { recipie.push("santa") }
  	if (string.match(/(pinnochio|long nose)/)) { recipie.push("pinnochio") }
  	if (string.match(/(smile)/)) { recipie.push("smile") }
  	if (string.match(/(shak|cold|shiver|freez)/)) { recipie.push("shiver") }

    buildSnowman(tweet, recipie, color);
}

function buildSnowman(tweet, recipie, color){
	if(color == null) { var color = "firebrick"; }

	// Hat
	var hat = '';
	if($.inArray("tophat", recipie) !== -1){
		var hat = '<div class="hat tophat" style="background-color: ' + color + '">'
				+ '<div class="brim" style="background-color: ' + color + '"></div>'
				+ '</div>'
	}
	if($.inArray("santa", recipie) !== -1){
		var hat = '<svg class="back" preserveAspectRatio="xMinYMin meet" width="100px" height="90px" viewBox="0 0 100 90" enable-background="new 0 0 100 90" xml:space="preserve"><path fill="' + color + '" d="M29.251,19.053c-2.581-1.259-5.232-1.205-7.682-0.316c-1.365-0.242-2.84,0.203-3.78,1.712C17.62,20.72,17.443,21,17.262,21.285c-1.327,1.114-2.498,2.447-3.454,3.874c-1.793,2.09-3.045,4.79-3.656,7.61c-2.245,5.525-1.119,10.806,1.374,16.259c1.089,2.382,2.544,4.728,3.783,7.142c0.307,4.667-1.206,9.403-2.44,13.83c-0.746,2.679,1.875,5.511,4.654,4.627c1.151-0.366,2.134-0.87,3.001-1.465c1.01-0.104,2.019-0.646,2.791-1.769c1.692-2.461,2.798-5.167,3.912-7.921c0.241-0.596,0.319-1.146,0.274-1.643c1.328-3.532,2.347-7.156,2.785-11.092c0.009-0.084,0.014-0.17,0.022-0.254c1.203-3.846,2.374-7.693,2.937-11.703c0.157-0.243,0.301-0.494,0.43-0.757c0.11-0.14,0.231-0.265,0.334-0.413C38.248,31.575,35.948,22.32,29.251,19.053z"/><ellipse fill="#FFFFFF" cx="11.452" cy="78.836" rx="11.35" ry="11.285"/></svg><svg class="front" preserveAspectRatio="xMinYMin meet" width="100px" height="90px" viewBox="0 0 100 90" enable-background="new 0 0 100 90" xml:space="preserve"><path fill="' + color + '" d="M84.512,9.15c-7.065-5.282-16.863-9.185-25.792-9.021c-5.214,0.096-9.999,3.005-14.305,5.64c-5.678,3.475-10.875,6.319-17.243,8.334c-2.443,0.773-4.927,1.639-7.128,2.944c-0.175,0.101-0.343,0.209-0.504,0.324c-1.07,0.684-2.073,1.471-2.95,2.432c-3.236,3.547-3.943,8.499-4.362,13.077c-0.085,0.926,0.378,1.918,1.083,2.64c-0.002,0.04-0.009,0.079-0.011,0.119c-0.246,4.896,3.896,7.862,8.535,6.884c3.953-0.833,7.336-2.931,10.451-5.388c19.436-0.333,38.351-7.161,57.876-5.007c1.799,0.198,3.043-1.329,3.648-2.762C97.289,21.131,90.68,13.762,84.512,9.15z"/><path fill="#ECE8E7" d="M89.412,22.522c-4.105-0.138-8.197,1.319-11.134,4.013c-4.796-3.385-12.102-3.475-16.608,0.348c-5.484-3.135-12.174-4.221-16.056,0.122c-2.572-1.831-5.479-3.239-8.575-3.5c-4.472-0.377-8.262,2.124-9.947,6.068c-4.049,1.896-5.699,6.129-4.64,10.829c0.287,1.275,1.418,2.274,2.642,2.627c7.225,2.087,13.301-2.671,20.443-2.394c4.364,0.169,7.731-0.501,10.097-3.117c4.967,2.081,11.091,1.523,15.07-2.009c3.222,2.149,6.731,3.799,10.7,3.992c4.157,0.203,7.108-2.318,9.101-5.515c1.568,0.497,3.148,0.953,4.705,1.519c2.459,0.893,4.632-1.373,4.789-3.627C100.429,25.693,94.891,22.706,89.412,22.522z"/></svg>';
	}

	// Earmuffs
	var earmuffs = '';
	if($.inArray("withearmuffs", recipie) !== -1){
		var earmuffs = '<div class="earmuffs">'
				+ '<div class="muff" style="background-color: ' + color + '"></div>'
				+ '<div class="muff" style="background-color: ' + color + '"></div>'
				+ '</div>'
	}

	// Scarf
	var scarf = '';
	if($.inArray("withscarf", recipie) !== -1){
		 var scarf = '<div class="scarf" style="background-color: ' + color + '">'
      			   + '<div class="overhang" style="background-color: ' + color + '"></div>'
    			   + '</div>'
	}

	// Torso
	if($.inArray("short", recipie) !== -1){
		var torso = '';
	} else {
		var torso = '<div class="snowball torso"></div>';
	}

	var parsedDate = Date.parse(tweet.created_at);
                    var delta = (Date.parse(Date()) - parsedDate) / 1000;
                    var time = '';
                    if  (delta < 60) {
                      time = delta + ' seconds ago';
                    } else if (delta < 120) {
                      time = 'a minute ago';
                    } else if (delta < (45 * 60)) {
                      time = (parseInt(delta / 60, 10)).toString() + ' minutes ago';
                    } else if (delta < (90 * 60)) {
                      time = 'an hour ago';
                    } else if (delta < (24 * 60 * 60)) {
                      time = '' + (parseInt(delta / 3600, 10)).toString() + ' hours ago';
                    } else if (delta < (48 * 60 * 60)) {
                      time = 'One day ago';
                    } else {
                      time = (parseInt(delta / 86400, 10)).toString() + ' days ago';
                    }

    var twittercard = '<div class="card">'
    				+ ''
    				+ '</div>'

	var snowman = '<figure class="snowman' + ' ' + recipie.join(" ") + '">'
					+ '<div class="behavior">'
					+ '<div class="snowball head">'
						+ earmuffs
						+ hat
						+ '<div class="eye left"></div>'
		    			+ '<div class="eye right"></div>'
		    			+ '<div class="nose"></div>'
		    			+ '<div class="mouth"></div>'
		    			+ scarf
		    		+ '</div>'
	    			+ torso
		    		+ '<div class="bottom snowball"></div>'
		    		+ '</div>' // .behavior
		    		+ '<a class="profile-link" href="http://twitter.com/#!/' + tweet.user.screen_name + '" rel="external">'
		    		+ '@' + tweet.user.screen_name
		    		+ twittercard
		    		+ '</a>'
		    		+ '<a class="timestamp" href="http://twitter.com/#!/' + tweet.user.screen_name + '/status/' + tweet.id_str + '" rel="external">' + time + '</a>'
				+ '</figure>';


	$slider.append(snowman);
}

$(function(){

	$("#nighttoggle").click(function(){
		$html.toggleClass("night");
	});

	skyColor();
	requestTweets();

	/*
	$tester.blur(function(){

		var tweet = $(this).val();

		$(this).val("@snowmanbuilder ");

	});
	*/

	$(window).load(function(){


	})

	$snowman_container.hover(function(){
		$html.addClass("hovering");
	});

});


