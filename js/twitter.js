twitter = {
	loaded: false,
	user: 'iainmullan',
	key: "14948035-oIz13mxqVuGzU3cI7hbbeDPYSMT9iIzeazjs80bIY",
	term: '',
	search: function(term, clear) {
		this.term = term;
		
		if (clear) {
			$('#tweets').html("");
		}
		console.log("Searching...");
		
		if (term) {
			term = term+'+open.spotify.com';			
		} else {
			term = 'open.spotify.com';
		}
			
		$('#status').html("Searching...");
		
		var url = "http://search.twitter.com/search.json?q="+term+"&rpp=100&include_entities=1&result_type=recent";
		
		$.get(url, function(data) {
			$('#status').html("Search complete.");
			tweets = data.results;
			tweets.reverse();
			$.each(tweets, function(index,tweet){
				
				$.each(tweet.entities.urls, function(index,url) {
					spUrl = url.expanded_url;
					
					if (spUrl.match("open.spotify.com/track")) {
						try {
							track = models.Track.fromURI(spUrl);
							text= track.data.name;
						} catch (err) {
							track = false;
							console.log("bad track url");
						}

						if (track) {
							artists = track.data.artists;
							if (!artists) {
								console.log(track);
								a = "Unknown Artist";
							} else if (artists.length) {
								a = artists[0].name;
							} else {
								a = artists.name;
							}
							
							// a = artists[0];
							// console.log(a);
							li = '<li id="'+tweet.id_str+'">'+
								'<span class="player"></span>' +
								'<span class="user">@'+tweet.from_user+
								'<img width="40" height="40" src="'+tweet.profile_image_url+'" /> '+
								'</span>' +
								'<span class="track">' +
								'<span class="title">'+track.data.name+'</span> '+
								'<span class="artist">by '+a+'</span> '+
								'<span class="tweet-text">'+tweet.text+'</span> '+
								'<span class="tweet-time">'+tweet.created_at+'</span> '+
								'</span>' +
								'</li>';
								
							$('#tweets').prepend(li);
							
							
							/* Create a temporary playlist for the song */
							var playlist = new models.Playlist();
							playlist.add(track);
							var playerView = new views.Player();
							playerView.track = null; // Don't play the track right away
							playerView.context = playlist;
							/* Pass the player HTML code to the #player <div /> */
							$('#'+tweet.id_str+' span.player').append(playerView.node);
							
						}
						
					} else {
//						console.log("bad spotify url: "+spUrl);
					}

				});
				
			});
		});
		
	}

}
