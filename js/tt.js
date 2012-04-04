var sp = getSpotifyApi(1),
	models = sp.require("sp://import/scripts/api/models"),
	views = sp.require("sp://import/scripts/api/views"),
	ui = sp.require("sp://import/scripts/ui");
	player = models.player,
	library = models.library,
	application = models.application,
	playerImage = new views.Player();

var currentArtistTwitter = '';

function ttInit() {
}

function getCurrentArtist() {
	var track = sp.trackPlayer.getNowPlayingTrack();
	if (track == null) {
		return null;
	} else {
		return track.track.artists[0].name;
	}
}
function getCurrentTrack() {
	var track = sp.trackPlayer.getNowPlayingTrack();
	if (track == null) {
		return null;
	} else {
		return track.track.name;
	}
}

function now_playing() {
	trackName = getCurrentTrack();
	$('#artist-twitter .track').html(trackName);
	en_twitter_lookup();
}

function en_twitter_lookup() {

	var artistName = getCurrentArtist();
	if (artistName && artistName !== currentArtistTwitter) {
		
		currentArtistTwitter = artistName;
		
		console.log("new twitter artist: "+artistName);

		$('#artist-twitter .name').html(artistName);
		$('#artist-tweets').html('');
		$('#artist-twitter .handle').html('');
	
		var url = 'http://developer.echonest.com/api/v4/artist/profile?api_key=N6E4NIOVYMTHNDM8J&name='+artistName+'&format=json&bucket=id:twitter';

		$.get(url, function(data) {
			if (data.response.artist.foreign_ids) {
				artistHandle = data['response']['artist']['foreign_ids']['0']['foreign_id'];
				bits = artistHandle.split(':');
				artistHandle = bits[2];
				twitterLink = '<a href="http:/twitter.com/'+artistHandle+'">@'+artistHandle+"</a>";
				
				en_twitter_load(artistHandle);
			} else {
				twitterLink = 'Not on Twitter :-(';
			}

			$('#artist-twitter .handle').html(twitterLink);
		});

	} else {
		console.log("same twitter artist: "+artistName);
	}

}

function en_twitter_load(artistHandle) {

	// lookup twitter profile - load name, profile pic, bio etc.
	// fetch recent tweets
	url = "https://api.twitter.com/1/users/lookup.json?screen_name="+artistHandle

	$.get(url, function(data) {
		console.log(data);
		
		// name
		
		// description
		
		// profile_image_url
		
		// load follow button?
	});

	// fetch recent tweets
	url = "https://api.twitter.com/1/statuses/user_timeline.json?include_rts=false&screen_name="+artistHandle+"&count=3"

	$.get(url, function(data) {
		$.each(data, function(index,elem) {
			$('#artist-tweets').append('<li>'+elem.text+'</li>');
		});
	});
	
}

$(document).ready(function() {
	
	$('#refresh').click(function() {
		twitter.search(twitter.term, false);
	});
	
	$('#searches a').click(function() {
		term = $(this).html();
		$('#current-search').html(term);
		twitter.search(term, true);
	});

	$('#search-all').click(function() {
		twitter.search("", true);
	});

	$('#search-form').submit(function() {
		term = $('#search-box').val();
		console.log('search: '+term);
		$('#current-search').html(term);
		twitter.search(term, true);
	});

	now_playing();

  	sp.trackPlayer.addEventListener("playerStateChanged", function (event) {
		console.log(event);
        if (!event.data.curcontext) {
			now_playing();
        }
    });

});
