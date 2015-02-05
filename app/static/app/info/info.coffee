"use strict"
angular.module("directory.info", ["ui.router"]).controller(
  "InfoCtrl", ["$stateParams", "$http", "$scope", "$timeout"
    ($stateParams, $http, $scope, $timeout)->
        @date = new Date();

        dateUpdater = =>
            @date = new Date();
            $timeout((-> dateUpdater()), 1000);
        dateUpdater()

        $scope = @;
  ]
)