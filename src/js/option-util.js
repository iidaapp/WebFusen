var optionUtil = {};
var fusenData = {};

optionUtil.addFusen = function(id, urlNoCount, url){

    // fusenElement
    var element;
    element = "<div id='" + id + "' class='ui-widget-content webfusen mix " + urlNoCount + "' data-my-order='" + id +  "'>";
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

    $("#Container").append(element);
    var obj = $("#" + id);
    var fusenElement = obj[0];

        $("#" + id + " #webfusen-background-color").spectrum({
        preferredFormat: "hex",
        showInitial: true,
        showInput: true,
        showAlpha: true,
        color: "rgba(255,255,255,0.5)",
        change : function(color) {

            if($("#" + id + ' #transparent-window').prop('checked')){

                var colorRgb = color.toRgb();
                var alpha = colorRgb.a;
                $("#" + id).css("background-color", color.toHexString());
                $("#" + id).css("opacity", alpha);

                optionUtil.saveFusenData(fusenElement, url);

            }else{
                $("#" + id).css("background-color", color.toRgbString());
                $("#" + id).css("opacity", 1);
                optionUtil.saveFusenData(fusenElement, url);
            }
        }
    });

    // 透明度フラグ設定
    $("#" + id + ' #transparent-window').click(function() {
        var color = $("#" + id + " #webfusen-background-color").spectrum("get");
        var colorRgb = color.toRgb();
        var alpha = colorRgb.a;
        var opacity = $("#" + id).css("opacity");

        if($("#" + id + ' #transparent-window').prop('checked')){

            $("#" + id).css("background-color", color.toHexString());
            $("#" + id).css("opacity", alpha);
            $("#" + id + " #webfusen-background-color").spectrum("set", color);

        }else{

            color.setAlpha(opacity);
            $("#" + id).css("background-color", color.toRgbString());
            $("#" + id).css("opacity", 1);
            $("#" + id + " #webfusen-background-color").spectrum("set", color);
        }

        optionUtil.saveFusenData(fusenElement, url);
    });

    // フォントカラー設定
    $("#" + id + " #webfusen-font-color").spectrum({
        preferredFormat: "hex",
        showInitial: true,
        showInput: true,
        color: "rgb(0,0,0)",
        change : function(color) {
            $("#" + id + " textarea").css("color", color.toHexString());
            optionUtil.saveFusenData(fusenElement, url);
        }
    });

    // コンフィグボタンクリック時処理
    $("#" + id).on("click", ".webfusen-config-button", function(e){
        var element = e.currentTarget.parentElement;
        var target = e.currentTarget.previousElementSibling;
        $(target).slideToggle();
    });

    // フォントサイズ変更処理
    $("#" + id + " input#webfusen-font-size-value").keyup(function() {
        $("#" + id + " .webfusen-textarea").css("font-size", parseInt($(this).val()));
        optionUtil.saveFusenData(fusenElement, url);
    });

    $(document).on("blur", ".webfusen-textarea", function(e){
        var element = e.currentTarget.parentElement.parentElement;
        optionUtil.saveFusenData(element, url);
    });

    $(document).on("mousedown", ".webfusen", function(e){
        var element = e.currentTarget;
        fusenUtil.changeZIndex(element, url);
    });

    $(document).on("mouseup", ".webfusen-drag", function(e){
        var element = e.currentTarget.parentElement;
        optionUtil.saveFusenData(element, url);
    });

    $(document).on("click", ".webfusen-close", function(e){
        var element = e.currentTarget.parentElement;
        var id = element.id;
        fusenUtil.deleteFusen(id);
    });

};

// fusenデータ保存処理
optionUtil.saveFusenData = function(fusenElement, url){

    var textarea = fusenElement.firstElementChild.nextElementSibling.nextElementSibling.firstElementChild;

    var id = fusenElement.id;
    var left = optionUtil.fusenData[url][id].left;
    var top = optionUtil.fusenData[url][id].top;
    var height = optionUtil.fusenData[url][id].height
    var width = optionUtil.fusenData[url][id].width
    var val = $(textarea).val();

    var bgColor = $(fusenElement).css("background-color");
    var opacity = $(fusenElement).css("opacity");
    var checked = $(fusenElement).children(".webfusen-config").children(".webfusen-config-menu").children(".webfusen-config-list").children("#transparent-window").prop("checked");
    var textSize = textarea.parentElement.nextElementSibling.childNodes[0].childNodes[1].childNodes[1].value;
    var textColor = $(textarea).css("color");


    if(url in optionUtil.fusenData){
        optionUtil.fusenData[url][id] = {"left":left, "top":top, "height":height, "width":width, "val":val, "bgColor":bgColor, "opacity":opacity, "checked":checked, "textSize":textSize, "textColor":textColor};
    }else{
        var item = {};
        item[id] = {"left":left, "top":top, "height":height, "width":width, "val":val, "bgColor":bgColor, "opacity":opacity, "checked":checked, "textSize":textSize, "textColor":textColor};
        optionUtil.fusenData[url] = item;
    }
    
    chrome.storage.local.set(optionUtil.fusenData, function () {
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
