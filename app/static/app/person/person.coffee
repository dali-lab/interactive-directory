"use strict"
angular.module("directory.person", ["ui.router"]).controller(
  "PersonCtrl", ["$stateParams", "$http", "$scope",
    ($stateParams, $http, $scope)->
      @person = {}

      $http.get("/api/person/#{$stateParams.personId}").success((data)=>
        @person = data
      )

      $scope = @ # set this as pCtrl
  ]
)