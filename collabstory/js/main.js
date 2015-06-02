// smooth scroll
$(".scroll").click(function(event){     
	event.preventDefault();
	$('html,body').animate({scrollTop:$(this.hash).offset().top}, 500);
});
        

// header fade
$(window).scroll(function() {
        $(".text-vertical-center").css({
         'opacity' : 1-(($(this).scrollTop())/350)
            });    
    
}); 


//Scrollsnap

$(document).scroll(function() {
    $("div:not(.highlight)").each(function() {
        if (isScrolledIntoView(this)) {
           $("div").removeClass("highlight");
           $(this).addClass("highlight");
           $("body").animate({ scrollTop: $(this).offset().top }, 1000)
        }
    });
});

function isScrolledIntoView(elem)
{
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

    return (elemTop <= docViewBottom) && (elemTop > docViewTop);
}​