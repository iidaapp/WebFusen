var fusenUtil = {};

fusenUtil.addFusen = function(time){

    // fusenElement
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

    // fusenElement追加
    $(document.body).append(element);
    var obj = $("#" + time);
    var fusenElement = obj[0];

    // 背景色設定
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

                fusenUtil.saveFusenData(fusenElement);

            }else{
                $("#" + time).css("background-color", color.toRgbString());
                $("#" + time).css("opacity", 1);
                fusenUtil.saveFusenData(fusenElement);
            }
        }
    });

    // 透明度フラグ設定
    $("#" + time + ' #transparent-window').click(function() {
        var color = $("#" + time + " #webfusen-background-color").spectrum("get");
        var colorRgb = color.toRgb();
        var alpha = colorRgb.a;
        var opacity = $("#" + time).css("opacity");

        if($("#" + time + ' #transparent-window').prop('checked')){

            $("#" + time).css("background-color", color.toHexString());
            $("#" + time).css("opacity", alpha);
            $("#" + time + " #webfusen-background-color").spectrum("set", color);

        }else{

            color.setAlpha(opacity);
            $("#" + time).css("background-color", color.toRgbString());
            $("#" + time).css("opacity", 1);
            $("#" + time + " #webfusen-background-color").spectrum("set", color);
        }

        fusenUtil.saveFusenData(fusenElement);
    });

    // フォントカラー設定
    $("#" + time + " #webfusen-font-color").spectrum({
        preferredFormat: "hex",
        showInitial: true,
        showInput: true,
        color: "rgb(0,0,0)",
        change : function(color) {
            $("#" + time + " textarea").css("color", color.toHexString());
            fusenUtil.saveFusenData(fusenElement);
        }
    });

    // ドラッグ、リサイズ可能
    $("#" + time).draggable();
    $("#" + time).resizable();

    // コンフィグボタンクリック時処理
    $("#" + time).on("click", ".webfusen-config-button", function(e){
        var element = e.currentTarget.parentElement;
        var target = e.currentTarget.previousElementSibling;
        $(target).slideToggle();
    });

    // フォントサイズ変更処理
    $("#" + time + " input#webfusen-font-size-value").keyup(function() {
        $("#" + time + " .webfusen-textarea").css("font-size", parseInt($(this).val()));
        fusenUtil.saveFusenData(fusenElement);
    });
};

// JSON解析処理
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

// CSSファイルインポート処理
fusenUtil.importCss = function(cssName){
    var style = document.createElement('link');
    style.rel = 'stylesheet';
    style.type = 'text/css';
    style.href = chrome.extension.getURL(cssName);
    (document.head||document.documentElement).appendChild(style);
};

// fusenデータ保存処理
fusenUtil.saveFusenData = function(fusenElement){
    var url = $(location).attr('href');
    var textarea = fusenElement.firstElementChild.nextElementSibling.nextElementSibling.firstElementChild;

    var id = fusenElement.id;
    var left = $(fusenElement).css("left");
    var top = $(fusenElement).css("top");
    var height = $(fusenElement).css("height");
    var width = $(fusenElement).css("width");
    var val = $(textarea).val();

    var bgColor = $(fusenElement).css("background-color");
    var opacity = $(fusenElement).css("opacity");
    var checked = $(fusenElement).children(".webfusen-config").children(".webfusen-config-menu").children(".webfusen-config-list").children("#transparent-window").prop("checked");
    var textSize = textarea.parentElement.nextElementSibling.childNodes[0].childNodes[1].childNodes[1].value;
    var textColor = $(textarea).css("color");

    item[id] = {"left":left, "top":top, "height":height, "width":width, "val":val, "bgColor":bgColor, "opacity":opacity, "checked":checked, "textSize":textSize, "textColor":textColor};
    var json = fusenUtil.stringify(item);
    localStorage[url] = json;
};

fusenUtil.changeZIndex = function(fusenElement){
    $(".webfusen").css("z-index", 9999999);
    $(fusenElement).css("z-index", 99999999);
};