angular.module('starter.login', [])

  .controller('LoginCtrl', function ($scope, $rootScope, $state, mojioService, notificationsService) {

    $scope.isLogged = false;
    $scope.logSpinner = false;

    $scope.onLogin = function () {
      $scope.logSpinner = true;
      mojioService.login($scope.loginData.username, $scope.loginData.password, function (flag) {
        $scope.isLogged = flag;
        $scope.logSpinner = false;
        $scope.$apply();
        $state.go('tab.cars', {from: "login"});
      })
    };
    $scope.loginData = {
      username: 'yevgeniyk',
      password: 'm2826141'
    }
    $scope.onLogout = function () {
      mojioService.logout(
        function () {
          // console.log("main logout");
          $scope.isLogged = false;
          $rootScope.$broadcast('logout');
        }
      );
    };

  });
