// smooth scroll
$(".scroll").click(function(event){     
	event.preventDefault();
	$('html,body').animate({scrollTop:$(this.hash).offset().top}, 500);
});
        

// header fade
$(window).scroll(function() {
        $(".topfade").css({
         'opacity' : 1-(($(this).scrollTop())/350)
            });    
    
}); 


//snap
$(".snapping").snapPoint({ 
    scrollSpeed: 200,
});


//twitter tweetloader var

var dynamicuservar = "fabuchao";
var dynamicidvar = "605369199549132800";


//


var storywrapperposition = $("#storywrapper").offset().top;

$(document).scroll(function(){
    if($(this).scrollTop() == storywrapperposition)
    {   
       $('#pinheader').fadeIn('fast');
    }
    else{
    	 $('#pinheader').fadeOut('fast');
    }
});