"use strict"
angular.module("directory.group", ["ui.router"]).controller(
  "GroupCtrl", ["$stateParams", "$http", "$scope",
    ($stateParams, $http, $scope)->
      @groupName = ""
      @people = []

      groupId = $stateParams.groupId
      query = if groupId then "/api/group/#{groupId}" else "/api/person"

      $http.get(query).success((data)=>
        @groupName = data.group.name
        @people = data.people
      )

      $scope = @
  ]
)