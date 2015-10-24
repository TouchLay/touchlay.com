document.body.className = document.body.className.replace("no-js","js");

window.lazySizesConfig = window.lazySizesConfig || {};

lazySizesConfig.throttle = 70;
lazySizesConfig.expand = 500;
lazySizesConfig.expFactor = 2;
lazySizesConfig.loadMode = 3;

$(document).ready(function() {

  /**
  * This part handles the highlighting functionality.
  * We use the scroll functionality again, some array creation and
  * manipulation, class adding and class removing, and conditional testing
  */
  var aChildren = $("#main-menu a.item"); // find the a children of the list items
  var aArray = []; // create the empty aArray
  for (var i = 0; i < aChildren.length; i++) {
    var aChild = aChildren[i];
    var ahref = $(aChild).attr('href');
    aArray.push(ahref);
  } // this for loop fills the aArray with attribute href values
  $(window).scroll(function() {
    var windowPos = $(window).scrollTop() + 86; // get the offset of the window from the top of page
    var windowHeight = $(window).height(); // get the height of the window
    var docHeight = $(document).height();
    for (var i = 0; i < aArray.length; i++) {
      var theID = aArray[i];
      var divPos = $('#' + theID.split('#')[1]).offset().top; // get the offset of the div from the top of page
      var divHeight = $('#' + theID.split('#')[1]).height(); // get the height of the div in question
      if (windowPos >= divPos && windowPos < (divPos + divHeight)) {
        $("a[href='" + theID + "']").addClass("active");
      } else {
        $("a[href='" + theID + "']").removeClass("active");
      }
    }
    if (windowPos + windowHeight == docHeight) {
      if (!$("#main-menu a.item:last-child").hasClass("active")) {
        var navActiveCurrent = $(".active").attr("href");
        $("a[href='" + navActiveCurrent + "']").removeClass("active");
        $("#main-menu a.item:last-child").addClass("active");
      }
    }
  });

  $('#main-menu').css('background', 'transparent').css('border-width', '0');

  $(window).scroll(function () {
    $('#main-menu').css('background', (((document.documentElement && document.documentElement.scrollTop) ||
                document.body.scrollTop > 94) && ($(window).width() >= 320)) ? '#3293C7' : 'transparent')
                .css('border-width', (((document.documentElement && document.documentElement.scrollTop) ||
                            document.body.scrollTop > 94) && ($(window).width() >= 320)) ? '0 0 2px' : '0');
  });

  // Smooth Scrolling
  $('a[href*=#]:not([href=#])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top
        }, 500, "swing");
        return false;
      }
    }
  });

  // Submit the form with an ajax/jsonp request.
  // Based on http://stackoverflow.com/a/15120409/215821
  function submitSubscribeForm($form) {
    $.ajax({
      type: "GET",
      url: $form.attr("action"),
      data: $form.serialize(),
      cache: false,
      dataType: "jsonp",
      jsonp: "c", // trigger MailChimp to return a JSONP response
      contentType: "application/json; charset=utf-8",

      error: function(error){
        // According to jquery docs, this is never called for cross-domain JSONP requests
      },

      success: function(data){
        $('#mc-embedded-subscribe').removeClass('loading');
        var resultMessage = data.msg || "Sorry. Unable to subscribe. Please try again later.";

        var helper = $('.msg-helper');
        if (data.result != "success") {
          if (resultMessage && resultMessage.indexOf("already subscribed") >= 0) {
            helper.html('<i class="close icon red"></i> ' + "You're already subscribed. Thank you.");
          } else {
            if (resultMessage.split('-').length >= 2) {
              helper.html('<i class="close icon red"></i> ' + resultMessage.split('-')[1]);
            } else {
              helper.html('<i class="close icon red"></i> ' + resultMessage);
            }
          }
        } else {
          helper.html('<i class="check icon green"></i> Thank you!\nYou must confirm the subscription in your inbox.');
        }
        helper.fadeIn();
      }
    });
  }

  $("#mc-embedded-subscribe-form").submit(function(e){
    $('#mc-embedded-subscribe').addClass('loading');
    e.preventDefault();
    submitSubscribeForm($("#mc-embedded-subscribe-form"));
  });

  $('#mc-embedded-subscribe').click(function() {
    $("#mc-embedded-subscribe-form").submit();
  });

  // Initialize dropdown
  $('.ui.dropdown').dropdown();

  $('.get-quote').click(function() {
    $('#quote-modal').modal('show');
  });

  $('.right.menu.open').on("click",function(e){
   e.preventDefault();
   $('.ui.vertical.menu').fadeToggle('fast');
 });

 $('.ui.dropdown').dropdown();

 $('#send-quote').click(function() {
   $('#quote-form').submit();
 });

 $('#quote-form').on('submit', function(e) {
   e.preventDefault();
 });

 // Quote Form validation
 $('#quote-form').form({
    fields: {
      name     : 'empty',
      country  : 'empty',
      email    : 'empty',
      type     : 'empty'
    },
    keyboardShortcuts: false,
    onSuccess: function() {
      $('#send-quote').addClass('loading');
      var el = $('#quote-form');
      var request = $.post(el.prop('action'), el.serialize(), function(resp) {
        // success
        $('#send-quote').hide()
        $('#quote-status .success').fadeIn();
        setTimeout(function() {
          $('#quote-modal').modal('hide');
        }, 3000);
      });
      request.fail(function(error) {
        console.log("Error sending Quote:", error);
        $('#send-quote').hide()
        $('#quote-status .error').fadeIn();
      });
    }
  });
});
