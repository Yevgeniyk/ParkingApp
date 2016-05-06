/**
 * Created by Yevgeniy on 4/11/2016.
 */
angular.module('notificationsService', [])
    .service('notificationsService', function ($ionicPopup) {
        this.alertNotification = function (body) {
            alert(body);
        };

        this.popupNotification = function (title, body) {
            $ionicPopup.alert({
                title: title,
                template: body
            });
        };

        this.pushNotification = function (pngUrl, title, body) {

            var warningId = "yk";
            chrome.notifications.create(warningId, {
                iconUrl: chrome.runtime.getURL(pngUrl),
                title: title,
                type: 'basic',
                message: body,
                isClickable: true,
                priority: 2,
            }, function () {
            });


        };

    });
