// (function(){
//     const scroll = new LocomotiveScroll({
//       el: document.querySelector('[data-scroll-container]'),
//       smooth: true,
//     })
// })();


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
    var dd = parseInt(document.getElementById("dob-dd").value);
  var mm = parseInt(document.getElementById("dob-mm").value);
  var yyyy = parseInt(document.getElementById("dob-yyyy").value);
  
  if (isNaN(dd) || isNaN(mm) || isNaN(yyyy) || dd < 1 || dd > 31 || mm < 1 || mm > 12) {
    alert("Please enter a valid date.");
    return;
  }
  
  if (mm == 2) { // February
    if (dd > 29) {
      alert("Please enter a valid date for February.");
      return;
    }
    
    if (dd == 29 && (yyyy % 4 !== 0 || (yyyy % 100 === 0 && yyyy % 400 !== 0))) {
      alert("Please enter a valid date for February in a non-leap year.");
      return;
    }
  }
  else{
    $.ajax({
      type: 'POST',
      url: '/post/signup',
      data: $(this).serialize(),
      
      success: function(response) {
        $("#smsg").text("Signed up successfully!")
      $(".notif-s").fadeIn(600)
      document.querySelector(".notif-s").setAttribute("class", "notif-success animate__fadeInLeft")
      console.log(response);
      setTimeout(function(){
        window.location.href = window.location
      }, 2000)
      },
      error: function(error) {
        console.log(error['status'])
      // error = "("+error['status'] + ") " + error['statusText']
      $(".notif-e").fadeIn(600)
      document.querySelector(".notif-e").setAttribute("class", "notif-e notif error animate__fadeInLeft")
      $(".notif-e").css("z-index", "999")
      document.getElementById("emsg").innerHTML = error['statusText'];
      document.getElementById("ecode").innerHTML = error['status'];
      setTimeout(function(){
        $(".notif-e").fadeOut(600)

        document.querySelector(".notif-e").setAttribute("class", "notif-e notif error animate__fadeOutLeft")
      }, 3000)
      }
    });
    // success: function(response) {
      $("#smsg").text("You have been logged in!")
      $(".notif-s").fadeIn(600)
      document.querySelector(".notif-s").setAttribute("class", "notif-success animate__fadeInLeft")
      console.log(response);
      setTimeout(function(){
        window.location.href = window.location
      }, 2000)
  }
});

$('.loggedinbtn, .team-followbtn').click(function(event) {
  const oid = this.id
  id = ((this.id).replace('team-', ''))
  if ($(".team-followbtn").hasClass("following")){
    return
  }
  else{

    $.ajax({
      type: 'POST',
      url: '/post/team/'+id,
      data: id,
      success: function(response) {
        $('#' + oid).text("Following")
        $("#" + oid).addClass("following")
        $("#" + oid).animate({
          backgroundColor: "white",
          color: "black"
        }, 700)
        console.log(response);
        
      },
      error: function(error) { 
        console.log(error);
      }
    });
  }
});





$('#loginform').submit(function(event) {
  event.preventDefault();
  $.ajax({
    type: 'POST',
    url: '/post/login',
    data: $(this).serialize(),
    success: function(response) {
      $("#smsg").text("You have been logged in!")
      $(".notif-s").fadeIn(600)
      document.querySelector(".notif-s").setAttribute("class", "notif-success animate__fadeInLeft")
      console.log(response);
      setTimeout(function(){
        window.location.href = window.location
      }, 2000)
    },
    error: function(error) {
      console.log(error['status'])
      if (error['statusText'] === "CONFLICT"){
        error['statusText'] = "Invalid Credentials"
      }
      // error = "("+error['status'] + ") " + error['statusText']
      $(".notif-e").fadeIn(600)
      document.querySelector(".notif-e").setAttribute("class", "notif-e notif error animate__fadeInLeft")
      $(".notif-e").css("z-index", "999")
      document.getElementById("emsg").innerHTML = error['statusText'];
      document.getElementById("ecode").innerHTML = error['status'];
      setTimeout(function(){
        $(".notif-e").fadeOut(600)

        document.querySelector(".notif-e").setAttribute("class", "notif-e notif error animate__fadeOutLeft")
      }, 3000)
    }
  });
});

$(".nav-profileimg").click(function(){
  $(this).css("postion", "absolute")
  $(".profile-menu").css("zIndex", "999"); 
  setTimeout(function(){
    $(".profile-menu").show("slide", {direction: "left"}, 700)
  }, 500)
  $(".nav-profileimg").animate({
    width: "22em",
    height: "22em",
    borderRadius: "50%",
    left: "1.5em",
    top: "2em",
    zIndex: "1000",
  }, 1200),
  $("#nav-profile").css("z-index", "1999")
  $(".nav-profileimg").css("z-index", "1999")
    $("#nav-profile").css("position", "fixed")
    $(".nav-profileimg").css("position", "fixed")
    $(".nav-profileimg").css("margin-left", "2em")
    $(".nav-profileimg").css("margin-top", "2em")
    $(".nav-logoimg").css("z-index", "1000")
  
  $(".nav-logoimg").animate({
    zIndex: "1000",
    left: "2.5em",
  }, 1200)
  $(".nav-menubtnimg").animate({
    opacity: "0",
  }, 60)
})



$(".profile-backbtn").click(function(){
  $(this).css("postion", "absolute")
  $(".profile-menu").css("zIndex", "999"); 
  setTimeout(function(){
    $(".profile-menu").hide("slide", {direction: "left"}, 700)
  }, 500)
  $(".nav-profileimg").animate({
    width: "2.5em",
    height: "2.5em",
    borderRadius: "50%",
    left: "-2.5em",
    top: "-2.5em",
    zIndex: "0",
  }, 1200),
  setTimeout(function(){
    $("#nav-profile").css("z-index", "0")
    $(".nav-profileimg").css("z-index", "0")
  }, 1200)
    $("#nav-profile").css("position", "relative")
    $(".nav-profileimg").css("position", "relative")
    $(".nav-profileimg").css("margin-left", "2em")
    $(".nav-profileimg").css("margin-top", "2em")
  
  $(".nav-logoimg").animate({
    zIndex: "0",
    left: "50%",
  }, 1200)
  $(".nav-menubtnimg").animate({
    opacity: "100",
  }, 60)
})
function closeProfile(){
  $(this).css("postion", "absolute")
  $(".profile-menu").css("zIndex", "999"); 
  setTimeout(function(){
    $(".profile-menu").hide("slide", {direction: "left"}, 700)
  }, 500)
  $(".nav-profileimg").animate({
    width: "2.5em",
    height: "2.5em",
    borderRadius: "50%",
    left: "-2.5em",
    top: "-2.5em",
    zIndex: "0",
  }, 1200),
  setTimeout(function(){
    $("#nav-profile").css("z-index", "0")
    $(".nav-profileimg").css("z-index", "0")
  }, 1200)
    $("#nav-profile").css("position", "relative")
    $(".nav-profileimg").css("position", "relative")
    $(".nav-profileimg").css("margin-left", "2em")
    $(".nav-profileimg").css("margin-top", "2em")
  
  $(".nav-logoimg").animate({
    zIndex: "0",
    left: "50%",
  }, 1200)
  $(".nav-menubtnimg").animate({
    opacity: "100",
  }, 60)
}

$(".to-login").click(function(){
  $(".login").show("slide", {direction: "left"}, 700)
  $(".signup").hide("slide", {direction: "right"}, 700)

  closeProfile()
})

$(".to-signup").click(function(){
  $(".signup").show("slide", {direction: "left"}, 700)
  $(".login").hide("slide", {direction: "right"}, 700)

  closeProfile()
})

$('.not-loggedin-follow').click(function(){
  $(".notif-s").css("z-index", "99")
  $(".login").show("slide", {direction: "right"}, 700)
  $("#smsg").text("Login to follow")
  $("#ns-s").text("ALERT")
  $("#scode").text("")
  $(".notif-s").show("slide", {direction: "right"}, 700)
  setTimeout(function(){
    $(".notif-s").hide("slide", {direction: "right"}, 700)
  }, 2000)
})

$(".following").hover(function(){
  $(this).text("Unfollow")
})

$(".following").click(function(){
  
  $.ajax({
    type: 'POST',
    url: '/post/event/unfollow',
    data: this.id,
    
    success: function(response) {
      $(this).text("Follow")
  $(this).animate({
    backgroundColor: "transparent",
    stroke: "white",
    color: "white",
  }, 500)
  setTimeout(function(){
    document.querySelector(".following").setAttribute("class", "team-followbtn loggedinbtn hoverable")
  }, 500)
      $("#smsg").text("You have unfollowed this team")
    $(".notif-s").fadeIn(600)
    document.querySelector(".notif-s").setAttribute("class", "notif-success animate__fadeInLeft")
    console.log(response);
    setTimeout(function(){
      window.location.href = window.location
    }, 2000)
    },
    error: function(error) {
      console.log(error['status'])
    // error = "("+error['status'] + ") " + error['statusText']
    $(".notif-e").fadeIn(600)
    document.querySelector(".notif-e").setAttribute("class", "notif-e notif error animate__fadeInLeft")
    $(".notif-e").css("z-index", "999")
    document.getElementById("emsg").innerHTML = error['statusText'];
    document.getElementById("ecode").innerHTML = error['status'];
    setTimeout(function(){
      $(".notif-e").fadeOut(600)

      document.querySelector(".notif-e").setAttribute("class", "notif-e notif error animate__fadeOutLeft")
    }, 3000)
    }
  });
})

$(".following").mouseleave(function(){
  $(this).text("Following")
})

$("#logout").click(function(){
  window.location.href='/logout'
})
const carouselItems = document.querySelectorAll('.carousel-item');
const carouselContainer = document.querySelector('.carousel-container');
let isScrolling = false;
let startX;
let scrollLeft;

// Set the first item as the default focus
carouselItems[0].focus();

// Center the focused item when clicked or swiped
carouselContainer.addEventListener('mousedown', handleSwipeStart);
carouselContainer.addEventListener('mousemove', handleSwipeMove);
carouselContainer.addEventListener('mouseup', handleSwipeEnd);
carouselContainer.addEventListener('mouseleave', handleSwipeEnd);
carouselContainer.addEventListener('touchstart', handleSwipeStart);
carouselContainer.addEventListener('touchmove', handleSwipeMove);
carouselContainer.addEventListener('touchend', handleSwipeEnd);

function handleSwipeStart(event) {
  isScrolling = true;
  startX = event.pageX || event.touches[0].pageX;
  scrollLeft = carouselContainer.scrollLeft;
}

function handleSwipeMove(event) {
  if (!isScrolling) return;
  event.preventDefault();
  const x = event.pageX || event.touches[0].pageX;
  const walk = (x - startX) * 1.5; // Adjust the swipe sensitivity here
  carouselContainer.scrollLeft = scrollLeft - walk;
}

function handleSwipeEnd() {
  isScrolling = false;
  const containerWidth = carouselContainer.offsetWidth;
  const currentScrollPos = carouselContainer.scrollLeft;
  const containerCenter = containerWidth / 2;
  let closestItem = null;
  let closestDistance = Infinity;

  carouselItems.forEach(item => {
    const itemRect = item.getBoundingClientRect();
    const itemLeft = itemRect.left - carouselContainer.getBoundingClientRect().left;
    const itemCenter = itemLeft + itemRect.width / 2;
    const distance = Math.abs(itemCenter - containerCenter);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestItem = item;
    }
  });

  if (closestItem) {
    const itemRect = closestItem.getBoundingClientRect();
    const itemLeft = itemRect.left - carouselContainer.getBoundingClientRect().left;
    const itemCenter = itemLeft + itemRect.width / 2;
    const scrollOffset = itemCenter - containerCenter;
    carouselContainer.scrollTo({
      left: currentScrollPos + scrollOffset,
      behavior: 'smooth'
    });
  }
}

$("#date-tue").click(function(){
  $("#t1-ticket").attr("src", "/static//team//gt.svg")
  $("#t2-ticket").attr("src", "/static//team//csk.svg")
})
$("#date-wed").click(function(){
  $("#t1-ticket").attr("src", "/static//team//lsg.svg")
  $("#t2-ticket").attr("src", "/static//team//tbd.svg")
})
$("#date-fri").click(function(){
  $("#t1-ticket").attr("src", "/static//team//tbd.svg")
  $("#t2-ticket").attr("src", "/static//team//tbd.svg")
})
$("#date-sun").click(function(){
  $("#t1-ticket").attr("src", "/static//team//tbd.svg")
  $("#t2-ticket").attr("src", "/static//team//tbd.svg")
})