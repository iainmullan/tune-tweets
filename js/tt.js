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

		$('#artist-twitter .artist').html(artistName);
		$('#artist-tweets').html('');
		$('#artist-twitter .handle').html('');
		$('#artist-twitter .profile').hide();

		var url = 'http://developer.echonest.com/api/v4/artist/profile?api_key=OTAVE95YVB2ZFSP2N&name='+artistName+'&format=json&bucket=id:twitter';

		$.get(url, function(data) {
			if (data.response.artist.foreign_ids) {

				$('#artist-twitter .not-on').hide();

				artistHandle = data['response']['artist']['foreign_ids']['0']['foreign_id'];
				bits = artistHandle.split(':');
				artistHandle = bits[2];
				twitterLink = '<a href="http:/twitter.com/'+artistHandle+'">@'+artistHandle+"</a>";

				$('#artist-twitter .handle').html(twitterLink);
				
				en_twitter_load(artistHandle);
			} else {
				$('#artist-twitter .not-on').show();
			}

		});

	} else {
		console.log("same twitter artist: "+artistName);
	}

}

function en_twitter_load(artistHandle) {

	// lookup twitter profile - load name, profile pic, bio etc.
	// fetch recent tweets
	url = "https://api.twitter.com/1/users/lookup.json?screen_name="+artistHandle;

	$.get(url, function(data) {
		data = data[0];
		console.log(data);
		
		// name
//		$('#artist-twitter .profile .name').html(data.name);
		
		// description
		$('#artist-twitter .profile .bio').html(data.description);
//		alert(data.description);

		// profile_image_url
		$('#artist-avatar').attr('src', data.profile_image_url);
		
		$('#artist-twitter .profile').show();
		
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
		now_playing();
    });

});
