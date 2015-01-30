"use strict"

# Declare app level module which depends on views, and components
angular.module("directory", [
  "ngRoute"
  "directory.group"
]).config [
  "$routeProvider"
  ($routeProvider) ->
    $routeProvider.otherwise redirectTo: "/group"
]