jQuery(function($) {
  var formSelectorId = 'machines_search_form';
  var context_list = $('.search-form-list');
  var isMarklistMode = $('.machines.machines-marklist').length > 0;
  
  //Autocomplete for Search
  $("#input_search_type").autocomplete({
    source: function( request, response){
      var langcode = self.location.pathname.replace(/^\//, '').replace(/\/.*$/, '');
      var L = 0;
      if (langcode == 'en') {
        L = 1;
      }
      $.ajax({
        url: window.location.origin + '/index.php',
        type: 'GET',
        data: {
		  L: L, // __TYPO3.L,
          eID: "ajaxDispatcher",
          request: {
            pluginName: 'zepGbm',
            controller: 'Item',
            action: 'getTypeAutoComplete',
            arguments: {
              L: L, // L:__TYPO3.L,
              query: $('#input_search_type').val(),
              manufacturer: $('#input_search_producer').val(),
              category: $('#input_search_catfront').val(),
              size: $('#field_search_size select').val(),
              size_name: $('#field_search_size').find('.name').html(),
              
            }
          }
        },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data){
          $('body').append(data.responseText);
          response( $.map( data.items, function( item ) { return {  label: item.label, value: item.model  }   }) );
        },
        error: function(message){
          $('body').append(message.responseText);
          //alert(message);
          // console.log(message);
        }
      });
    },
    minLength: 1,
    appendTo: '.machines'
  });

  //Detailpage ****************************************************************************
  $('.row-up').click(function(){
    var href = $('a', $(this)).attr('href');
    window.open(href, '_self');
  });

  //Listsearch filterfunctions *************************************************************

  var machinesForm = $('#'+formSelectorId),
      listForm = $('#machines_list_form');


  //Listmodule sorting functions ******************************************************

  $('.machines .paginate a').click(function () {
    $('.current-page-number').val( $(this).data('value') );
    if ($('#machines_comparelist_form').length == 0) {
      machinesForm.submit();
    } else {
      listForm.submit();
    }
    return false;
  });
  
  $('.machines .perpage a').click(function () {
    $('.items-per-page').val( $(this).data('value') );
    if ($('#machines_comparelist_form').length == 0) {
      machinesForm.submit();
    } else {
      listForm.submit();
    }
    return false;
  });
  
  $('.machines th.cell').click(function () {
    if ($(this).hasClass('sort')) {
      if ($(this).hasClass('asc')) {
        $('.sorting-direction').val('desc');
      } else {
        $('.sorting-direction').val('asc');
      }
    }
    $('.sorting-by').val($(this).data('value'));
    if ($(this).data('checkid')) {
      $('.sorting-by-parameterID').val($(this).data('checkid'));
    }
    if ($('#machines_comparelist_form').length == 0) {
      machinesForm.submit();
    } else {
      listForm.submit();
    }
  });

  $('select.list-sorting').change(function(){
    $('.sorting-by').val($(this).val());
    $('.sorting-direction').val('asc');
    if ($(this).data('checkid')) {
      $('.sorting-by-parameterID').val($(this).data('checkid'));
    }
    if($('#machines_comparelist_form').length == 0) {
      machinesForm.submit();
    } else {
      listForm.submit();
    }
  });

  $('.machines th.cell a').click(function (e) {
    e.preventDefault();
  });

  //Listmodule mark to marklist function ***********************************************************

  var itemStorage = localStorage['markedItems'] || [],
    markedItems = new Array(),
    temp = 0,
    counter = $('.marklist .info .counter');

  var removeItemsByID = function(itemID) {
    var delID = '';
    $(markedItems).each(function( index ) {
      if ($(this)[0].id == itemID) {
        delID = index;
      }
    });
    markedItems.splice(delID, 1);
  };
  
  if (itemStorage.length > 1) {
    markedItems = JSON.parse(itemStorage);
    $(markedItems).each(function() {
        var itemID = $(this)[0].id;
        if (isMarklistMode && $('#list-machine-' +  + '-up').length < 1) {
            removeItemsByID( itemID );
        } else {
          $('.marklist .items').append('<div class="item" id="marklist-item-' + itemID + '"><img height="42" src="' +
            $(this)[0].src + '"><span class="remove">x</span><input type="hidden" name="tx_zepgbm_pi1[itemIDs][]" value="' + $(this)[0].id + '"></div>');
          var item = $('#list-machine-' + itemID + '-down .button-tomarklist');
          if (!item.hasClass('marklist-remove')) {
            item.find('a').hide();
            item.find('span').show();
          }
      }
    });
    if ($('.marklist-compare').length == 0 && markedItems.length > 0) {
      $('.marklist').show();
      counter.html(markedItems.length);
    }
  }

  var removeInit = function(selector) {
    $(selector).click(function () {
      var itemID = $(this).parent()[0].id.split('-');
      itemID = itemID[2];
      $(this).parent().remove();
      removeItemsByID(itemID);
      counter.html(markedItems.length);
      var item = $('#list-machine-' + itemID + '-down .button-tomarklist');
      if (!item.hasClass('marklist-remove')) {
        item.find('a').show();
        item.find('span').hide();
      }
      if (markedItems.length == 0) {
        $('.marklist').hide();
      }
      localStorage['markedItems'] = JSON.stringify(markedItems);
    });
  };

  $('.button-tomarklist').click(function(){
    var itemID = $(this).data('value'),
        itemImageSrc = $('#list-machine-' + itemID + '-up .image img').attr('src');


    if ( $(this).hasClass('marklist-remove') ) {
        console.log( this );
      $(this)
        .parent()
        .parent()
        .add('#list-machine-' + itemID + '-up')
        .add('.itemID-' + itemID)
        .remove();
      removeItemsByID(itemID);
    } else {
        console.log(markedItems.length);
        if (markedItems.length >= 7) {
            $( "#dialog-message-marklist-limit" ).dialog({
              modal: true,
              buttons: {
                Ok: function() {
                  $( this ).dialog( "close" );
                }
              }
            });
        } else {
          markedItems.push({'id': itemID, 'src': itemImageSrc });
          counter.html(markedItems.length);
          $('.marklist .items').append('<div class="item" id="marklist-item-' + itemID + '"><img height="42" src="' +
            $('#list-machine-' + itemID + '-up .image img').attr('src') + '"><span class="remove">x</span><input type="hidden" name="tx_zepgbm_pi1[itemIDs][]" value="' + itemID + '"></div>');
          $('.marklist').show();
          $(this).find('a').hide();
          $(this).find('span').show();
          removeInit('#marklist-item-' + itemID + ' .remove');
        }
    }
    localStorage['markedItems'] = JSON.stringify(markedItems);
    return false;
  });

  removeInit('.marklist .items .remove');


  $('.marklist .show a').click(function(e){
    e.preventDefault();
    listForm.submit();
  });


  $(".manufacturers li", context_list).click(function(){
    var val = $(this).data('value');
    if ( $(this).hasClass('act') ) {
      $(this).removeClass('act');
      $('#'+formSelectorId+'_manufacturers-' + val).remove();
    } else {
      $(this).addClass('act');
      $('<input />')
        .attr('type', 'hidden')
        .attr('name', 'tx_zepgbm_pi1[manufacturers][]')
        .attr('value', val)
        .attr('id', formSelectorId+'_manufacturers-' + val)
        .appendTo('#'+formSelectorId);
    }
    $('#'+formSelectorId).submit();
  });


  $(".locations li", context_list).click(function(){
    var val = $(this).data('value');
    if ( $(this).hasClass('act') ) {
      $(this).removeClass('act');
      $('#'+formSelectorId+'_locations-' + val).remove();
    } else {
      $(this).addClass('act');
      $('<input />')
        .attr('type', 'hidden')
        .attr('name', 'tx_zepgbm_pi1[locations][]')
        .attr('value', val)
        .attr('id', formSelectorId+'_locations-' + val)
        .appendTo('#'+formSelectorId);
    }
    $('#'+formSelectorId).submit();
  });



  $(".hours li", context_list).click(function(){
    var val = $(this).data('value');
    if ( $(this).hasClass('act') ) {
      $(this).removeClass('act');
      $('#'+formSelectorId+'_hours-' + val).remove();
    } else {
      $(this).addClass('act');
      $('<input />')
        .attr('type', 'hidden')
        .attr('name', 'tx_zepgbm_pi1[hours][]')
        .attr('value', val)
        .attr('id', formSelectorId+'_hours-' + val)
        .appendTo('#'+formSelectorId);
    }
    $('#'+formSelectorId).submit();
  });


  // Listmodules Pagination **********************************************************
  $('.perages a').click(function(e){
    e.preventDefault();
    $('.items-per-page').val($(this).data('value'));
    machinesForm.submit();
  });

//  // get Sizes, Producers and Locations for Selected Category
//  if ($('#input_search_catfront').val() > 0) {
//    getSizesLocationsManufacturersByCatfront();
//  }
  $('body').on('change', '#input_search_catfront', function() { 
    getSizesLocationsManufacturersByCatfront( this ); 
  });
  
});

function getSizesLocationsManufacturersByCatfront(obj) {
    var $ = jQuery;
    if (obj == null) {
        obj = document.getElementById('input_search_catfront');
    }
    var $obj2 = $('#input_search_size');
    var $obj = $(obj);
    var uid = $obj.find('.uid').html();
    var size = $obj2.find(':selected').val();
//    var storagePid = '11';
    var category = $obj.val();

    if (category == '') {
      $('#input_search_size').empty().attr('disabled', true);
    }
    
    // __TYPO3.L has cache problem. So then user cghange language __TYPO3.L is wrong
    var typo3Language = getLanguageIdFromURL();
    $.ajax({
        async: 'true',
        url: window.location.origin + '/index.php',
        type: 'POST',

        data: {
          L: typo3Language, // L:__TYPO3.L,
          eID: "ajaxDispatcher",
          request: {
            pluginName: 'zepGbm',
            controller: 'Category',
            action: 'getSizesLocationsManufacturers',
            arguments: {
              L: typo3Language, // L:__TYPO3.L,
              'uid': uid,
              'size': size,
              // 'storagePid': storagePid,
              'category': category
            }
          }
        },
        dataType: "json",

        success: function (result) {
            if (result.success) {
                if (typeof result.locations != undefined) {
                    $('#input_search_location').html(result.locations).attr('disabled', false);
                }
                if (typeof result.manufacturers != undefined) {
                    $('#input_search_producer').html(result.manufacturers).attr('disabled', false);
                }
                if (typeof result.size != undefined) {
                    if (result.size.select == '') {
                        $('#input_search_size').attr('disabled', true);
                    } else {
                        $('#field_search_size .name').html(result.size.sizeHeaderName);
                        $('#input_search_size').replaceWith(result.size.select).attr('disabled', false);
                    }
                } else {
                    $('#input_search_size').attr('disabled', true);
                }
                $('body').append(result.content);
            }
        },
        error: function (error) {
          $('body').append(error.responseText);
        }
      });
}

function getLanguageIdFromURL () {
    if (location.pathname.indexOf("/en/") != -1 || location.search.indexOf("L=1") != -1) {
        return 1;
    } else {
        return 0;
    }
}


