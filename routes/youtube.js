var fs = require('fs'),
	path = require('path'),
	express = require('express'),
	youtube = express.Router(),
	youtubeNode = require('youtube-node'),
	youtubedl = require('youtube-dl');

youtubeNode.setKey('AIzaSyCnTj3cw6mHYmEayJXExrMwbZ2xhhrDeIA');

youtube.use(function(req, res, next) {
	next();
});

youtube.get('/search/:searchString', function(req, res, next) {
	var queryString = req.params.searchString;

	youtubeNode.search(queryString, 20, function(resultData) {
		res.json(200, resultData);
	});

});

youtube.get('/download/:video_id', function(req, res, next){
	var videoId = req.params.video_id;
	var video = youtubedl(
		'http://www.youtube.com/watch?v=' + videoId,
		['--max-quality=18'],
		{}
	);

	video.on('info', function(info) {
		console.log(info, 'Video Info');
		var outPath = path.join(__dirname, '../files', videoId + '.mp4');

		if(fs.existsSync(outPath)){
			res.json(200, {
				video: 'http://localhost:3000/ytvideo/' + videoId + '.mp4'
			});

			return;
		}

		video.pipe(fs.createWriteStream(outPath));
		video.on('end', function(){
			console.log('file saved', outPath);
			res.json(200, {
				video: 'http://localhost:3000/ytvideo/' + videoId + '.mp4',
				thumb: info.thumbnail
			});
		});
	});
});

module.exports.youtube = youtube;