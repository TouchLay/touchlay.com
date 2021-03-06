---
---

{% include_relative zepto/zepto.min.js %}
{% include_relative zepto/zepto.cookie.min.js %}
{% include_relative zepto/scooch.min.js %}
{% include_relative zepto/zepto.happy.js %}

{% include_relative lazysizes/lazysizes.min.js %}
{% include_relative lity/lity.min.js %}
{% include_relative selectivity/selectivity-jquery.min.js %}

document.body.className = document.body.className.replace("no-js","js") // set that we have js
var lang = $('body').data('lang') // get current langauge

// detect language and forwared to right language (only from /index.html)
if (location.pathname == "/") {
  var browserLang = window.navigator.userLanguage || window.navigator.language;
  window.location.href = (browserLang === 'de') ? '/de/' : '/en/'
}

// turns the navigation bar blue when the user scrolls
function checkScroll () {
  document.body.classList[
    window.scrollY > 20 ? 'add' : 'remove'
  ]('scrolled')
}

checkScroll()
window.addEventListener('scroll', checkScroll)

// show image fallback if video cannot autoplay
var video = document.getElementById('moodvideo')

function videoReady () {
  video.style = ''
  var img = document.getElementById('moodvideo-fallback')
  img.style = 'display: none'
}

$(document).ready(function() {
  // detect if autoplay fails
  if (video) {
    if (!(video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2)) { // check if video is not playing
      var promise = video.play()
      if (promise !== undefined) {
        promise
          .then(videoReady) // replace img with video
          .catch(err => console.error('autoplay failed:', err))
      } else {
        console.error('autoplay failed')
      }
    } else { // video is already autoplaying
      videoReady()
    }
  }

  // on tab focus, restart video if it was paused by the browser
  $(window).focus(function () {
    if (video.paused || video.ended || video.readyState <= 2) {
      video.pause()
      video.currentTime = 0
      video.play()
    }
  })

  // Submit the form with an ajax/jsonp request.
  // Based on http://stackoverflow.com/a/15120409/215821
  function submitSubscribeForm(data) {
    $.ajax({
      type: "GET",
      url: '//touchlay.us6.list-manage.com/subscribe/post-json?u=61192115196961388ececdeb1&amp;id=7425f66543',
      data: data,
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

        var helper = $('.newsletter-response');
        if (data.result != "success") {
          if (resultMessage && resultMessage.indexOf("already subscribed") >= 0) {
            ga('send', 'event', 'newsletter', 'alreadySubscribed')
            helper.addClass('success')
            $('#mc-embedded-subscribe-form').css('display', 'none')
            $('.newsletter-description').css('display', 'none')
            helper.html("You're already subscribed. Thank you.");
          } else {
            ga('send', 'event', 'newsletter', 'error', resultMessage)
            helper.addClass('error')
            if (resultMessage.split('-').length >= 2) {
              helper.html(resultMessage.split('-')[1]);
            } else {
              helper.html(resultMessage);
            }
          }
        } else {
          ga('send', 'event', 'newsletter', 'success')
          helper.addClass('success')
          $('#mc-embedded-subscribe-form').css('display', 'none')
          $('.newsletter-description').css('display', 'none')
          helper.html('Thank you!\nYou must confirm the subscription in your inbox.');
        }
        helper.css('display', 'block');
      }
    });
  }

  $("#mc-embedded-subscribe-form").submit(function(e){
    $('#mc-embedded-subscribe').addClass('loading');
    e.preventDefault();
    submitSubscribeForm($("#mc-embedded-subscribe-form").serialize());
  });

  $('#mc-embedded-subscribe').click(function() {
    $("#mc-embedded-subscribe-form").submit();
  });

  // Handle cookie dialog
  if ($.fn.cookie('cookie-banner-dismissed')) { $('.cookie-banner').hide(); }
  else { $('.cookie-banner').show(); }

  $('#accept-cookie').click(function() {
    ga('send', 'event', 'cookieBanner', 'dismissed')
    $.fn.cookie('cookie-banner-dismissed', true, { expires: 365 })
    $('.cookie-banner').hide();
  })


  // Handle autocomplete
  var autocompleteElements = $.map({{ site.data.base.interests | jsonify }}[lang], function(item, index) {
    return { id: index + 1, text: item };
  })
  var placeholder = {{ site.data.base.interestsplaceholder | jsonify }}[lang]

  // Handle preselected interests
  var preInterests = $('body').data('interests')
  if (preInterests) {
    var preselect = $.map(String(preInterests).split(','), function(item){
      return autocompleteElements[item]
    })
  }

  $('#contact-interested').selectivity({
    items: autocompleteElements,
    multiple: true,
    placeholder: placeholder,
    data: preInterests && (preselect || [])
  });

  var countryPlaceholder = {{ site.data.base.countryplaceholder | jsonify }}[lang]

  $('#contact-country').selectivity({
    items: {{ site.data.countries | jsonify }}[lang],
    multiple: false,
    placeholder: countryPlaceholder
  });

  // Handle scooch carousel(s)
  $('.m-scooch').scooch({
    infinite: true,
    autoplay: {interval: 5000, cancelOnInteraction: true}
  })

  // Validate Contact form
  var happy = {
    email: function (val) {
        return /^(?:\w+\.?\+?)*\w+@(?:\w+\.)+\w+$/.test(val);
    },
    maxLength: function (val, length) {
        return val.length <= length;
    },
  };
  var EMAIL_REGEX = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  $('#contact-form').isHappy({
    fields: {
      '#contact-name': {
        required: true,
      },
      /*'#contact-country .selectivity-single-select-input': {
        required: true,
      },*/
      '#contact-message': {
        test: function(val) { return happy.maxLength(val, 5000) },
        message: 'Message is too long!'
      },
      '#contact-email': {
        required: true,
        test: function(val) { return EMAIL_REGEX.test(val) }
      }
    },
    /*unHappy: function (ev) {
      ev.preventDefault();

      // set "unhappy" class on auto-complete input
      if ($('#contact-country .selectivity-single-select-input').hasClass('unhappy')) {
        $('#contact-country .selectivity-single-select').addClass('unhappy')
      }
    },*/
    happy: function(ev) {
      ev.preventDefault();

      // add to newsletter if checkbox is checked
      if ($('#checkbox-newsletter').prop('checked')) {
        submitSubscribeForm('EMAIL=' + encodeURIComponent($('#contact-email').val()));
      }

      sendInquiry({
        name: $('#contact-name').val(),
        email: $('#contact-email').val(),
        message: $('#contact-message').val(),
        from: window.location.pathname,
        country: $('#contact-country').selectivity('data') && $('#contact-country').selectivity('data').text,
        interests: $('#contact-interested').selectivity('data') && $.map($('#contact-interested').selectivity('data'), function(item) { return item.text })
      })
    }
  });

  // Handle contact form request
  function sendInquiry (data) {
    console.log('sending inquiry...')
    $('#contact-checkbox').hide();
    $('#contact-checkbox-description').hide();
    $('#contact-submit').hide();
    $('#contact-confirmation-loading').show();

    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://inquirer.touchlay.com/', true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 204) {
        ga('send', 'event', 'inquiry', 'success');
        goog_report_conversion('https://touchlay.com');
        console.log('inquiry sent :)');
        $('#contact-confirmation-loading').hide();
        $('#contact-confirmation-success').show();
      }
      if (xhr.status != 204) {
        ga('send', 'event', 'inquiry', 'error')
        console.log('error, status code:', xhr.status);
        $('#contact-confirmation-loading').hide();
        $('#contact-confirmation-error').show();
      }
    }
    xhr.send(JSON.stringify(data));
  }

  // handle cta highlight
  $('.cta-highlight').click(function() {
    $('#contact-form').addClass('highlight')
    setTimeout(function() {
      $('#contact-form').removeClass('highlight')
    }, 1000)
  })
});
