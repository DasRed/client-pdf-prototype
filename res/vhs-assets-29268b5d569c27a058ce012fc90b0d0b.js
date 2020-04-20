var gmapsInitialized = false;
jQuery(function($) {
  $('.tab-map').click(function() {
    if ( !gmapsInitialized ) {
      gmapsInitialize();
      gmapsInitialized = true;
    }
  });

  $('.l-content-container-products-detailview .l-breadcrumbs li').last().remove();
  // $('#category_link a')
  $('#frontCategoryPageLink a')
  .appendTo( $('.l-content-container-products-detailview .l-breadcrumbs ul'))
  .wrap('<li></li>');
  
  $('<a href="'+document.location+'"></a>')
  .html($('.machines .single .header h1').html())
  .appendTo( $('.l-content-container-products-detailview .l-breadcrumbs ul'))
  .wrap('<li class="last"></li>');

  if (location.hash.indexOf('|tab_map') != -1){
    $('.tab-map').click();
  }
});


