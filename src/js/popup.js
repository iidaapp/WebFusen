var item = {};

$("#add").click(function(){
	chrome.tabs.getSelected(null, function(tab){
        chrome.tabs.sendMessage(tab.id, {
            command: "add_fusen"
        });
	});

	window.close();
});

$("#delete").click(function(){
	chrome.tabs.getSelected(null, function(tab){
        chrome.tabs.sendMessage(tab.id, {
            command: "delete_all_fusen"
        });
	});
});

var escapeHTML = function(val) {
      return $('<div />').text(val).html();
};

$(document).ready(function(){
	chrome.tabs.getSelected(null, function(tab){
        chrome.tabs.sendMessage(tab.id, {command: "get_fusen_information"}, function(response){

        	console.log(response);

        	item = JSON.parse(response);
			console.log(item);

			if(Object.keys(item).length === 0){
				var empty = "<li class='no-fusen'>( no Fusen )</li>" ;
				$("div#list").append(empty);
				return;
			}

			var i = 1;
			for (var key in item) {

				var data = item[key];
				console.log(data);
				var datetime = new Date();
				datetime.setTime(key);
				var val = data.val;
				val = escapeHTML(val);

				var element = "<li class='fusen'>" + i + " : " + val + "<br /><p class='date'> - " + datetime.toLocaleString() + "</p></li>" ;
				$("div#list").append(element);

				i++;
			}
        });
	});
});