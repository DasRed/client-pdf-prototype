jQuery(function($) {
  var parseXML = function (xml) {
    var price = jQuery('#price-currency').data('price');
    var langKey = jQuery('#price-currency').data('langkey');
    if (langKey == 'd') {
      jQuery.format.locale({number: {groupingSeparator: '.', decimalSeparator: ','}});
    }

    jQuery(xml)
      .find('Cube[currency]')
      .each(function () {
//        console.log($(this).attr('currency'), $(this).attr('rate'))

        jQuery('#price-currency')
          .append('<option value="~ ' + jQuery.format.number((price * jQuery(this).attr('rate')), '#,##0.00') + ' ' + jQuery(this).attr('currency') + '">' + jQuery(this).attr('currency') + '</option>')
        //
      })
  }

  jQuery.ajax({
    type: 'GET',
    url: './res/eurofxref-daily.xml',
    dataType: 'xml',
    success: parseXML
  });

  jQuery('#price-currency').change(function () {
    jQuery('.price_calculated .value').html(jQuery(this).val());
  })
  
  localStorage['markedItems'] = localStorage['markedItems'] || [];
  var 
    newhref = $('#showmode-marklist-link a').attr('href'),
    markedItems = [],
    currentItemId = $('#add_to_watchlist').attr('data-item-id');
  
  generateMarklistLink = function() {
      var currentItemIsInTheLocalStorage = false;
      if (localStorage['markedItems'].length > 1) {
        markedItems = JSON.parse( localStorage['markedItems'] );
        for (var item in markedItems) {
            newhref += '&tx_zepgbm_pi1[itemIDs][]=' + markedItems[item].id;
            if (currentItemId == markedItems[item].id) {
                currentItemIsInTheLocalStorage = true;
            }
        }
        $('#showmode-marklist-link a').attr('href', newhref);
        $('#showmode-marklist-link .counter').html('(' + markedItems.length + ')');
        $('#showmode-marklist-link').show();
      }
      if (currentItemIsInTheLocalStorage) {
        $('#add_to_watchlist').hide();
      } else {
        $('#add_to_watchlist').show();
      }
  };
  generateMarklistLink();
  
  jQuery('#add_to_watchlist').click(function(){
    var newItem = {id: currentItemId,  src: $(this).attr('data-item-image') };
    markedItems.push(newItem);
    localStorage['markedItems'] = JSON.stringify(markedItems);
    generateMarklistLink();
    return false;
  });
  
});


