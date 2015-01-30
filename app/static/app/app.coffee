"use strict"

# Declare app level module which depends on views, and components
angular.module("directory", [
  "ui.router"
  "directory.group"
]).config ($stateProvider, $urlRouterProvider) ->
  $urlRouterProvider.otherwise "/group/" # TODO: make sure this works

  return
