Template.spookiest.helpers({
	list: function(){

		return BooRLs.find({}, {
			sort: {
				spooks: -1
			},
			limit: 10
		})

	}
})