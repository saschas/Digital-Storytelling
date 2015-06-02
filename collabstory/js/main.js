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


