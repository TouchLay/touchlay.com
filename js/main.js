$(document).ready(function() {

  // Language detection
  var language = window.navigator.userLanguage || window.navigator.language;
  if (language.search(/de/) === 0) {
    window.location = 'index.de.html';
  }
  $(document).ready(function() {
    $("a[href='" + window.location.hash + "']").addClass("active");
    //$('#header').data('size', 'big');
    $('#arrow').click(function() {
      $('html,body').animate({
        scrollTop: '1390px'
      }, 800);
    });
  });

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

  $(window).scroll(function () {
    var $nav = $('#main-menu');
    if ($('body').scrollTop() > 94 && $(window).width() >= 692) {
      if ($nav.data('size') == 'big') {
        $nav.data('size', 'small');
        $nav.css('background', '#3293C7').css('padding-top', '12px').css('box-shadow', '0px 0px 2px rgba(0,0,0,.4)');;
        $nav.find('a.item').css('text-shadow', 'none');
      }
    } else {
      if ($nav.data('size') == 'small') {
        $nav.data('size', 'big');
        $nav.css('background', 'rgba(0,0,0,0)').css('padding-top', '20px').css('box-shadow', 'none');
        $nav.find('a.item').css('text-shadow', '0px 0px 2px rgba(0,0,0,.4)');
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
          helper.removeClass('success');
          helper.addClass('error');
          if (data.msg && data.msg.indexOf("already subscribed") >= 0) {
            helper.text("You're already subscribed. Thank you.");
          } else {
            if (data.msg.split('-').length >= 2) {
              helper.text(data.msg.split('-')[1]);
            } else {
              helper.text(data.msg);
            }
          }
        } else {
          helper.removeClass('error');
          helper.addClass('success');
          helper.text("Thank you!\nYou must confirm the subscription in your inbox.");
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

  // Lazy loading images
  $(".lazy").lazyload({
    threshold : 200
  });

  // Initialize dropdown
  $('.ui.dropdown').dropdown();

  $('.get-quote').click(function() {
    $('#quote-modal').modal('show');
  });

});
