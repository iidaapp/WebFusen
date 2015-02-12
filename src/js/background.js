chrome.extension.onMessage.addListener( function(request,sender,sendResponse)
{
    if( request.greeting === "GetURL" ){
        var tabURL = "Not set yet";
         chrome.tabs.getSelected(null, function(tab){
            chrome.tabs.sendMessage(tab.id, {
                command: "add_fusen"
            }),

            function(msg){};
        });
    }
});


// chrome.browserAction.onClicked.addListener(function(tab) {
//   // chrome.tabs.sendMessage(tab.id, {
//   //     command: "add_fusen"
//   //   },
//   //   function(msg) {
//   //     console.log("result message:", msg);
//   //   });
// });