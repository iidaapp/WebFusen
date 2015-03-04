$(document).ready(function(){


    var value = '';
    var urlNo = {};
    var urlNoCount = 1000;
    chrome.storage.local.get(function(fusenData) {

        optionUtil.fusenData = fusenData;

        console.log(fusenData);
        for(var url in fusenData){

            urlNo[url] = urlNoCount;
            console.log(fusenData[url]);
            console.log(urlNo);

            var buttonElement = "";
            
            for(var id in fusenData[url]){
                console.log(fusenData[url][id]);
                optionUtil.addFusen(id, urlNoCount, url);

                $("#" + id + " .webfusen-textarea").val(fusenData[url][id].val);

                $("#" + id).css("opacity", fusenData[url][id].opacity);
                $("#" + id + ' #transparent-window').prop("checked", fusenData[url][id].checked);

                var color = fusenData[url][id].bgColor;
                var opacity = fusenData[url][id].opacity;
                var bgColor;

                $("#" + id).css("background-color", fusenData[url][id].bgColor);

                if($("#" + id + ' #transparent-window').prop("checked")){
                    bgColor = color.replace(/rgb\((\d+), (\d+), (\d+)\)/,"rgba($1, $2, $3, " + opacity + ")");
                }else{
                    bgColor = color;
                }

                $("#" + id + " #webfusen-background-color").spectrum("set", bgColor);            

                $("#" + id + " textarea").css("color", fusenData[url][id].textColor);
                $("#" + id + " #webfusen-font-color").spectrum("set", fusenData[url][id].textColor);

                $("#" + id + " textarea").css("font-size", parseInt(fusenData[url][id].textSize));
                $("#" + id + " #webfusen-font-size-value").val(fusenData[url][id].textSize);
            }

            urlNoCount++;
        }

        $('#Container').mixItUp();  

    });

    $(".content:not('.active + .content')").hide();    
    $(".menu").hover(function(){
        $ (this).addClass("hover")
    },
    function(){
        $(this).removeClass("hover")
        }); 
    $ (".menu").click(function(){
        $(".menu").removeClass("active");
        $ (this).addClass("active");
        $(".content:not('.active + .content')").fadeOut();
        $ (".active + .content").fadeIn();  
    });
});
