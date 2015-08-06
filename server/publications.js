BooRLs.allow({

	insert: function(){
		return false;
	},
	update: function(){
		return false;
	},
	remove: function(){
		return false;
	}

});

Meteor.publish('boorls', function(){
	return BooRLs.find({});
})

/*Schema


	{

		url: [String url],
		ghosts: [
			{
				ghostSrc: (String ghostSrc),
				position: {
					x: (int xPercentage),
					y: (int yPercentage)
				},
				timeStamp: (timestamp)
			}, ...
		],
		spooks: 0,
		lastUpdated: [timestamp]

	}

	only the ten most recent ghosts are kept in the db


*/