angular.module('starter.map', [])

  .controller('MapCtrl', function ($scope, $rootScope, $state, stateService, notificationsService) {
      $scope.currentItem = function () {
        return stateService.currentItem();
      };
      var mapOptions = {
        zoom: 15,
        type: "terrain"
      };

      showMap();

      $scope.$on('$stateChangeSuccess',
        function (event, toState, toParams, fromState, fromParams) {
          if (toState.name === "tab.details") {
            showMap();
          }
        });
      $scope.$on('logout', function (event) {
        console.map('on logout');
        $scope.map = undefined;
        $scope.marker = undefined;

      });

      function showMap() {
        if (stateService.currentItem()) {

          var location = stateService.currentItem().LastLocation;
          if (location) {
            mapOptions.center = new google.maps.LatLng(location.Lat, location.Lng);
            if (!$scope.map) {
              var element = document.getElementById('map');
              $scope.map = new google.maps.Map(element,
                mapOptions);

              google.maps.event.addListenerOnce($scope.map, 'idle', function () {

                $scope.marker = new google.maps.Marker({
                  map: $scope.map,
                  animation: google.maps.Animation.DROP,
                  position: mapOptions.center
                });
              });
            } else {
              $scope.map.setCenter(mapOptions.center);
            }
            if ($scope.marker) {
              $scope.marker.setPosition(mapOptions.center);
            }
          }

        }
      }
    }
  );

