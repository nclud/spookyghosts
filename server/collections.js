BooRLs = new Meteor.Collection('boorls');

/*Schema


	{

		url: [String url],
		ghosts: [
			{
				ghostId: (int ghostId),
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