$(window).on("load",function(){
    var pageTitle = document.title;
    var attentionMessage = 'My Love';
    document.addEventListener('visibilitychange', function(e) {
        var isPageActive = !document.hidden;

        if(!isPageActive){
            document.title = attentionMessage;
        }else {
            document.title = pageTitle;
        }
    });
});