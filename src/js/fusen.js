var url = $(location).attr('href');
var item = {};

$(document).ready(function(){

    var json = null;

    $(document).on("click", ".webfusen-config-button", function(e){
        var element = e.currentTarget.parentElement;
        var target = e.currentTarget.previousElementSibling;
        $(target).toggle();

        $("#" + this.parentElement.id + " #custom").spectrum({
            preferredFormat: "hex",
            showInitial: true,
            showInput: true,
            showAlpha: true,
            color: "#000000"
        });
    });


    $(document).on("blur", ".webfusen-textarea", function(e){

        var element = e.currentTarget.parentElement.parentElement;
        var textarea = e.currentTarget;

        var id = e.currentTarget.parentElement.parentElement.id;
        var left = $(element).css("left");
        var top = $(element).css("top");
        var height = $(element).css("height");
        var width = $(element).css("width");
        var val = $(textarea).val();

        item[id] = {"left":left, "top":top, "height":height, "width":width, "val":val};
        var json = fusenUtil.stringify(item);
        
        localStorage[url] = json;
    });

    $(document).on("mouseup", ".webfusen-drag", function(e){
        var element = e.currentTarget.parentElement;
        var textarea = e.currentTarget.nextElementSibling.nextElementSibling;

        var id = e.currentTarget.parentElement.id;
        var left = $(element).css("left");
        var top = $(element).css("top");
        var height = $(element).css("height");
        var width = $(element).css("width");
        var val = $(textarea).val();

        item[id] = {"left":left, "top":top, "height":height, "width":width, "val":val};
        var json = fusenUtil.stringify(item);

        
        localStorage[url] = json;
    });

    $(document).on("click", ".webfusen-close", function(e){
        var element = e.currentTarget.parentElement;
        var id = element.id;
        $(element).remove();
        delete item[id];

        if(Object.keys(item).length === 0){
            localStorage.removeItem(url);
            return;
        }

        var json = fusenUtil.stringify(item);
        localStorage[url] = json;
    });

    fusenUtil.importCss('css/jquery-ui.min.css');
    fusenUtil.importCss('css/spectrum.css');
    fusenUtil.importCss('css/fusen.css');

    json = localStorage.getItem(url);
    if(typeof json === "undefined" || json === null){
        return;
    }

    item = $.parseJSON(json);

    for (var key in item) {
        fusenUtil.addFusen(key);
        $("#" + key).css("left", item[key].left);
        $("#" + key).css("top", item[key].top);
        $("#" + key).css("height", item[key].height);
        $("#" + key).css("width", item[key].width);
        $("#" + key + " .webfusen-textarea").val(item[key].val);
    }

});

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {

    if (msg.command && (msg.command === "add_fusen")) {

        var date = new Date();
        fusenUtil.addFusen(date.getTime());

    } else if(msg.command && (msg.command === "delete_all_fusen")){

        $(".webfusen").remove();
        item = {};
        localStorage.removeItem(url);

    } else if(msg.command && (msg.command === "get_fusen_information")){

        var json = fusenUtil.stringify(item);
        sendResponse(json);
    }

});
