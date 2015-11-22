'use strict';

var parcelAnsApp = angular.module('parcelAnsApp', ['firebase','angulike'] );
parcelAnsApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/parcels', {
      templateUrl: 'partials/parcel-list.html',
      controller: 'parcelList'
    }).
    when('/parcels/new', {
      templateUrl: 'partials/parcel-form.html',
      controller: 'parcelNew'
    }).
    when('/parcels/:parcelId', {
  templateUrl: 'partials/parcel-form.html',
  controller: 'parcelDetail'
}).
    otherwise({
      redirectTo: '/parcels'
    });
}]);

parcelAnsApp.directive('areaBasedGoogleMap', function () {
    return {
        restrict: "A",
        template: "<div id='areaMap'></div>",
        scope: {
            area: "=",
            zoom: "="
        },
        controller: function ($scope) {
            var mapOptions;
            var map;
            var marker;

            var initialize = function () {
                mapOptions = {
                    zoom: $scope.zoom,
                    center: new google.maps.LatLng(40.0000, -98.0000),
                    mapTypeId: google.maps.MapTypeId.TERRAIN
                };
                map = new google.maps.Map
(document.getElementById('areaMap'), mapOptions);
            };

            var createMarker = function (area) {
                var position = new google.maps.LatLng
(area.Latitude, area.Longitude);
                map.setCenter(position);
                marker = new google.maps.Marker({
                    map: map,
                    position: position,
                    title: area.Name
                });
            };

            $scope.$watch("area", function (area) {
                if (area != undefined) {
                    createMarker(area);
                }
            });

            initialize();
        },
    };
});

parcelAnsApp.directive('addressBasedGoogleMap', function () {
    return {
        restrict: "A",
        template: "<div id='addressMap'></div>",
        scope: {
            address: "=",
            zoom: "="
        },
        controller: function ($scope) {
            var geocoder;
            var latlng;
            var map;
            var marker;
            var initialize = function () {
                geocoder = new google.maps.Geocoder();
                latlng = new google.maps.LatLng(-34.397, 150.644);
                var mapOptions = {
                    zoom: $scope.zoom,
                    center: latlng,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                map = new google.maps.Map
(document.getElementById('addressMap'), mapOptions);
            };
            var markAdressToMap = function () {
                geocoder.geocode({ 'address': $scope.address },
                function (results, status)
                  {
                    if (status == google.maps.GeocoderStatus.OK) {
                        map.setCenter(results[0].geometry.location);
                        marker = new google.maps.Marker({
                            map: map,
                            position: results[0].geometry.location
                        });
                    }
                });
            };
            $scope.$watch("address", function () {
                if ($scope.address != undefined) {
                    markAdressToMap();
                }
            });
            initialize();
        },
    };
});


parcelAnsApp.filter('orderObjectBy', function(){
 return function(input, attribute) {
    if (!angular.isObject(input)) return input;

    var array = [];
    for(var objectKey in input) {
        array.push(input[objectKey]);
    }

    array.sort(function(a, b){
        a = parseInt(a[attribute]);
        b = parseInt(b[attribute]);
        return b - a;
    });
    return array;
 }
});

parcelAnsApp.controller('parcelList', ['$scope', '$firebase', function($scope, $firebase) {
  var firebaseUrl = "https://parcels.firebaseio.com/parcels";
  $scope.parcels = $firebase(new Firebase(firebaseUrl));
  $scope.orderByAttribute = '';
  $scope.deleteparcel = function(parcelId) {
  $scope.parcels.$remove(parcelId);
}

$scope.total = function() {
            return $scope.parcels.$id.length
      }
}]);


parcelAnsApp.controller('parcelNew', ['$scope', '$firebase', '$location', function($scope, $firebase, $location) {
  $scope.parcel = {};

  $scope.persistparcel = function(parcel) {
    var firebaseUrl = "https://parcels.firebaseio.com/parcels";
    $scope.parcels = $firebase(new Firebase(firebaseUrl));
    $scope.parcels.$add(parcel).then(function(ref) {
  $location.url('/parcels');
    });
  };
}]);



parcelAnsApp.controller('parcelDetail', ['$scope', '$firebase', '$routeParams', function($scope, $firebase, $routeParams) {
  debugger
  var firebaseUrl = "https://parcels.firebaseio.com/parcels/" + $routeParams.parcelId;
  $scope.parcel = $firebase(new Firebase(firebaseUrl));
  $scope.persistparcel = function(parcel) {
    $scope.parcel.$update({
      parcel: parcel.parcel,
      weight: parcel.weight,
      value: parcel.Value,
      type: parcel.Type,
      date: parcel.date,
      color:parcel.Color,
      Area:parcel.Area,
      Address:parcel.Address,
      quantity:parcel.quantity

    }).then(function(ref) {
      $location.url('/parcels');
    });
  };
}]);

