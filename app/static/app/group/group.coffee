"use strict"
angular.module("directory.group", ["ngRoute"]).config([
  "$routeProvider"
  ($routeProvider) ->
    $routeProvider.when("/group",
      templateUrl: "/s/app/group/group.html"
      controller: "GroupCtrl")
      .when "/group/:group_id",
        templateUrl: "/s/app/group/group.html"
        controller: "GroupCtrl"

]).controller "GroupCtrl", [->
]