/**
 * Created by Yevgeniy on 4/11/2016.
 */
angular.module('mojioService', [])
  .service('mojioService', function () {
    var mojio = {};
    var logged = false;
    var selectedVehicle;
    var subscribedObserver = [];
    var subscribedObserverSubject;
    var config = {
      application: '6adaae0f-5be4-4d38-80f2-95dbb2ca74bf',
      secret: 'b0aefde8-da88-401e-9727-f60fa12968a6',
      hostname: 'api.moj.io',
      version: 'v1',
      port: '443',
      scheme: 'https'
    };
    this.isLogged = function () {
      return logged;
    };
    this.setSelectedVehicle = function (v) {
      selectedVehicle = v;
    };
    this.getSelectedVehicle = function () {
      return selectedVehicle;
    };
    this.login = function (user, password, callback) {
      if (!logged) {
        mojio = new MojioClient(config);
        mojio.login(user, password, function (error, result) {
          if (error) {
            callback(false);
          } else {
            logged = true;
            console.log("success:" + result);
            callback(true);
          }

        });
      } else {
        callback(true);
      }

    };

    this.observe = function (observeObject) {
      if (!logged) {
        return;
      }
      var observerInit = new Observer(
        {
          ObserverType: "Speed", Status: "Approved", SpeedLow: 80.0, Name: "Observer" + Math.random(),
          Subject: observeObject.model(), SubjectId: observeObject.id(), "Transports": "SignalR"
        }
      );

      //     var entity = mojio.model('Vehicle');
//      var entity = mojio.schema();

      mojio.watch(observerInit, function (entity, callbach) {
        console.log("Observed change seen.");
        console.log(" entity ");
        console.log(entity);
        //       return mojio.unobserve(observer, app, null, function (error, result) {
        //         return done();
        //     });
      }, function (error, result) {
        console.log("on watch...");
        observer = result;
        subscribedObserver = observer;
        subscribedObserverSubject = observeObject;
        console.log(" observer ");
        console.log(observer);
      });
    };


    this.watch = function (watchObject, speed, rpm, callback, onWatchStart) {
      if (!logged) {
        return;
      }
      subscribedObserverSubject = watchObject;

      var speedObserver = getSpeedObserver(speed, watchObject);
      var rpmObserver = getRpmObserver(rpm, watchObject);
      var observers = getObservers(speed, rpm, watchObject);

      watchInternal("speed", speedObserver, callback, function(start) {
        if(start){
          watchInternal("rpm", rpmObserver, callback, onWatchStart);
        }
      });
//      watchInternal("speed", observers, callback, onWatchStart);


    };

    function getObservers(speed, rpm, watchObject) {
      var o = new Observer(
        {
          ObserverType: "Conditional", Status: "Approved", Name: "Watch" + Math.random(), Timing: "high",
          "Transports": "SignalR"
        }
      );
      o.SpeedLow = speed;
      o.Subject = watchObject.model();
      o.SubjectId = watchObject.id();
      o.RpmLow = rpm;
      return o;

    }

    // function getObservers(speed, rpm, watchObject) {
    //   var observers = [];
    //   observers.push(getSpeedObserver(speed, watchObject));
    //   observers.push(getRpmObserver(rpm, watchObject));
    //   return observers;
    // }
    function getSpeedObserver(speed, watchObject) {
      var o = new Observer(
        {
          ObserverType: "Speed", Status: "Approved", Name: "Watch" + Math.random(), Timing: "high",
          "Transports": "SignalR"
        }
      );
      o.SpeedLow = speed;
      o.Subject = watchObject.model();
      o.SubjectId = watchObject.id();
      return o;
    }

    function getRpmObserver(rpm, watchObject) {
      var o = new Observer(
        {
          ObserverType: "Rpm", Status: "Approved", Name: "Watch" + Math.random(), Timing: "high",
          "Transports": "SignalR"
        }
      );
      o.RpmLow = rpm;
      o.Subject = watchObject.model();
      o.SubjectId = watchObject.id();
      return o;
    }

    function watchInternal(type, observer, callback, onWatchStart) {
      mojio.watch(observer, function (entity) {
        console.log(entity);
        callback(entity);
      }, function (error, result) {
        if (onWatchStart) {
          onWatchStart(result);
        }
        console.log("on watch...");
        subscribedObserver[type] = result;
        console.log(" observer ");
        console.log(result);
      });

    }


    this.unobserve = function () {
      if (!logged) {
        console.log("unobserve - not logged");
        return;
      }
      if (!subscribedObserverSubject) {
        console.log("unobserve - undefined");
        return;
      }
      if (subscribedObserver['speed']) {
        mojio.unobserve(subscribedObserver['speed'], subscribedObserver['speed'], null, null, function (error, result) {
          console.log("unobserver change");
          console.log('result = ' + result);
          console.log('error = ' + error);
          subscribedObserver['speed'] = undefined;
          subscribedObserverSubject = undefined;
        });
      }
      if (subscribedObserver['rpm']) {
        mojio.unobserve(subscribedObserver['rpm'], subscribedObserver['rpm'], null, null, function (error, result) {
          console.log("unobserver change");
          console.log('result = ' + result);
          console.log('error = ' + error);
          subscribedObserver['rpm'] = undefined;
          subscribedObserverSubject = undefined;
        });
      }
    };


    this.observeStatic = function (observeObject, onEvent, onSuccess) {
      if (!logged) {
        return;
      }
      if (subscribedObserver || subscribedObserverSubject) {
        console.log("observeStatic - defined");
        return;
      }
      mojio.observe(observeObject, null, function (entity) {
//        console.log(entity);
        onEvent(entity);
        // console.log('_id = ' + entity._id + ' time = ' + entity.VehicleTime);
      }, function (error, result) {
        console.log("observe change status");
        observer = result;
        onSuccess(result);
        subscribedObserver = observer;
        subscribedObserverSubject = observeObject;
        console.log(observer);
      });


    };

    this.logout = function (callback) {
      if (logged) {
        logged = false;
        try {
          mojio.logout(function (error, result) {
            // console.log("result is " + result);
            // callback();
          });
        }
        finally {
          // console.log("in finally");
          callback();

        }
      }
    };
    this.getVehicles = function (callback) {
      if (!logged) {
        return;
      }

      var Vehicle = mojio.model('Vehicle');
      mojio.get(Vehicle, {}, function (error, result) {
        if (error) {
          callback(error);
          return;// error; // Some error occured.
        } else {
          callback(undefined, mojio.getResults(Vehicle, result));  // Helper function to get the results.
          return;
        }

      });

    };

    this.test = function () {
      alert("test service");
    };

  });
