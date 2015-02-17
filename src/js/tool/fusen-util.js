var fusenUtil = {};

fusenUtil.addFusen = function(time){

    var element;
    element = "<div id='" + time + "' class='ui-widget-content webfusen'>";
    element += "<div class='webfusen-drag'></div>";
    element += "<div class='webfusen-close'><div class = 'webfusen-char'>×</div></div>";
    element += "<div class='webfusen-textarea-wrap'><textarea class='webfusen-textarea'></textarea></div>";
    element +=　"<div class='webfusen-config'>";
    element +=　"<ul class='webfusen-config-menu'>";
    element += "<li class='webfusen-config-list'><div class='webfusen-config-menu-text'>background-color</div><div class='picker'><input type='text' id='webfusen-background-color' /></div>";
    element += "<input type='checkbox' id='transparent-window' />背景以外も透過</li>";
    element += "<li class='webfusen-config-list' id='webfusen-font-size'><div class='webfusen-config-menu-text'>font-size</div>";
    element += "<input type='text' id='webfusen-font-size-value' size='3' maxlength='3' /> px";
    element += "</li>";
    element += "<li class='webfusen-config-list' id=''><div class='webfusen-config-menu-text'>font-color</div><div class='picker'><input type='text' id='webfusen-font-color' /></div>";
    element += "</ul></div>";
    element += "<div class='webfusen-config-button'></div>";
    element +=　"</div>";

    $(document.body).append(element);

    $("#" + time + " #webfusen-background-color").spectrum({
        preferredFormat: "hex",
        showInitial: true,
        showInput: true,
        showAlpha: true,
        color: "rgba(255,255,255,0.5)",
        change : function(color) {
            if($("#" + time + ' #transparent-window').prop('checked')){
                var colorRgb = color.toRgb();
                var alpha = colorRgb.a;
                $("#" + time).css("background-color", color.toHexString());
                $("#" + time).css("opacity", alpha);
            }else{
                $("#" + time).css("background-color", color.toRgbString());
                $("#" + time).css("opacity", 1);
            }
        }
    });

    $("#" + time + ' #transparent-window').click(function() {
        var color = $("#" + time + " #webfusen-background-color").spectrum("get");
        if($("#" + time + ' #transparent-window').prop('checked')){
                var colorRgb = color.toRgb();
                var alpha = colorRgb.a;
            $("#" + time).css("background-color", color.toHexString());
            $("#" + time).css("opacity", alpha);
        }else{
            $("#" + time).css("background-color", color.toRgbString());
            $("#" + time).css("opacity", 1);
        }
    });

    $("#" + time + " #webfusen-font-color").spectrum({
        preferredFormat: "hex",
        showInitial: true,
        showInput: true,
        color: "rgb(0,0,0)",
        change : function(color) {
            $("#" + time + " textarea").css("color", color.toHexString());
        }
    });

    $("#" + time).draggable();
    $("#" + time).resizable();

    $("#" + time).on("click", ".webfusen-config-button", function(e){
        var element = e.currentTarget.parentElement;
        var target = e.currentTarget.previousElementSibling;
        $(target).slideToggle();
    });

    $("#" + time + " input#webfusen-font-size-value").keyup(function() {
        $("#" + time + " .webfusen-textarea").css("font-size", parseInt($(this).val()));
    });
};

fusenUtil.stringify = function(obj) {

    var t = typeof (obj);
    if (t != "object" || obj === null) {
        // simple data type
        if (t == "string") {
            obj = '"' + obj + '"';
        }
        return String(obj);
    }
    else {
        var n, v, json = [];
        var arr = (obj && $.isArray(obj));

        for (n in obj) {
            v = obj[n];
            t = typeof(v);
            if (obj.hasOwnProperty(n)) {
                if (t == "string") {
                    v = '"' + v + '"';
                }
                else if (t == "object" && v !== null) {
                    v = JSON.stringify(v);
                }
                json.push((arr ? "" : '"' + n + '":') + String(v));
            }
        }
        return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
    }
};

fusenUtil.importCss = function(cssName){
    var style = document.createElement('link');
    style.rel = 'stylesheet';
    style.type = 'text/css';
    style.href = chrome.extension.getURL(cssName);
    (document.head||document.documentElement).appendChild(style);
};

