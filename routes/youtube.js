var fs = require('fs'),
	path = require('path'),
	express = require('express'),
	youtube = express.Router(),
	youtubeNode = require('youtube-node'),
	moment = require('moment'),
	ytdl = require('ytdl');

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
	var url = 'http://www.youtube.com/watch?v=' + videoId;
	var fileName = moment().unix() + '_' + videoId + '.mp4';
	var outPath = path.join(__dirname, '../files', fileName);

	var video = ytdl(
		url,
		{
			quality: 'highest',
			filter: function(format) {
				//console.log('format', format);
				return format.container === 'mp4';
			}
		}
	);

	video.on('info', function(info){
		console.log('info', info);

		if(fs.existsSync(outPath)){
			res.json(200, {
				video: 'http://localhost:3000/ytvideo/' + fileName
			});
			return;
		}

		video.pipe(fs.createWriteStream(outPath));
	});

	video.on('end', function(){
		console.log('file saved', outPath);
		res.json(200, {
			video: 'http://localhost:3000/ytvideo/' + fileName
		});
	});
});

module.exports.youtube = youtube;