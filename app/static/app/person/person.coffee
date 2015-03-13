"use strict"
angular.module("directory.person", ["ui.router"]).controller(
  "PersonCtrl", ["$stateParams", "$http", "$scope", "$sce", "$location"
    ($stateParams, $http, $scope, $sce, $location)->
      @person = {}

      $http.get("/api/person/#{$stateParams.personId}").success((data)=>
        @person = data
      )

      @openMap = =>
        $location.search('map', @person.office_floor)

      @trustUrl = (media)=>
        $sce.trustAsResourceUrl(media)

      $scope = @ # set this as pCtrl
  ]
)