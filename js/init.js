/*
@licstart
Copyright (C) 2016 u451f

    The JavaScript code in this page is free software: you can
    redistribute it and/or modify it under the terms of the GNU
    General Public License (GNU GPL) as published by the Free Software
    Foundation, either version 3 of the License, or (at your option)
    any later version.  The code is distributed WITHOUT ANY WARRANTY;
    without even the implied warranty of MERCHANTABILITY or FITNESS
    FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.

    As additional permission under GNU GPL version 3 section 7, you
    may distribute non-source (e.g., minimized or compacted) forms of
    that code without the copy of the GNU GPL normally required by
    section 4, provided you include this license notice and a URL
    through which recipients can access the Corresponding Source.
@licend
*/

$(document).ready(function($) {

    // antispam
    $('a.mail').each(function() {
      e = this.rel.replace('//','@');
      this.title = '';
      this.href = 'mailto:' + e;
      $(this).html(e);
    });

    // if there is a hash in the URL, scroll to corresponding part
    $(window).bind('load', function () {
        if(location.hash !== "undefined") {
            var url = document.location.href;
            scrollToElm(url);
            $('.page-link').each(function() {
                var link = $(this).attr('href');
                var parts = link.split("#");
                var trgt = parts[1];
                if(location.hash == "#"+trgt) {
                    console.log(trgt + "trgt");
                    $(this).addClass('current');
                }
            });
        }
    });

    // menu
    $('.page-link').click(function(event){
        $('.page-link').removeClass('current');
        $(this).addClass('current');
        var url = $(this).attr('href');
        scrollToElm(url);
    });

    // activate menu elements when they appear in the window
    // for this to work, the A needs a rel="id"
    $( window ).scroll(function() {
      $('.page-link').each(function() {
        var rel = $(this).attr('rel');
        if(rel != undefined) {
          if(isScrolledIntoView('#'+rel)) {
          console.log("rel "+rel);
              $('.page-link').removeClass('current');
              $(this).addClass('current');
          }
        }
      });
    });
});

// mailer
$(function() {
    // Get the form.
    var form = $('#catnip_form');
    var formMessages = $('#form-messages');
    $(form).submit(function(event) {
        event.preventDefault();
        $.ajax({
            type: "POST",
            url: $(form).attr('action'),
            data: $(form).serialize(),
        })
        .done(function(response) {
            $(formMessages).removeClass('error');
            $(formMessages).addClass('success');
            $(formMessages).text(response);
            $('#email').val('');
            //$('#name').val('');
            //$('#message').val('');
        })
        .fail(function(data) {
            $(formMessages).removeClass('success');
            $(formMessages).addClass('error');

            if (data.responseText !== '') {
                $(formMessages).text(data.responseText);
            } else {
                $(formMessages).text('Oops! An error occured and your message could not be sent.');
            }
        })
    });
});

function scrollToElm(url) {
    var parts = url.split("#");
    var trgt = parts[1];
    var offset = $('.site-nav').outerHeight();
    if(trgt != undefined) {
        //event.preventDefault();
        $('html,body').animate({scrollTop:$('#'+trgt).offset().top - offset}, 500);
    }
}

// check if an element becomes visible from the bottom of the screen
function isScrolledIntoView(elem) {
    var elementTop = $(elem).offset().top;
    var elementBottom = elementTop + $(elem).outerHeight();
    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();
    // return if element is starting to be visible at the bottom
    return elementBottom > viewportTop && elementTop < viewportBottom;
}

// adjust video sizes
function adjustIframes() {
  $('iframe').each(function(){
    var
    $this       = $(this),
    proportion  = $this.data( 'proportion' ),
    w           = $this.attr('width'),
    actual_w    = $this.width();

    if ( ! proportion ) {
        proportion = $this.attr('height') / w;
        $this.data( 'proportion', proportion );
    }

    if ( actual_w != w ) {
        $this.css( 'height', Math.round( actual_w * proportion ) + 'px' );
    }
  });
}

$(window).on('resize load',adjustIframes);
