(function(){
    var scroll = new LocomotiveScroll();
})();

$('.nav-menubtnimg').click(function(){
    $('.menu').show("slide", {direction: "right"}, 700)
})

$(".menu-backbtn").click(function(){
    $(".menu").hide("slide", {direction: "left"}, 700)
})
if ( window.history.replaceState ) {
    window.history.replaceState( null, null, window.location.href );
  }
$('#signupform').submit(function(event) {
    event.preventDefault();
    $.ajax({
      type: 'POST',
      url: '/post/signup',
      data: $(this).serialize(),
      success: function(response) {
        console.log(response);
      },
      error: function(error) {
        console.log(error);
      }
    });
});