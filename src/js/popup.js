var item = {};

$("#add").click(function(){
	chrome.tabs.getSelected(null, function(tab){
        chrome.tabs.sendMessage(tab.id, {
            command: "add_fusen"
        });
	});

	window.close();
});

$("a#delete").click(function(){
	chrome.tabs.getSelected(null, function(tab){
        chrome.tabs.sendMessage(tab.id, {
            command: "delete_all_fusen"
        });
	});

	window.close();
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

        	if(typeof response === "undefined" || response === null || Object.keys(item).length === 0){
    	        var empty = "<li class='no-fusen'>( no Fusen )</li>" ;
				$("div#list").append(empty);
				$("#delete-all-fusen").remove();

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

				console.log(val);

				var str = "";
				if(val.length > 10){
					str = val.substr(0, 10)  + "...";
				} else {
					str = val;
				}

				console.log(str);

				var element = "<li class='fusen' id='" + key + "''>";
				element += i + " : " + str + "<br />";
				element += "<div class='date'> - " + datetime.toLocaleString() + "</div>";
				element += "<div class='trash'>";
				element += "</div>";
				element += "</li>";
				$("div#list").append(element);

				$("#" + key).children(".trash").click(function(){
					var targetid = this.parentElement.id;
					chrome.tabs.getSelected(null, function(tab){
				        chrome.tabs.sendMessage(tab.id, {
				            command: "delete_fusen",
				            targetid: targetid
				        });
					});
					window.close();
				});
				i++;
			}
        });
	});
});