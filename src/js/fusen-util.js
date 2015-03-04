var fusenData = {};
var fusenUtil = {};

fusenUtil.addFusen = function(time){

    // fusenElement
    var element;
    element = "<div id='" + time + "' class='ui-widget-content webfusen'>";
    element += "<div class='webfusen-drag'></div>";
    element += "<div class='webfusen-close'><div class = 'webfusen-char'>×</div></div>";
    element += "<div class='webfusen-textarea-wrap'><textarea class='webfusen-textarea'></textarea></div>";
    element += "<div class='webfusen-config'>";
    element += "<ul class='webfusen-config-menu'>";
    element += "<li class='webfusen-config-list'><div class='webfusen-config-menu-text'>background-color</div><div class='picker'><input type='text' id='webfusen-background-color' /></div>";
    element += "<input type='checkbox' id='transparent-window' />背景以外も透過</li>";
    element += "<li class='webfusen-config-list' id='webfusen-font-size'><div class='webfusen-config-menu-text'>font-size</div>";
    element += "<input type='text' id='webfusen-font-size-value' size='3' maxlength='3' /> px";
    element += "</li>";
    element += "<li class='webfusen-config-list' id=''><div class='webfusen-config-menu-text'>font-color</div><div class='picker'><input type='text' id='webfusen-font-color' /></div>";
    element += "</ul></div>";
    element += "<div class='webfusen-config-button'></div>";
    element += "</div>";

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

    // ドラッグ、リサイズ可能
    $("#" + time).draggable();
    $("#" + time).resizable();


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


    if(url in fusenUtil.fusenData){
        fusenUtil.fusenData[url][id] = {"left":left, "top":top, "height":height, "width":width, "val":val, "bgColor":bgColor, "opacity":opacity, "checked":checked, "textSize":textSize, "textColor":textColor};
    }else{
        var item = {};
        item[id] = {"left":left, "top":top, "height":height, "width":width, "val":val, "bgColor":bgColor, "opacity":opacity, "checked":checked, "textSize":textSize, "textColor":textColor};
        fusenUtil.fusenData[url] = item;
    }
    
    chrome.storage.local.set(fusenUtil.fusenData, function () {
        chrome.storage.local.get(url, function(urlData) {
            for(var item in urlData){
                console.log(urlData[item]);
                for(var id in urlData[item]){
                    console.log(urlData[item][id]);
                }
            }
        });
    });
};


fusenUtil.changeZIndex = function(fusenElement){
    $(".webfusen").css("z-index", 9999999);
    $(fusenElement).css("z-index", 99999999);
};


fusenUtil.deleteFusen = function(id){

    if(url in fusenUtil.fusenData){

        if(fusenUtil.fusenData[url] === null || fusenUtil.fusenData[url] === {}){
            return;
        }

        $("#" + id).remove();
        delete fusenUtil.fusenData[url][id];

        if(Object.keys(fusenUtil.fusenData[url]).length === 0){
            delete fusenUtil.fusenData[url];
            chrome.storage.local.remove(url);
        }else{
            
        }

        chrome.storage.local.set(fusenUtil.fusenData, function () {

            chrome.storage.local.get(url, function(fusenData_new) {
                for(var item in fusenData_new){
                    console.log(fusenData_new[item]);
                    for(var id in fusenData_new[item]){
                        console.log(fusenData_new[item][id]);
                    }
                }
            });
        });
    }
};


fusenUtil.deleteFusenAll = function(){

        for(var urlData in fusenUtil.fusenData){
            if(url === urlData){

                console.log("delete all fusen this page.");
                $(".webfusen").remove();
                item = {};
                chrome.storage.local.remove(url,function(){
                    chrome.storage.local.get(url, function(items){
                        if(items === {} || items === null){
                            console.log("delete all fusen : ok");
                        }else{
                            console.log("delete all fusen : ng");
                        }
                    });
                });
                return;
           }
        }
};


fusenUtil.readyModal = function(){

    var modalElement = "<div class='webfusen-modal'>";
    modalElement += '<h2>Delete All Fusen</h2>';
    modalElement += '<p>Are you sure you want to delete all Fusen data from this page ?</p><br />';
    modalElement += '<div class="webfusen-modal-cancel webfusen-modal-button">Cancel</div>';
    modalElement += '<div class="webfusen-modal-confirm webfusen-modal-button">OK</div>';
    modalElement += '</div>';

    var overlayElement = "<div class='webfusen-modal-overlay'></div>"

    $(document.body).append(overlayElement);
    $(document.body).append(modalElement);

};


fusenUtil.openModal = function(){
    fusenUtil.centeringModalSyncer();

    $(".webfusen-modal").fadeIn("slow");
    $(".webfusen-modal-overlay").fadeIn("slow");

    $(window).resize(fusenUtil.centeringModalSyncer());

    $(".webfusen-modal-overlay,.webfusen-modal-cancel").unbind().click(function(event) {
        $(".webfusen-modal-overlay,.webfusen-modal").fadeOut("slow");
    });

    $(".webfusen-modal-confirm").unbind().click(function(event) {
        fusenUtil.deleteFusenAll();
        $(".webfusen-modal-overlay,.webfusen-modal").fadeOut("slow");
    });
};

//センタリングをする関数
fusenUtil.centeringModalSyncer = function(){

    //画面(ウィンドウ)の幅を取得し、変数[w]に格納
    var w = $(window).width();

    //画面(ウィンドウ)の高さを取得し、変数[h]に格納
    var h = $(window).height();

    //コンテンツ(#modal-content)の幅を取得し、変数[cw]に格納
    var cw = $(".webfusen-modal").outerWidth(true);

    //コンテンツ(#modal-content)の高さを取得し、変数[ch]に格納
    var ch = $(".webfusen-modal").outerHeight(true);

    //コンテンツ(#modal-content)を真ん中に配置するのに、左端から何ピクセル離せばいいか？を計算して、変数[pxleft]に格納
    var pxleft = ((w - cw)/2);

    //コンテンツ(#modal-content)を真ん中に配置するのに、上部から何ピクセル離せばいいか？を計算して、変数[pxtop]に格納
    var pxtop = ((h - ch)/2);

    //[#modal-content]のCSSに[left]の値(pxleft)を設定
    $(".webfusen-modal").css({"left": pxleft + "px"});

    //[#modal-content]のCSSに[top]の値(pxtop)を設定
    $(".webfusen-modal").css({"top": pxtop + "px"});

}