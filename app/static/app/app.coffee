"use strict"

# Declare app level module which depends on views, and components
directory = angular.module("directory", [
  "ui.router"
  "directory.group"
  "directory.person"
  "directory.info"
])

directory.controller("DirectoryCtrl", ["$timeout", "$scope", "$location", ($timeout, $scope, $location)->
  DEFAULT_FLOOR_NUMBER = 1

  getDefaultSelectedTabFromPath = (path)->
    return 0 if path.slice(0, 3) != "/g/"
    path = path.slice(3)
    path.slice(0, path.indexOf("/"))

  @selectedTab = getDefaultSelectedTabFromPath($location.path())

  @mapOpen = =>
    $location.search().hasOwnProperty('map')

  @getSelectedFloorNumber = =>
    parseInt(if @mapOpen() then $location.search().map else DEFAULT_FLOOR_NUMBER)

  @openMap = =>
    $location.search('map', DEFAULT_FLOOR_NUMBER)

  @closeMap = =>
    $location.search('map', null)

  @floorIsSelected = (floorNumber)=>
    floorNumber == @getSelectedFloorNumber()

  @selectFloor = (floorNumber)=>
    $location.search('map', floorNumber)

  # start timer for screensaver (180000 = 3 minutes)
  startScreenSaverTimer = ->
    $timeout((-> window.location = "/screensaver"), 180000)

  # initialize screen saver timer
  screensaverTimer = startScreenSaverTimer()

  # reset screen saver timer
  resetScreenSaverTimer = =>
    $timeout.cancel(screensaverTimer)
    screensaverTimer = startScreenSaverTimer()

  # set up click handler to reset screen saver timer
  document.addEventListener("click", ->
    resetScreenSaverTimer()
  )

  $scope = @
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
