var fusenUtil = {};

fusenUtil.addFusen = function(time){

    var element;
    element = "<div id='" + time + "' class='ui-widget-content webfusen'>";
    element += "<div class='webfusen-drag'></div>";
    element += "<div class='webfusen-close'><div class = 'webfusen-char'>×</div></div>";
    element += "<div class='webfusen-textarea-wrap'><textarea class='webfusen-textarea'></textarea></div>";
    element +=　"<div class='webfusen-config'>";
    element +=　"<ul class='webfusen-config-menu'>";
    element += "<li class='webfusen-config-list'><div class='webfusen-config-menu-text'>background-color</div><div id='picker'><input type='text' id='custom' /></div></li>";
    element += "<input type='checkbox' id='transparent-window' />背景以外も含めて透過";
    element += "<li class='webfusen-config-list'><div class='webfusen-config-menu-text'>font-size</div></li>";
    element += "</ul><input type='button' value='OK' id='option-send' /></div>";
    element += "<div class='webfusen-config-button'></div>";
    element +=　"</div>";

    $(document.body).append(element);

    $("#" + time).draggable();
    $("#" + time).resizable();

  };

fusenUtil.stringify = function(obj) {
    /// <summary>
    /// オブジェクトをJSON文字列に変換する。
    /// ※JSON文字列をオブジェクトに変換する場合はjQuery標準のparseJSONを使う。
    ///
    /// json = $.stringify(obj);
    /// obj  = $.parseJSON(json);
    /// </summary>
    
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

