/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas, David Knight. Dual MIT/BSD license */

window.matchMedia || (window.matchMedia = function() {
    "use strict";

    // For browsers that support matchMedium api such as IE 9 and webkit
    var styleMedia = (window.styleMedia || window.media);

    // For those that don't support matchMedium
    if (!styleMedia) {
        var style       = document.createElement('style'),
            script      = document.getElementsByTagName('script')[0],
            info        = null;

        style.type  = 'text/css';
        style.id    = 'matchmediajs-test';

        script.parentNode.insertBefore(style, script);

        // 'style.currentStyle' is used by IE <= 8 and 'window.getComputedStyle' for all other browsers
        info = ('getComputedStyle' in window) && window.getComputedStyle(style, null) || style.currentStyle;

        styleMedia = {
            matchMedium: function(media) {
                var text = '@media ' + media + '{ #matchmediajs-test { width: 1px; } }';

                // 'style.styleSheet' is used by IE <= 8 and 'style.textContent' for all other browsers
                if (style.styleSheet) {
                    style.styleSheet.cssText = text;
                } else {
                    style.textContent = text;
                }

                // Test if media query is true or false
                return info.width === '1px';
            }
        };
    }

    return function(media) {
        return {
            matches: styleMedia.matchMedium(media || 'all'),
            media: media || 'all'
        };
    };
}());

/* global jQuery */
/**
 * Clones the Main menu for mobile use and inits interactions
 */
jQuery(function ($) {
  var selectorSrc = '.l-header-nav-primary';
  var selectorTgt = '.page-header';
  var $o = $(selectorSrc);

  var toggleMobileMenu = function () {
    $('#header-navigation-mobile').toggleClass('active')
      .children('div')
      .each(function () {
        if ($('#header-navigation-mobile').hasClass('active')) {
          $(this).height($(this).data('height'));
        } else {        
          $(this).find('.header-navigation-mobile ul').height(0);
          $(this).height(0);
        }
      });
    $('body').toggleClass('noscroll');
  };


  $o.clone()
    .attr('id', 'header-navigation-mobile')
    .attr('class', 'header-navigation-mobile')
    .wrap('<div class="columns small-8">')
    .after('<div id="mobile-menu-overlay">')
    .parent()
    .wrap('<div class="row">')
    .parent()
    .wrap('<div class="container mobile">')
    .parent()

  //.appendTo($(selectorTgt))
    .prependTo('.l-container')

  .find('#mobile-menu-overlay')
    .on('click', toggleMobileMenu)
    .end()
  // submenu on/off
  .find('.header-navigation-mobile ul')
    .each(function () {
      // save height in data
      $(this).data('height', $(this).actual('height'))
        .css({
          height: 0,
          display: 'block'
        });
    })
    .parent()
    .on('click', function (e) {
      if (e.target != $(this).children('a').get(0)) {
        return;
      }
      // others should be hidden
      $(this).siblings().children('.header-navigation-mobile ul').height(0);
      var $c = $(this).children('.header-navigation-mobile ul');
      // toggle height of submenu
      if ($c.height() === 0) {
        $c.height($c.data('height'));
        $c.closest('div').height($c.closest('div').data('height') + $c.data('height'));
      } else {
        $c.closest('div').height($c.closest('div').data('height'));
        $c.height(0);
      }
      e.preventDefault();
    })
    .end()
    .end()

  // menu on/off
  .find('h2').on('click', toggleMobileMenu)
    .siblings('div')
    .each(function () {
      $(this).data('height', $(this).actual('height'));
      $(this).height(0);
    })
    .end()
    .end();


});

// This is for the submenu
jQuery(function ($) {

  var mediaQuery = '(max-width: 960px)'
  
  // set the full menu in an active state
  // unfold the menu inactive items
  var setMenuActive = function (e) {
    if ( matchMedia(mediaQuery).matches ) {
      $('li', this).each(function () {
        $(this).height($(this).data('height'));
      })
        if ( !$(this).hasClass('chosen') ) {
            $(this).addClass('chosen');
        }
      $(this).addClass('active');
      e.preventDefault();
      e.stopImmediatePropagation();
      e.stopPropagation();
    }
  };


  var unsetMenuActive = function (e) {
    if ( matchMedia(mediaQuery).matches ) {
      $('.column-menu-secondary.active')
        .removeClass('active')
        .find('li').each(function () {
          $(this).height('');
        })
      // e.preventDefault();
      // e.stopImmediatePropagation();
      // e.stopPropagation();
    }
  };


  var ignore = function (e) {
    if ( matchMedia(mediaQuery).matches ) {
        $(this).closest('.column-menu-secondary').find('li.current').removeClass('current')

        $(this).closest('li').addClass('current');
        unsetMenuActive.call(this, e);
//        e.stopPropagation();
//        e.stopImmediatePropagation();
    }
  }

  var presetDataHeight = function() {
    $('li', '.column-menu-secondary').each(function () {

      
        if ($(this).hasClass('has-children')) {
            //$(this).find('.header-navigation-mobile ul').height(0);
            //$(this).height(0);
        } else {        
            $(this).css('height', 'auto');
            $(this).data('height', $(this).actual('height'));
            $(this).css('height', '');
        }
    })
  }

  $('body').on('click', '.column-menu-secondary.active a:not(.current)', ignore);
  $('body').on('click', '.column-menu-secondary:not(.active)', setMenuActive);
  $('body').on('click', '.column-menu-secondary.active .after', unsetMenuActive);
//  $('body').on('click', unsetMenuActive);

  // $('.column-menu-secondary').each(function() {
    // $('<div class="after"><div class="inner"></div></div>').appendTo(this);
  // });

  presetDataHeight();
  $(window).on('resize', presetDataHeight);

});






