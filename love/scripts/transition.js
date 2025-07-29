$(document).ready(function(){
    $('a[href*="#"]').on('click', function(e){
        $('html,body').animate({
            scrollTop: $($(this).attr('href')).offset().top},500);
        e.preventDefault();
    });
});