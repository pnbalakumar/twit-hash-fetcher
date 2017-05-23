var Twitter = require('twitter');

class hashtagfetcher
{
  constructor(htag, db){
    this.twitterclient = new Twitter({
      consumer_key: '<YOUR KEY>',
      consumer_secret: '<YOUR KEY>',
      access_token_key: '<YOUR KEY>',
      access_token_secret: '<YOUR KEY>'
    });

    this.hastag = htag;
    this.enchastag = encodeURIComponent(htag);
    this.dbClient = db;
    this.sinceId = 0;
    this.timerId = setTimeout(this.fetchTweet.bind(this), 1);
  }

  fetchTweet(){
    this.getNewTweet();
    clearTimeout(this.timerId); //If function gets called manually stop and start to avoid quick calls
    this.timerId = setTimeout(this.fetchTweet.bind(this), 30000);
  }
  
  getNewTweet(){
    
    var searchquery = 'search/tweets.json?q=' + this.enchastag;
    if(this.sinceId == 0){
        searchquery = searchquery + '&result_type=recent&count=20';
    }else{
        searchquery = searchquery + '&since_id=' + this.sinceId;
    }
    this.twitterclient.get(searchquery, function(error, tweets, response) {
        if (!error) {
          var stmt = this.dbClient.prepare("INSERT OR IGNORE INTO tweets VALUES (?,?,?)");
          console.log(tweets.statuses.length + ' new Tweets for ' + this.hastag + ' from twitter');  
          for(var i = 0; i< tweets.statuses.length; i++){
            var tweetid = tweets.statuses[i].id;
            if(this.sinceId < tweetid) this.sinceId = tweetid;
            stmt.run(tweetid, this.hastag, tweets.statuses[i].text);
          }  
          stmt.finalize();
          if(tweets.search_metadata.next_results!=null){//More tweets to fetch
            this.fetchTweet();
          }
        }
        else{
          console.log('Error fetching tweets');
        }
    }.bind(this));
  }
}

module.exports = hashtagfetcher;