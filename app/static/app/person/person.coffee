"use strict"
angular.module("directory.person", ["ui.router"]).controller(
  "PersonCtrl", ["$stateParams", "$http", "$scope", "$sce"
    ($stateParams, $http, $scope, $sce)->
      @person = {}

      $http.get("/api/person/#{$stateParams.personId}").success((data)=>
        @person = data
      )

      @trustUrl = (media)=>
        $sce.trustAsResourceUrl(media)

      $scope = @ # set this as pCtrl
  ]
)