Template.recent.helpers({
	list: function(){

		return BooRLs.find({}, {
			sort: {
				lastUpdated: -1
			},
			limit: 10
		})

	}
})