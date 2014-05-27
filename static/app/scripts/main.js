var api = 'http://localhost:3000';

var searchFormView = Backbone.View.extend({
	initialize: function(){},
	el: '#youtube-search-wrapper',
	events: {
		'submit form': 'youtubeSearch'
	},
	youtubeSearch: function(ev){
		ev.preventDefault();

		var queryString = this.$el.find('#youtube_query').val();
		if(!queryString) return;

		var searchCollection = new youtubeCollection({queryString: queryString});
		searchCollection.fetch({success: function(){
			console.log('here');
			var resultView = new youtubeCollectionView({collection: searchCollection});
			resultView.render();
		}});
	}
});

var youtubeModel = Backbone.Model.extend({
	initialize: function(){
		//console.log('video', this.toJSON());
	},
	parse: function(videoData){
		videoData._id = videoData.id;
		videoData.id = videoData._id.videoId;

		return videoData;
	}
});

var youtubeCollection = Backbone.Collection.extend({
	model: youtubeModel,
	initialize: function(options){
		if(options.queryString) this.queryString = options.queryString;
	},
	url: function(){
		return api + '/yt/search/' + this.queryString;
	},
	parse: function(result){
		return result.items;
	}
});

var youtubeCollectionView = Backbone.View.extend({
	el: '#youtube-results-wrapper',
	initialize: function(){
		console.log('initialize collection view', this);
	},
	render: function(){
		var self = this;
		_.each(this.collection.models, function(video){
			var videoView = new youtuveModelView({model: video}).render();
			self.$el.append(videoView.$el);
		});

		return this;
	}
});

var youtuveModelView = Backbone.View.extend({
	tagName: 'img',
	className: 'img-thumbnail',
	initialize: function(){

	},
	events: {
		'click': 'download'
	},
	download: function(ev){
		var videoId = this.model.id,
			self = this;

		$.get(api + '/yt/download/' + videoId, function(response){
			var videoUrl = response.video,
				poster = response.thumb;

			$('.video-modal-preview').on('show.bs.modal', function (e) {
				var video = $(e.target).find('#video-preview')[0];
				video.src = videoUrl;
				video.poster = self.model.get('snippet').thumbnails.medium.url;
				$(e.target).find('.video_url').html(videoUrl);
			});

			$('.video-modal-preview').on('hide.bs.modal', function (e) {
				var video = $(e.target).find('#video-preview')[0];
				video.pause();
				video.src = '';
			})

			$('.video-modal-preview').modal('show');
		});
	},
	render: function(){

		this.$el
			.attr('src', this.model.get('snippet').thumbnails.medium.url)
			.attr('data-id', this.model.id);

		return this;
	}
});

$(function(){
	var youtubeSearch = new searchFormView();
})