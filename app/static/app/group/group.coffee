"use strict"
angular.module("directory.group", ["ui.router"]).config(
  ($stateProvider) ->
    $stateProvider.state(
      "group",
      url: "/group/:id",
      templateUrl: "/s/app/group/group.html"
      controller:"GroupCtrl"
      params:
        id: 0
    )
).controller "GroupCtrl", [->
]