"use strict"

# Declare app level module which depends on views, and components
directory = angular.module("directory", [
  "ui.router"
  "directory.group"
  "directory.person"
  "directory.info"
])

directory.controller("DirectoryCtrl", ["$timeout"
    ($timeout)->
      $timeout((-> window.location = "/screensaver"), 120000)
  ])

directory.config ($stateProvider, $urlRouterProvider) ->
  $urlRouterProvider.otherwise "/a/"

  $stateProvider.state(
    "all"
    url: "/a"
    templateUrl: "/s/app/group/group.html"
    controller:"GroupCtrl as group"
  ).state(
    "all.nobodySelected"
    url: "/"
    templateUrl: "/s/app/info/info.html"
    controller: "InfoCtrl as info"
  ).state(
    "all.selectedPerson"
    url: "/p/:personId"
    templateUrl: "/s/app/person/person.html"
    controller:"PersonCtrl as pCtrl"
  ).state(
    "group"
    url: "/g/:groupId"
    templateUrl: "/s/app/group/group.html"
    controller: "GroupCtrl as group"
  ).state(
    "group.nobodySelected"
    url: "/"
    templateUrl: "/s/app/info/info.html"
    controller: "InfoCtrl as info"
  ).state(
    "group.selectedPerson"
    url: "/p/:personId"
    templateUrl: "/s/app/person/person.html"
    controller: "PersonCtrl as pCtrl"
  )

  return
