"use strict"
angular.module("myApp.view2", ["ngRoute"]).config([
  "$routeProvider"
  ($routeProvider) ->
    $routeProvider.when "/view2",
      templateUrl: "/s/app/view2/view2.html"
      controller: "View2Ctrl"

]).controller "View2Ctrl", [->
]