"use strict"
angular.module("directory.group", ["ui.router"]).controller(
  "GroupCtrl", ["$stateParams", "$http", "$scope", "$sce"
    ($stateParams, $http, $scope, $sce)->
      @groupId = $stateParams.groupId
      @urlPrefix = if @groupId then "#/g/#{@groupId}" else "#/a"
      @groupName = ""
      @people = []

      query = if @groupId then "/api/group/#{@groupId}" else "/api/person"

      $http.get(query).success((data)=>
        @groupName = data.group.name
        @people = data.people
      )

      @trustResource = (url)=>
        $sce.trustAsResourceUrl(url)

      $scope = @
  ]
)