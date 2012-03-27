var sp = getSpotifyApi(1),
	models = sp.require("sp://import/scripts/api/models"),
	views = sp.require("sp://import/scripts/api/views"),
	ui = sp.require("sp://import/scripts/ui");
	player = models.player,
	library = models.library,
	application = models.application,
	playerImage = new views.Player();


function ttInit() {
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

});
