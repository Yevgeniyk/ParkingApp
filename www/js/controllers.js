angular.module('starter.controllers', [])


  .controller('CarsCtrl', function ($scope, $state, $stateParams, $rootScope, mojioService, notificationsService, stateService) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});
    $scope.observe = false;
    $scope.MPH = 80;
    $scope.RPM = 1000;
    $scope.watch = false;
    $scope.observerEvents = [];
    $scope.watchEvents = [];
    var lastContactTime = {};
    $scope.watchSpinner = false;
    var rootScope = $rootScope;

    //  var state = $state;
//    var stateParams = $stateParams;
    $rootScope.$on('logout', function () {
      $scope.observerEvents =[];
      $scope.watchEvents =[];
      stateService.setCurrentItem(undefined);

    });

    $scope.$on('$stateChangeSuccess',
      function (event, toState, toParams, fromState, fromParams) {
        if (toParams.from === 'login') {
          $scope.getVehicle();
        }
      });

    $scope.onCarsClick = function () {
      if (mojioService.isLogged()) {
        $state.go('tab.cars', {});
      }
    };
    $scope.onObserveClick = function () {
      if (mojioService.isLogged()) {
        $state.go('tab.observe', {});
      }
    };
    $scope.onWatchClick = function () {
      if (mojioService.isLogged()) {
        $state.go('tab.watch', {});
      }
    };
    $scope.onDetailsClick = function () {
      if (mojioService.isLogged()) {
        $state.go('tab.details', {});
      }
    };

    $scope.getVehicle = function () {
      mojioService.getVehicles(function (error, result) {
        if (error) {
          console.log(error); // Some error occured.
        } else {
          $scope.vehicles = result;
          mojioService.setSelectedVehicle(result[0]);
          stateService.setCurrentItem(result[0]);
          $scope.$apply();

          // console.log($scope.vehicles[0]);
        }
      })
    };

    $scope.onStartObserve = function () {
      var vehicle = mojioService.getSelectedVehicle();
      if (!vehicle) {
        notificationsService.popupNotification("Error!", "Please select a vehicle!");
        return;
      }
      $scope.observerEvents.length = 0;
      mojioService.observeStatic(vehicle, function (observeEvent) {
        // console.log(observeEvent);
        $scope.observerEvents.unshift(observeEvent);
        $scope.$apply();
      }, function (result) {
        if (result) {
          $scope.observe = true;
          $scope.$apply();
        }
      });
    };
    $scope.onStartWatch = function () {
      // alert($scope.MPH);
      // alert(this.MPH);
      // $scope.$apply();

      var vehicle = mojioService.getSelectedVehicle();
      if (!vehicle) {
        notificationsService.popupNotification("Error!", "Please select a vehicle!");
        return;
      }
      $scope.watchSpinner = true;
      $scope.watchEvents.length = 0;
      stateService.setRPM(this.RPM);
      stateService.setMPH(this.MPH);
      mojioService.watch(vehicle, this.MPH, this.RPM, function (watchEvent) {
        // console.log(observeEvent);
        if (lastContactTime !== watchEvent.LastContactTime) {
          if (watchEvent.LastSpeed >= stateService.getMPH() || watchEvent.LastRpm >= stateService.getRPM()) {

            lastContactTime = watchEvent.LastContactTime;
            $scope.watchEvents.unshift(watchEvent);
            $scope.$apply();
          }
        }
      }, function (result) {
        if (result) {
          $scope.watch = true;
          $scope.watchSpinner = false;

          $scope.$apply();
        }
      });
    };


    $scope.onStopObserve = function () {
      mojioService.unobserve();
      $scope.observe = false;
    };
    $scope.onStopWatch = function () {
      mojioService.unobserve();
      $scope.watch = false;
    };
    $scope.onObserveItem = function (item) {
      stateService.setCurrentItem(item);
      $state.go('tab.details', {});
    };
    $scope.onWatchItem = function (item) {
      stateService.setCurrentItem(item);
      $state.go('tab.details', {});
    };

    $scope.currentItem = function () {
      return stateService.currentItem();
    }
  })

  .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.model = 'model';

    $scope.onChat = function () {
      alert($scope.model);
      alert(this.model);
    }
  })


  .controller('AccountCtrl', function ($scope) {
    $scope.settings = {
      enableFriends: true
    };
  });
