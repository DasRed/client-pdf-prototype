var map;

function gmapsInitialize() {
  var locationPoint = new google.maps.LatLng(51.490194,6.841612);
  var mapOptions = {
    zoom: 12,
    center: locationPoint,
    mapTypeId: google.maps.MapTypeId.HYBRID
  }
  map = new google.maps.Map(document.getElementById("machines_map_canvas"), mapOptions);

  var marker = new google.maps.Marker({
    position: locationPoint
  });

  marker.setMap(map);
}


