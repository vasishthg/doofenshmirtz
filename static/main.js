(function(){
    var scroll = new LocomotiveScroll();
})();

$('.nav-menubtnimg').click(function(){
    $('.menu').show("slide", {direction: "right"}, 700)
})

$(".menu-backbtn").click(function(){
    $(".menu").hide("slide", {direction: "left"}, 700)
})