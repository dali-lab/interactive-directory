"use strict"
angular.module("screensaver", []).controller(
  "ScreensaverCtrl", ["$scope", "$timeout"
    ($scope, $timeout)->
    	@date = new Date();

    	dateUpdater = =>
            @date = new Date();
            $timeout((-> dateUpdater()), 1000);
        dateUpdater()

      $scope = @
  ]
)