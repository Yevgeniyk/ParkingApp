/**
 * Created by Yevgeniy on 4/11/2016.
 */
angular.module('stateService', [])
  .service('stateService', function ($ionicPopup) {
    var currentItem = {};
    var MPH = 80;
    var RPM = 1000;
    this.currentItem = function () {
      return currentItem;
    };
    this.setCurrentItem = function (item) {
      currentItem = item;
    };
    this.setMPH = function(mph){
      MPH = mph;
    };
    this.getMPH = function(){
      return MPH;
    };
    this.setRPM = function(rpm){
      RPM = rpm;
    };
    this.getRPM = function(){
      return RPM;
    };
  });
