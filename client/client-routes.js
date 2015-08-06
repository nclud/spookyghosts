Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'loading'
});

Router.route('/', {
	name: 'home',
	template: 'home',
	waitOn: function(){
		return Meteor.subscribe('boorls');
	},
	action: function(){
		this.render()
	}
});