$(document).ready(function(){

    fusenUtil.readyModal();

    $(document).on("click", "#delete-fusen-all", function(e){
        var fusenElement = $(".filter.active")[0];

        if(fusenElement.textContent === "All"){
            optionUtil.openModal(0);
        }else{

            for(var url in optionUtil.urlNo){
                if(fusenElement.textContent === url){
                    optionUtil.openModal(parseInt(optionUtil.urlNo[url]));
                }
            }
        }
    });


    var value = '';
    var urlNoCount = 1000;
    chrome.storage.local.get(function(fusenData) {

        optionUtil.fusenData = fusenData;
        optionUtil.urlNo = {};

        console.log(fusenData);
        var hoge = {};

        if(Object.keys(fusenData).length === 0){
            $("#fusen-data").remove();

            var noContentElement = "<h3> - no Fusen Data - </h3>";
            $("body").append(noContentElement);
        }

        for(var url in fusenData){

            optionUtil.urlNo[url] = urlNoCount;
            console.log(fusenData[url]);
            console.log(optionUtil.urlNo);

            optionUtil.addButton(url, optionUtil.urlNo[url]);
            
            for(var id in fusenData[url]){
                console.log(fusenData[url][id]);
                optionUtil.addFusen(id, urlNoCount);

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

});
