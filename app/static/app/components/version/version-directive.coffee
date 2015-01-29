"use strict"
angular.module("myApp.version.version-directive", []).directive "appVersion", [
  "version"
  (version) ->
    return (scope, elm, attrs) ->
      elm.text version
      return
]