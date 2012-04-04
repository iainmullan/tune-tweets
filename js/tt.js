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
		alert(null);
		return null;
	} else {
		return track.track.artists[0].name;
	}
}

function en_twitter_lookup() {

	var artistName = getCurrentArtist();
	if (artistName && artistName !== currentArtistTwitter) {
		
		$('#artist-twitter .name').html(artistName);
	
		var url = 'http://developer.echonest.com/api/v4/artist/profile?api_key=N6E4NIOVYMTHNDM8J&name='+artistName+'&format=json&bucket=id:twitter';

		$.get(url, function(data) {
			console.log(data);
			if (data.response.artist.foreign_ids) {
				artistHandle = data['response']['artist']['foreign_ids']['0']['foreign_id'];
				bits = artistHandle.split(':');
				artistHandle = bits[2];
				twitterLink = '<a href="http:/twitter.com/'+artistHandle+'">@'+artistHandle+"</a>";
				en_twitter_tweets(artistHandle);
			} else {
				twitterLink = 'Not on Twitter!';
			}

			$('#artist-twitter .handle').html(artistHandle);
		});
	
	}

}

function en_twitter_tweets(artistHandle) {
	// fetch recent tweets
	url = "https://api.twitter.com/1/statuses/user_timeline.json?include_rts=true&screen_name="+artistHandle+"&count=3"

	$.get(url, function(data) {
		console.log(data);
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


	en_twitter_lookup();

  	sp.trackPlayer.addEventListener("playerStateChanged", function (event) {
		console.log(event);
        if (!event.data.curcontext) {
			en_twitter_lookup();
        }
    });

});
