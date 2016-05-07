angular.module('starter.map', [])

  .controller('MapCtrl', function ($scope, $state, stateService, notificationsService) {

    $scope.currentItem = function () {
      return stateService.currentItem();
    };
    var mapOptions = {
      zoom: 15,
      type: "terrain"
    };

    $scope.$on('$stateChangeSuccess',
      function (event, toState, toParams, fromState, fromParams) {
        // console.log(toState);
        if (toState.name === "tab.details") {
          showMap();
        }
      });
    function showMap() {
      if (stateService.currentItem()) {

        var location = stateService.currentItem().LastLocation;
        if (location) {
          mapOptions.center = new google.maps.LatLng(location.Lat, location.Lng);
          if (!$scope.map) {

            $scope.map = new google.maps.Map(document.getElementById('map'),
              mapOptions);
          } else {
            $scope.map.setCenter(mapOptions.center);
          }
          if (!$scope.marker) {
            $scope.marker = new google.maps.Marker(
              {
                map: $scope.map,
                animation: google.maps.Animation.DROP,
                position: mapOptions.center
              })
          }else{
            $scope.marker.setPosition(mapOptions.center);
          }

        }
      }
    }

  })
;
