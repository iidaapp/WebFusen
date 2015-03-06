var url = $(location).attr('href');

$(document).ready(function(){

    var json = null;

    fusenUtil.readyModal();

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
        fusenUtil.deleteFusen(id);
    });

    fusenUtil.importCss('css/fusen-reset.css');
    fusenUtil.importCss('css/jquery-ui.min.css');
    fusenUtil.importCss('css/spectrum.css');
    fusenUtil.importCss('css/fusen.css');

    chrome.storage.local.get(url, function(urlData) {

        for(var item in urlData){

            console.log(urlData[item]);

            for(var id in urlData[item]){

                console.log(urlData[item][id]);

                fusenUtil.addFusen(id);
                $("#" + id).css("left", urlData[item][id].left);
                $("#" + id).css("top", urlData[item][id].top);
                $("#" + id).css("height", urlData[item][id].height);
                $("#" + id).css("width", urlData[item][id].width);
                $("#" + id + " .webfusen-textarea").val(urlData[item][id].val);

                $("#" + id).css("opacity", urlData[item][id].opacity);
                $("#" + id + ' #transparent-window').prop("checked", urlData[item][id].checked);

                var color = urlData[item][id].bgColor;
                var opacity = urlData[item][id].opacity;
                var bgColor;

                $("#" + id).css("background-color", urlData[item][id].bgColor);

                if($("#" + id + ' #transparent-window').prop("checked")){
                    bgColor = color.replace(/rgb\((\d+), (\d+), (\d+)\)/,"rgba($1, $2, $3, " + opacity + ")");
                }else{
                    bgColor = color;
                }

                $("#" + id + " #webfusen-background-color").spectrum("set", bgColor);            

                $("#" + id + " textarea").css("color", urlData[item][id].textColor);
                $("#" + id + " #webfusen-font-color").spectrum("set", urlData[item][id].textColor);

                $("#" + id + " textarea").css("font-size", parseInt(urlData[item][id].textSize));
                $("#" + id + " #webfusen-font-size-value").val(urlData[item][id].textSize);
            }
        }

        fusenUtil.fusenData = urlData;
    });

    return;
});

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {

    if (msg.command && (msg.command === "add_fusen")) {

        var date = new Date();
        fusenUtil.addFusen(date.getTime());

    } else if(msg.command && (msg.command === "delete_all_fusen")){

        fusenUtil.openModal();

    } else if(msg.command && (msg.command === "get_fusen_information")){

        var json = fusenUtil.stringify(fusenUtil.fusenData[url]);
        sendResponse(json);    

    } else if(msg.command && (msg.command === "delete_fusen")){

        var targetid = msg.targetid;
        console.log(targetid);
        fusenUtil.deleteFusen(targetid);
    }

});
