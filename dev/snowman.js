var $html = $("html");
var $body = $("body");
var $title = $("#title");
var $snowman_container = $(".snowman-container");
var $slider = $(".slider");
var $snow_front = $("#snow_front");
var $snow_back = $("#snow_back");
var $example = $(".examples li");
	i = 0;


function skyColor() {
	var date = new Date();
	var hour = date.getHours();

	if(hour > 17 || hour < 7) {
		$html.addClass("night");
	}
}

function reload(){
    $html.addClass("prepare-reload").removeClass("go done");

    setTimeout(function(){
	    requestTweets();
    }, 1500);
}



function requestTweets() {
	$snowman_container.append('<div class="loading">Loading<span>.</span><span>.</span><span>.</span></div>');

    $.ajaxSetup({ cache: true });

	var ajax_url = "server/search.php";
    $.getJSON(ajax_url, function(data){

    	$html.removeClass("prepare-reload");
        $snowman_container.scrollLeft(0);
        $(".snowman").remove();

        if(data.statuses.length > 0) {
        		count = 0;
		        $.each(data.statuses, function(i, tweet){
			        count++;
		        	if(count < data.statuses.length){
			            if(tweet.text !== undefined){
			            	parseTweet(tweet);
			            }
					} else {
						// Branches
						completed = 0;
						var $armed = $(".snowman:not(.unarmed)", $slider);

						$.each($armed, function(){
							completed++;

							if(completed < $armed.length) {

								var $canvas = $('<canvas class="branches" width="400" height="240"></canvas>');
								if ($canvas[0].getContext){
									var context = $canvas[0].getContext('2d');
									var context = drawFractalTree(context);
								} else {
									console.log("No support crappy browser");
								}

								$(".branch-holder", this).append($canvas);
							} else {
								$html.addClass("done");
								fastScroll();

								setTimeout(function(){
									// $(".loading").remove();
								}, 1000);
							}
						});
					}
				});
		} else {
			noSnowman();
		}
	});
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
	var csscolors = ['aliceblue','antiquewhite','aqua','azure','beige','bisque','black','blanchedalmond','blue','blueviolet','brown','burlywood','cadetblue','chartreuse','chocolate','coral','cornflowerblue','cornsilk','crimson','cyan','darkblue','darkcyan','darkgoldenrod','darkgray','darkgreen','darkgrey','darkkhaki','darkmagenta','darkolivegreen','darkorange','darkorchid','darkred','darksalmon','darkseagreen','darkslateblue','darkslategray','darkslategrey','darkturquoise','darkviolet','deeppink','deepskyblue','dimgray','dimgrey','dodgerblue','firebrick','floralwhite','forestgreen','fuchsia','gainsboro','ghostwhite','gold','goldenrod','gray','green','greenyellow','grey','honeydew','hotpink','indianred','indigo','ivory','khaki','lavender','lavenderblush','lawngreen','lemonchiffon','lightblue','lightcoral','lightcyan','lightgoldenrodyellow','lightgray','lightgreen','lightgrey','lightpink','lightsalmon','lightseagreen','lightskyblue','lightslategray','lightslategrey','lightsteelblue','lightyellow','lime','limegreen','linen','magenta','maroon','mediumaquamarine','mediumblue','mediumorchid','mediumpurple','mediumseagreen','mediumslateblue','mediumspringgreen','mediumturquoise','mediumvioletred','midnightblue','mintcream','mistyrose','moccasin','navajowhite','navy','oldlace','olive','olivedrab','orange','orangered','orchid','palegoldenrod','palegreen','paleturquoise','palevioletred','papayawhip','peachpuff','peru','pink','plum','powderblue','purple','red','rosybrown','royalblue','saddlebrown','salmon','sandybrown','seagreen','seashell','sienna','silver','skyblue','slateblue','slategray','slategrey','snow','springgreen','steelblue','tan','teal','thistle','tomato','turquoise','violet','wheat','white','whitesmoke','yellow','yellowgreen'];
	var nameRegex = RegExp('^' + csscolors.join('|') + '$');
	// NEED RGB/RGBA REGEX GOES HERE

    var color = string.match(hexRegex)[0] || string.match(nameRegex)[0] || string.match(rgbRegex)[0];

    // Other snowman features
  	if (string.match(/(wink)/)) { recipie.push("wink") }
  	if (string.match(/(scarf)/)) { recipie.push("withscarf") }
  	if (string.match(/(tie)/)) {
  		if (string.match(/(bow)/)) {
  			recipie.push("withbowtie")
  		} else {
	  		recipie.push("withtie")
	  	}
  	}
  	if (string.match(/(hat)/)) { recipie.push("withtophat") }
  	if (string.match(/(cap)/)) { recipie.push("withcap") }
  	if (string.match(/(no arm|no branch|armless|branchless|unarmed)/)) { recipie.push("unarmed") }
  	if (string.match(/(earmuff)/)) { recipie.push("withearmuffs") }
  	if (string.match(/(santa)/)) { recipie.push("santa") }
  	if (string.match(/(occhio|long nose)/)) { recipie.push("pinocchio") }
  	if (string.match(/(teeth)/)) { recipie.push("teeth") }
  	if (string.match(/(tooth)/)) { recipie.push("tooth") }
  	if (string.match(/(happy|smil)/)) { recipie.push("happy") }
  	if (string.match(/(shak|cold|shiver|freez)/)) { recipie.push("shiver") }
  	if (string.match(/(button)/)) {
  		if (string.match(/(zero)/)) { recipie.push("zero-buttons"); }
  		if (string.match(/(one)/)) { recipie.push("one-buttons"); }
  		if (string.match(/(two)/)) { recipie.push("two-buttons"); }
  		if (string.match(/(four)/)) { recipie.push("four-buttons"); }
  	}

    buildSnowman(tweet, recipie, color);
}

function buildSnowman(tweet, recipie, color){
	if(color == null) { var color = "firebrick"; }

	// Hat
	var hat = '';
	if($.inArray("withtophat", recipie) !== -1){
		var hat = '<div class="hat tophat" style="background-color: ' + color + '">'
				+ '<div class="brim" style="background-color: ' + color + '"></div>'
				+ '</div>'
	}
	if($.inArray("santa", recipie) !== -1){
		var hat = '<svg class="santa-back delay" preserveAspectRatio="xMinYMin meet" width="100px" height="90px" viewBox="0 0 100 90" enable-background="new 0 0 100 90" xml:space="preserve"><path fill="' + color + '" d="M29.251,19.053c-2.581-1.259-5.232-1.205-7.682-0.316c-1.365-0.242-2.84,0.203-3.78,1.712C17.62,20.72,17.443,21,17.262,21.285c-1.327,1.114-2.498,2.447-3.454,3.874c-1.793,2.09-3.045,4.79-3.656,7.61c-2.245,5.525-1.119,10.806,1.374,16.259c1.089,2.382,2.544,4.728,3.783,7.142c0.307,4.667-1.206,9.403-2.44,13.83c-0.746,2.679,1.875,5.511,4.654,4.627c1.151-0.366,2.134-0.87,3.001-1.465c1.01-0.104,2.019-0.646,2.791-1.769c1.692-2.461,2.798-5.167,3.912-7.921c0.241-0.596,0.319-1.146,0.274-1.643c1.328-3.532,2.347-7.156,2.785-11.092c0.009-0.084,0.014-0.17,0.022-0.254c1.203-3.846,2.374-7.693,2.937-11.703c0.157-0.243,0.301-0.494,0.43-0.757c0.11-0.14,0.231-0.265,0.334-0.413C38.248,31.575,35.948,22.32,29.251,19.053z"/><ellipse fill="#FFFFFF" cx="11.452" cy="78.836" rx="11.35" ry="11.285"/></svg><svg class="santa-front" preserveAspectRatio="xMinYMin meet" width="100px" height="90px" viewBox="0 0 100 90" enable-background="new 0 0 100 90" xml:space="preserve"><path fill="' + color + '" d="M84.512,9.15c-7.065-5.282-16.863-9.185-25.792-9.021c-5.214,0.096-9.999,3.005-14.305,5.64c-5.678,3.475-10.875,6.319-17.243,8.334c-2.443,0.773-4.927,1.639-7.128,2.944c-0.175,0.101-0.343,0.209-0.504,0.324c-1.07,0.684-2.073,1.471-2.95,2.432c-3.236,3.547-3.943,8.499-4.362,13.077c-0.085,0.926,0.378,1.918,1.083,2.64c-0.002,0.04-0.009,0.079-0.011,0.119c-0.246,4.896,3.896,7.862,8.535,6.884c3.953-0.833,7.336-2.931,10.451-5.388c19.436-0.333,38.351-7.161,57.876-5.007c1.799,0.198,3.043-1.329,3.648-2.762C97.289,21.131,90.68,13.762,84.512,9.15z"/><path fill="#ECE8E7" d="M89.412,22.522c-4.105-0.138-8.197,1.319-11.134,4.013c-4.796-3.385-12.102-3.475-16.608,0.348c-5.484-3.135-12.174-4.221-16.056,0.122c-2.572-1.831-5.479-3.239-8.575-3.5c-4.472-0.377-8.262,2.124-9.947,6.068c-4.049,1.896-5.699,6.129-4.64,10.829c0.287,1.275,1.418,2.274,2.642,2.627c7.225,2.087,13.301-2.671,20.443-2.394c4.364,0.169,7.731-0.501,10.097-3.117c4.967,2.081,11.091,1.523,15.07-2.009c3.222,2.149,6.731,3.799,10.7,3.992c4.157,0.203,7.108-2.318,9.101-5.515c1.568,0.497,3.148,0.953,4.705,1.519c2.459,0.893,4.632-1.373,4.789-3.627C100.429,25.693,94.891,22.706,89.412,22.522z"/></svg>';
	}
	if($.inArray("withcap", recipie) !== -1){
		var hat = '<div class="hat tophat cap" style="background-color: ' + color + '">'
					+ '<div class="pompom">❆</div>'
					+ '<div class="brim" style="background-color: ' + color + '"></div>'
				+ '</div>'
	}

	// Earmuffs
	var earmuffs = '';
	if($.inArray("withearmuffs", recipie) !== -1){
		var earmuffs = '<div class="earmuffs">'
				+ '<div class="muff" style="background-color: ' + color + '"></div>'
				+ '<div class="muff" style="background-color: ' + color + '"></div>'
				+ '</div>'
	}

	// Neckwear
	var neckwear = '';
	if($.inArray("withscarf", recipie) !== -1){
		 var neckwear = '<div class="scarf" style="background-color: ' + color + '">'
      			   + '<div class="overhang delay" style="background-color: ' + color + '"></div>'
    			   + '</div>'
	}
	if($.inArray("withbowtie", recipie) !== -1){
		 var neckwear = '<div class="bowtie tie">'
		 			  	+ '<svg x="0px" y="0px" width="48px" height="28px" preserveAspectRatio="none" viewBox="0 0 35 20" enable-background="new 0 0 35 20" xml:space="preserve"><g><path fill="' + color + '" d="M23.858,10C23.858,10.956,24.553,10,23.858,10L2.335,19.083c-0.695,0-1.258-0.775-1.258-1.73V2.647 c0-0.956,0.563-1.73,1.258-1.73L23.858,10C24.553,10,23.858,9.044,23.858,10L23.858,10z"/><path fill="' + color +'" d="M11.142,10C11.142,9.044,10.447,10,11.142,10l21.523-9.083c0.695,0,1.258,0.775,1.258,1.73v14.706 c0,0.956-0.563,1.73-1.258,1.73L11.142,10C10.447,10,11.142,10.956,11.142,10L11.142,10z"/></g></svg>'
					  	+ '<div class="knot" style="background-color: ' + color + '"></div>'
					  + '</div>'
	}
	if($.inArray("withtie", recipie) !== -1){
		 var neckwear = '<svg class="tie" x="0px" y="0px" width="30px" height="112px" viewBox="0 0 40 150" enable-background="new 0 0 40 150" xml:space="preserve"><g><polygon fill="' + color + '" points="19.491,150 4.331,136.439 9.746,19.491 0,9.746 9.746,0 29.237,0 38.983,9.746 29.237,19.491 34.651,136.439"/></g></svg>';
	}


	var torso = '<div class="snowball torso delay branch-holder">'
			  	+ '<div class="buttons"></div>'
			  + '</div>'
			  + '<div class="bottom snowball delay"></div>';

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

	function parseDate(str) {
		var v=str.split(' ');
		return new Date(Date.parse(v[1]+" "+v[2]+", "+v[5]+" "+v[3]+" UTC"));
	}

    	i++;
    var delay = '-webkit-animation-delay:' + ((i/5) + 1) + 's; animation-delay:' + ((i/5) + 1) + 's';

	var snowman = '<figure class="snowman ' + recipie.join(" ") + '" style="' + delay + '">'
					+ '<div class="behavior">'
					+ '<div class="snowball head delay">'
						+ earmuffs
						+ hat
						+ '<div class="eye left"></div>'
		    			+ '<div class="eye right"></div>'
		    			+ '<div class="nose"></div>'
		    			+ '<div class="mouth"></div>'
		    			+ neckwear
		    		+ '</div>'
	    			+ torso
		    		+ '</div>' // .behavior
		    		+ '<figcaption>'
		    			+ '<a class="profile-link" href="http://twitter.com/#!/' + tweet.user.screen_name + '" rel="external">'
		    				+ '<span>' + tweet.user.screen_name + '</span>'
		    			+ '</a>'
		    			+ '<a class="timestamp" href="http://twitter.com/#!/' + tweet.user.screen_name + '/status/' + tweet.id_str + '" rel="external"><time>' + time + '</time></a>'
					+ '</figcaption>'
				+ '</figure>';

	$slider.append(snowman);
}

function noSnowman(){

	var nobody = 'It appears all the old snowmen have melted and gone away. <a href="#instructions_container">Don\'t be sad, we\'ll still make you one by tweeting to @tweetasnowman</a> &rarr;'

	$("#subtitle").html(nobody);
}

function noSupport(){

	var nosupport = 'Your web browser cannot display snowmen. <a href="http://whatbrowser.org/">Please consider using a better browser and enjoy the season.</a>';

	$("#subtitle").html(nosupport);
}


function drawFractalTree(context){
	drawTree(context, 131, 96, (random(-25,35)+180), 4);
	drawTree(context, 269, 96, -random(-25,45), 4);
}

function drawTree(context, x1, y1, angle, depth){
	var BRANCH_LENGTH = random(7, 10);

	if (depth != 0){
		var x2 = x1 + (cos(angle) * depth * BRANCH_LENGTH);
		var y2 = y1 + (sin(angle) * depth * BRANCH_LENGTH);

		drawLine(context, x1, y1, x2, y2, depth);
		drawTree(context, x2, y2, angle - random(15,20), depth - 1);
		drawTree(context, x2, y2, angle + random(15,20), depth - 1);
	}
}

function drawLine(context, x1, y1, x2, y2, thickness){
	context.fillStyle   = '#000';
	context.strokeStyle = 'rgb(139,126, 102)'; //Brown

	context.lineWidth = thickness;
	context.beginPath();

	context.moveTo(x1,y1);
	context.lineTo(x2, y2);

	context.closePath();
	context.stroke();
}

function cos(angle) { return Math.cos(deg_to_rad(angle)); }
function sin(angle) { return Math.sin(deg_to_rad(angle)); }
function deg_to_rad(angle){ return angle*(Math.PI/180.0); }
function random(min, max){ return min + Math.floor(Math.random()*(max+1-min)); }


function setupExamples(){
	$.each($example, function(){
		var tweetbutton = '<a href="https://twitter.com/intent/tweet/?text=' + encodeURIComponent($(this).text()) + '">t</a>';

		$(this).append(tweetbutton);
	});
}

function fastScroll(){
	var timer;
	$snowman_container.scroll(function(){
	  clearTimeout(timer);

	  if(!$html.hasClass("disable-hover")) {
	    $slider.addClass("disable-hover");
	  }

	  timer = setTimeout(function(){
	    $slider.removeClass("disable-hover");
	  }, 500);
	});
}


$(function(){

	skyColor();

	if(Modernizr.csstransforms && Modernizr.inlinesvg) {
		requestTweets();

		$(".reload").click(reload);
	} else {
		noSupport();
	}


	$(window).load(function(){
		$html.addClass("go");
		setupExamples();
	});
});


