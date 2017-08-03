// SERVER-SIDE JAVASCRIPT

//require express in our app
var express = require('express');
// generate a new express app and call it 'app'
var app = express();

var db = require('./models');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true}));

// serve static files from public folder
app.use(express.static(__dirname + '/public'));

/************
 * DATABASE *
 ************/

/* hard-coded data */
// var albums = [];
// albums.push({
//               _id: 132,
//               artistName: 'the Old Kanye',
//               name: 'The College Dropout',
//               releaseDate: '2004, February 10',
//               genres: [ 'rap', 'hip hop' ]
//             });
// albums.push({
//               _id: 133,
//               artistName: 'the New Kanye',
//               name: 'The Life of Pablo',
//               releaseDate: '2016, Febraury 14',
//               genres: [ 'hip hop' ]
//             });
// albums.push({
//               _id: 134,
//               artistName: 'the always rude Kanye',
//               name: 'My Beautiful Dark Twisted Fantasy',
//               releaseDate: '2010, November 22',
//               genres: [ 'rap', 'hip hop' ]
//             });
// albums.push({
//               _id: 135,
//               artistName: 'the sweet Kanyessss',
//               name: '808s & Heartbreak',
//               releaseDate: '2008, November 24',
//               genres: [ 'r&b', 'electropop', 'synthpop' ]
//             });



/**********
 * ROUTES *
 **********/

/*
 * HTML Endpoints
 */


app.get('/', function homepage (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


/*
 * JSON API Endpoints
 */

app.get('/api', function api_index (req, res){
  res.json({
    message: "Welcome to tunely!",
    documentation_url: "https://github.com/tgaff/tunely/api.md",
    base_url: "http://tunely.herokuapp.com",
    endpoints: [
      {method: "GET", path: "/api", description: "Describes available endpoints"}
    ]
  });
});

app.get('/api/albums', function album_index(req, res){
  db.Album.find()
  .exec(function(err, albums){
    res.json(albums);
  });
});

app.post('/api/albums', function postThat(req,res) {
    var newArtistName = req.body.artistName;
    var newName = req.body.name;
    var newReleaseDate = req.body.releaseDate;
    var genres = [req.body.genres];
    db.Album.create({
      artistName: newArtistName,
      name: newName,
      releaseDate: newReleaseDate,
      genres: genres } , function (error, album) {
        if(error) {
          return console.log(error);
        }
        album.save();
      });
    res.json(req.body);
});

//posting new song
app.post('/api/albums/:album_id/songs',function postThat(req,res){
  console.log(" new song HIT");
  console.log(req.body);
  var id=req.params.album_id;
  console.log(id);

  db.Album.findById({'_id': id},function(err, foundAlbum){
    if(err){ return console.log(err);}

    foundAlbum.songs.push(
      {name: req.body.name,
      trackNumber: req.body.trackNumber});

    foundAlbum.save(function(err){
      
      res.json(foundAlbum);

      });   
   });
});

//get the new updated album
app.get('/api/albums/:id',function updateAlbum(req,res){
  var id= req.params.id;
  console.log("hit the get route to update");
  db.Album.findById({'_id': id}, function(err,album) {
      console.log('finding that album by Id');
     if(err){console.log(err);}
     res.json(album);
    });
});

/**********
 * SERVER *
 **********/

// listen on port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('Express server is running on http://localhost:3000/');
});
