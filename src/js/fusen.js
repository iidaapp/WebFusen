var url = $(location).attr('href');
var item = {};

$(document).ready(function(){

    var json = null;

    $(document).on("blur", ".webfusen-textarea", function(e){
        var element = e.currentTarget.parentElement.parentElement;
        fusenUtil.saveFusenData(element);
    });

    $(document).on("mousedown", ".webfusen", function(e){
        var element = e.currentTarget;
        fusenUtil.changeZIndex(element);
    });

    $(document).on("mouseup", ".webfusen-drag", function(e){
        var element = e.currentTarget.parentElement;
        fusenUtil.saveFusenData(element);
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

        $("#" + key).css("opacity", item[key].opacity);
        $("#" + key + ' #transparent-window').prop("checked", item[key].checked);

        var color = item[key].bgColor;
        var opacity = item[key].opacity;
        var bgColor;

        $("#" + key).css("background-color", item[key].bgColor);

        if($("#" + key + ' #transparent-window').prop("checked")){
            bgColor = color.replace(/rgb\((\d+), (\d+), (\d+)\)/,"rgba($1, $2, $3, " + opacity + ")");
        }else{
            bgColor = color;
        }

        $("#" + key + " #webfusen-background-color").spectrum("set", bgColor);            

        $("#" + key + " textarea").css("color", item[key].textColor);
        $("#" + key + " #webfusen-font-color").spectrum("set", item[key].textColor);

        $("#" + key + " textarea").css("font-size", parseInt(item[key].textSize));
        $("#" + key + " #webfusen-font-size-value").val(item[key].textSize);
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
