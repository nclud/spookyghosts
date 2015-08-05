BooRLs = new Meteor.Collection('boorls');

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
		]

	}

	only the ten most recent ghosts are kept in the db


*/