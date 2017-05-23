var express = require('express')
var startjs = require('../start.js')
var hashtagfetcher = require('../hashtagfetcher.js')

var router = express.Router();

var hashtagArray = new Array();

router.get("/fetchtweets", function (req, res, next) {
    /*if (typeof (req.query.method) != "string") {
        return res.status(400).send({
            error: "Invalid Method"
        });
    }*/
    var sqlquery = 'SELECT id, tweet FROM tweets WHERE';
    var condition = '';
    
    if(req.query.hashtag != null){
        sqlquery = sqlquery + ' hashtag=' + '\'' +req.query.hashtag+'\'';
        if(hashtagArray.indexOf(req.query.hashtag) == -1){
            hashtagArray.push(req.query.hashtag);
            var hTagbFetcher = new hashtagfetcher(req.query.hashtag, startjs.db);
        }
    }
    else{
        return res.send({error: "No HashTag"});
    }

    if(req.query.maxid != null){
        sqlquery = sqlquery + ' AND id > ' + req.query.maxid;
    }
    
    var tempMaxId = req.query.maxid;
    startjs.db.all(sqlquery, function(err, rows) {
        if(err==null){
            var count = 0;
            var tweetArray = new Array();
            for(var i=0; i< rows.length; ++i) {
                if(tempMaxId != rows[i].id){
                    var jsonObj = new Object();
                    jsonObj.id = rows[i].id;
                    jsonObj.tweet = rows[i].tweet;
                    tweetArray.push(jsonObj);  
                    count++;
                }
                //console.log("Tweet : "+rows[i].maxid, rows[i].hashtag, rows[i].tweet);
            }
            console.log(count + " new tweets from Database");
            var jsonArray = JSON.parse(JSON.stringify(tweetArray));
        
            return res.send(jsonArray);
        }
        else{
            return res.send({error: "While querying DB"});
        }
    });
});

router.post("/", function (req, res, next) {
    if (typeof (req.query.method) != "string") {
        return res.status(400).send({
            error: "Invalid Method"
        });
    }
    switch (req.query.method) {
        case "count": {
            if (typeof (req.body.count) != "number") {
                return res.status(400).send({
                    error: "Invalid data"
                });
            }
            count = req.body.count;
            return res.send({
                count: count
            })
        }
        default: {
            return res.status(400).send({
                error: "Method not found"
            })
        }
    }
});

module.exports = router;