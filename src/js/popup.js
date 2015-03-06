$("#add-fusen").click(function(){
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

$("a#option").click(function(){

	var optionsUrl = chrome.extension.getURL("") + "html/WebFusenOption.html";

	chrome.tabs.query({ url: optionsUrl }, function(tabs) {
		if(tabs.length){
			chrome.tabs.update(tabs[0].id, { active: true });
            setTimeout(window.close, 120);
		}else{
			chrome.tabs.create({url:optionsUrl}), window.close();
		}
	});
	
});

var escapeHTML = function(val) {
      return $('<div />').text(val).html();
};

$(document).ready(function(){
	chrome.tabs.getSelected(null, function(tab){
		
		if(!isHttpWebPage(tab.url)){
			$("ul").remove();
			var elements = "<ul><li class='sep'></li><li></li><li class='no-fusen'>( Can't create Fusen. )</li><li></li><li class='sep'></li></ul>";
			$("body").append(elements);
		}

        chrome.tabs.sendMessage(tab.id, {command: "get_fusen_information"}, function(jsonData){

        	if(jsonData === "undefined" || jsonData === null){
    	        var empty = "<li class='no-fusen'>( no Fusen )</li>" ;
				$("div#list").append(empty);
				$("#delete-all-fusen").remove();

				return;
	        }

        	console.log(jsonData);
        	urlData = JSON.parse(jsonData);
			console.log(urlData);

			var i = 1;
			for (var id in urlData) {

				var fusenData = urlData[id];
				console.log(fusenData);
				var datetime = new Date();
				datetime.setTime(id);
				var val = fusenData.val;
				val = escapeHTML(val);

				console.log(val);

				var str = "";
				if(val.length > 10){
					str = val.substr(0, 10)  + "...";
				} else {
					str = val;
				}

				console.log(str);

				var element = "<li class='fusen' id='" + id + "''>";
				element += i + " : " + str + "<br />";
				element += "<div class='date'> - " + datetime.toLocaleString() + "</div>";
				element += "<div class='trash'>";
				element += "</div>";
				element += "</li>";
				$("div#list").append(element);

				$("#" + id).children(".trash").click(function(){
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


isHttpWebPage = function(url){
	var word = " " + url;
	var target = "http"

	if(word.indexOf(" " + target) !== -1){
		return true;
	}

	return false;
};