

$(document).ready(function() {
	setTimeout(timercallback, 3000)
}); 

var maxid = 0;
var hashTag = '';

timercallback = function() {
    loadLatestTweet();
    setTimeout(timercallback, 3000);
}

//Twitter Parsers
String.prototype.parseURL = function() {
	return this.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&~\?\/.=]+/g, function(url) {
		return url.link(url);
	});
};
String.prototype.parseUsername = function() {
	return this.replace(/[@]+[A-Za-z0-9-_]+/g, function(u) {
		var username = u.replace("@","")
		return u.link("http://twitter.com/"+username);
	});
};
String.prototype.parseHashtag = function() {
	return this.replace(/[#]+[A-Za-z0-9-_]+/g, function(t) {
		var tag = t.replace("#","%23")
		return t.link("http://search.twitter.com/search?q="+tag);
	});
};
function parseDate(str) {
    var v=str.split(' ');
    return new Date(Date.parse(v[1]+" "+v[2]+", "+v[5]+" "+v[3]+" UTC"));
} 

function loadLatestTweet(){
    if(hashTag === '') return;
	var numTweets = 1;
    var orgin = document.location.origin;
    var _url = orgin + '/api/v1/fetchtweets?maxid='+maxid+'&hashtag='+encodeURIComponent(hashTag);
    $.getJSON(_url,function(data){
    for(var i = data.length-1; i>=0; i--){
            var tweet = data[i].tweet;
            if(maxid<data[i].id) maxid = data[i].id;
            tweet = tweet.parseURL().parseUsername().parseHashtag();
            tweet += '<div class="tweeter-info"></div>'
            $("#twitter-feed").prepend('<p>'+tweet+'</p>');
        }
    });
}

function submitHashTag(){
    var element = document.getElementById('hashtag');
    var htag = element.value;
    if(htag.length>0 && htag[0]!='#') htag = '#' + htag;
    if(htag != hashTag){
        hashTag = htag;
        $( "p" ).remove();
        loadLatestTweet();
    }

}