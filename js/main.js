---
---

document.body.className = document.body.className.replace("no-js","js") // set that we have js
var lang = $('body').data('lang') // get current langauge

// detect language and forwared to right language (only from /index.html)
if (location.pathname == "/") {
  var browserLang = window.navigator.userLanguage || window.navigator.language;
  window.location.href = (browserLang === 'de') ? '/de/' : '/en/'
}

$(document).ready(function() {
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
            helper.addClass('success')
            $('#mc-embedded-subscribe-form').css('display', 'none')
            $('.newsletter-description').css('display', 'none')
            helper.html("You're already subscribed. Thank you.");
          } else {
            helper.addClass('error')
            if (resultMessage.split('-').length >= 2) {
              helper.html(resultMessage.split('-')[1]);
            } else {
              helper.html(resultMessage);
            }
          }
        } else {
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
    $.fn.cookie('cookie-banner-dismissed', true)
    $('.cookie-banner').hide();
  })


  // Handle autocomplete
  var autocompleteElements = $.map({{ site.data.base.interessts | jsonify }}[lang], function(item, index) {
    return { id: index + 1, text: item };
  })
  var placeholder = {{ site.data.base.interesstsplaceholder | jsonify }}[lang]

  // Handle preselected interessts
  var preInteressts = $('body').data('interessts')
  if (preInteressts) {
    var preselect = $.map(preInteressts.split(','), function(item){
      return autocompleteElements[item]
    })
  }

  $('#contact-interested').selectivity({
    items: autocompleteElements,
    multiple: true,
    placeholder: placeholder,
    data: preInteressts && (preselect || [])
  });

  $('#contact-country').selectivity({
    items: autocompleteElements,
    multiple: true,
    placeholder: placeholder,
    data: preInteressts && (preselect || [])
  });

  // Handle scooch carousel(s)
  $('.m-scooch').scooch()

  // Validate Contact form
  var happy = {
    email: function (val) {
        return /^(?:\w+\.?\+?)*\w+@(?:\w+\.)+\w+$/.test(val);
    },
    maxLength: function (val, length) {
        return val.length <= length;
    },
  };
  $('#contact-form').isHappy({
    fields: {
      '#contact-name': {
        required: true,
      },
      '#contact-country': {
        required: true,
      },
      '#contact-message': {
        test: function(val) { return happy.maxLength(val, 5000) },
        message: 'Message is too long!'
      },
      '#contact-email': {
        required: true,
        test: happy.email
      }
    }
  });

  // Handle contact form request
  function sendInquiry (data) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://inquirer.exp.touchlay.com/', true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 204) {
        console.log('success');
      }
      if (xhr.status != 204) {
        console.log('error, status code:', xhr.status);
      }
    }
    xhr.send(JSON.stringify(data));
  }


  $('#contact-form').submit(function(ev) {
    ev.preventDefault()
    // add to newsletter if checkbox is checked
    if ($('#checkbox-newsletter').prop('checked')) {
      submitSubscribeForm('EMAIL=' + encodeURIComponent($('#contact-email').val()));
    }

    sendInquiry({
      name: $('#contact-name').val(),
      email: $('#contact-email').val(),
      message: $('#contact-message').val(),
      country: $('#contact-country').val(),
      interests: $.map($('#contact-interested').selectivity('data'), function(item) { return item.text })
    })
  })
});
