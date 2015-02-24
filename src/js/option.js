$(document).ready(function(){

    $("#hoge").click(function(event) {
        var text = $("#text").val();
        console.log(text);
    });

    var value = '';
    chrome.storage.local.get('https://www.google.co.jp/', function(item) {
        value = item.value;
        console.log(value);
    });

    for(var i = 0; i < localStorage.length; i++){
        var k = localStorage.key(i);
        console.log(localStorage.getItem(k));
    }

});
