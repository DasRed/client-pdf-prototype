jQuery(function($) {
  $(".news-carousel").carousel({
    itemsPerPage: 3,
    itemsPerTransition: 1, // number of items moved with each transition
    noOfRows: 1,
    nextPrevLinks: true,
    pagination: false,
    speed: 'fast',
    easing: 'swing', // supports the $ easing plugin
    nextText: '',
    prevText: ''
  });

  // resize images in carousel
  //        $(".news-carousel img").height ('auto');
  $(".news-carousel img").height ('40px');
  //        $(".news-carousel img").width ('58px');
  $(".news-carousel img").width ('auto');

  // all images are lightwindow, but we need it onclick to show above carousel and then be onclick lightwindow.
  // so take all li, get lightwindow links and images.
  // then put only images, with onclick cloning itself with lightwindow link into big image box
  var carouselItems = $(".news-carousel li");

  var c = 0;
  var cc = 0;

  carouselItems.each(function(index) {
    var a = $(this).find('a');
    var img = $(this).find('img');

    // put first image into big image view box
    var current = $(a).clone();
    $(current).find('img').width('auto');
    $(current).find('img').height('auto');
    //current.appendTo( $('.news-image-current') );
    $(carouselItems).find('img').removeClass('act');
    $(img).addClass('act');

    $(carouselItems).find('a').removeClass('lightwindow');
    $(carouselItems).find('a').addClass('lightwindow inactive');
    current.appendTo( $('.news-image-current') );

    $('.news-image-current a').fancybox({

      'beforeLoad' : function() {
        $('.news-image-current').children().not('.inactive').addClass('inactive');
        $('.news-image-current').children().eq(this.index).removeClass('inactive');
        //Slider
        var carousel = $.data($('.news-carousel').get(0), 'carousel');
        carousel.itemIndex = this.index-1;
        if (carousel.noOfItems > carousel.options.itemsPerPage) {
          carousel.animate();
        }
        $(carouselItems).find('img').removeClass('act');
        $(carouselItems).eq(this.index).find('img').addClass('act');
      }

    });
    //}
    //c++;


    // make image onclick replace big image with fancyboxable itself
    $(img).click(function()  {
      //$(this).parent().removeClass('inactive');
      $('.news-image-current').children().not('.inactive').addClass('inactive');
      $('.news-image-current').children().eq(index).removeClass('inactive');

      $(carouselItems).find('img').removeClass('act');
      $(img).addClass('act');
    });

    // clear li and put img into it
    $(this).html();
    $(img).css('cursor', 'pointer');
    $(img).appendTo(this);
  });
});


