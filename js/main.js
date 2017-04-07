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

  var countryPlaceholder = {{ site.data.base.countryplaceholder | jsonify }}[lang]

  $('#contact-country').selectivity({
    items: countries,
    multiple: false,
    placeholder: countryPlaceholder
  });

  // Handle scooch carousel(s)
  $('.m-scooch').scooch({
    infinite: true
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
        test: happy.email
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
        country: $('#contact-country').selectivity('data') && $('#contact-country').selectivity('data').text,
        interests: $('#contact-interested').selectivity('data') && $.map($('#contact-interested').selectivity('data'), function(item) { return item.text })
      })
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
        $('#contact-checkbox').hide();
        $('#contact-checkbox-description').hide();
        $('#contact-submit').hide();
        $('#contact-confirmation-success').show();
      }
      if (xhr.status != 204) {
        console.log('error, status code:', xhr.status);
        $('#contact-checkbox').hide();
        $('#contact-checkbox-description').hide();
        $('#contact-submit').hide();
        $('#contact-confirmation-error').show();
      }
    }
    xhr.send(JSON.stringify(data));
  }
});

var countries = [
  'Afghanistan',
  'Albania',
  'Algeria',
  'Andorra',
  'Angola',
  'Anguilla',
  'Antigua & Barbuda',
  'Argentina',
  'Armenia',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahamas',
  'Bahrain',
  'Bangladesh',
  'Barbados',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bermuda',
  'Bhutan',
  'Bolivia',
  'Bosnia & Herzegovina',
  'Botswana',
  'Brazil',
  'Brunei Darussalam',
  'Bulgaria',
  'Burkina Faso',
  'Myanmar/Burma',
  'Burundi',
  'Cambodia',
  'Cameroon',
  'Canada',
  'Cape Verde',
  'Cayman Islands',
  'Central African Republic',
  'Chad',
  'Chile',
  'China',
  'Colombia',
  'Comoros',
  'Congo',
  'Costa Rica',
  'Croatia',
  'Cuba',
  'Cyprus',
  'Czech Republic',
  'Democratic Republic of the Congo',
  'Denmark',
  'Djibouti',
  'Dominican Republic',
  'Dominica',
  'Ecuador',
  'Egypt',
  'El Salvador',
  'Equatorial Guinea',
  'Eritrea',
  'Estonia',
  'Ethiopia',
  'Fiji',
  'Finland',
  'France',
  'French Guiana',
  'Gabon',
  'Gambia',
  'Georgia',
  'Germany',
  'Ghana',
  'Great Britain',
  'Greece',
  'Grenada',
  'Guadeloupe',
  'Guatemala',
  'Guinea',
  'Guinea-Bissau',
  'Guyana',
  'Haiti',
  'Honduras',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran',
  'Iraq',
  'Israel and the Occupied Territories',
  'Italy',
  'Ivory Coast (Cote d\'Ivoire)',
  'Jamaica',
  'Japan',
  'Jordan',
  'Kazakhstan',
  'Kenya',
  'Kosovo',
  'Kuwait',
  'Kyrgyz Republic (Kyrgyzstan)',
  'Laos',
  'Latvia',
  'Lebanon',
  'Lesotho',
  'Liberia',
  'Libya',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Republic of Macedonia',
  'Madagascar',
  'Malawi',
  'Malaysia',
  'Maldives',
  'Mali',
  'Malta',
  'Martinique',
  'Mauritania',
  'Mauritius',
  'Mayotte',
  'Mexico',
  'Moldova, Republic of',
  'Monaco',
  'Mongolia',
  'Montenegro',
  'Montserrat',
  'Morocco',
  'Mozambique',
  'Namibia',
  'Nepal',
  'Netherlands',
  'New Zealand',
  'Nicaragua',
  'Niger',
  'Nigeria',
  'Korea, Democratic Republic of (North Korea)',
  'Norway',
  'Oman',
  'Pacific Islands',
  'Pakistan',
  'Panama',
  'Papua New Guinea',
  'Paraguay',
  'Peru',
  'Philippines',
  'Poland',
  'Portugal',
  'Puerto Rico',
  'Qatar',
  'Reunion',
  'Romania',
  'Russian Federation',
  'Rwanda',
  'Saint Kitts and Nevis',
  'Saint Lucia',
  'Saint Vincent\'s & Grenadines',
  'Samoa',
  'Sao Tome and Principe',
  'Saudi Arabia',
  'Senegal',
  'Serbia',
  'Seychelles',
  'Sierra Leone',
  'Singapore',
  'Slovak Republic (Slovakia)',
  'Slovenia',
  'Solomon Islands',
  'Somalia',
  'South Africa',
  'Korea, Republic of (South Korea)',
  'South Sudan',
  'Spain',
  'Sri Lanka',
  'Sudan',
  'Suriname',
  'Swaziland',
  'Sweden',
  'Switzerland',
  'Syria',
  'Tajikistan',
  'Tanzania',
  'Thailand',
  'Timor Leste',
  'Togo',
  'Trinidad & Tobago',
  'Tunisia',
  'Turkey',
  'Turkmenistan',
  'Turks & Caicos Islands',
  'Uganda',
  'Ukraine',
  'United Arab Emirates',
  'United States of America (USA)',
  'Uruguay',
  'Uzbekistan',
  'Venezuela',
  'Vietnam',
  'Virgin Islands (UK)',
  'Virgin Islands (US)',
  'Yemen',
  'Zambia',
  'Zimbabwe'
];
