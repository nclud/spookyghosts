var maxUrlLength = 50;

Template.resultList.helpers({
	format: function(string){
		string = string.replace(/https?:\/\//, "")
		if(string.length > maxUrlLength)
			string = string.slice(0, maxUrlLength - 3) + "..."

		return string
	}
})