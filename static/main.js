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

const $smallBall = document.querySelector('.cursor__ball--small');
const $hoverables = document.querySelectorAll('.hoverable');

document.body.addEventListener('mousemove', onMouseMove);
for (let i = 0; i < $hoverables.length; i++) {
  $hoverables[i].addEventListener('mouseenter', onMouseHover);
  $hoverables[i].addEventListener('mouseleave', onMouseHoverOut);
}

function onMouseMove(e) {
    $(".cursor").css("display", "block")
  TweenMax.to($smallBall, .4, {
    x: e.clientX - 10,
    y: e.clientY - 10
  })
}

function onMouseHover() {
  TweenMax.to($smallBall, .3, {
    scale: 2
  })
}
function onMouseHoverOut() {
  TweenMax.to($smallBall, .3, {
    scale: 1
  })
}