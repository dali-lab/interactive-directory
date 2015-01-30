"use strict"

# Declare app level module which depends on views, and components
angular.module("directory", [
  "ui.router"
  "directory.group"
  "directory.person"
  "directory.info"
]).config ($stateProvider, $urlRouterProvider) ->
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



  # $stateProvider.state(
  #   # no group selected
  #   # all people shown
  #   # general info shown
  #   "all"
  #   url: "/"
  #   views: {
  #     "group-view": {
  #       templateUrl: "/s/app/group/group.html"
  #       controller:"GroupCtrl as group"
  #     },
  #     "person-view": {
  #       templateUrl: "/s/app/info/info.html"
  #       controller:"InfoCtrl as info"
  #     }
  #   }

  # ).state(
  #   # group selected
  #   # people in group shown
  #   # general info shown
  #   "group",
  #   url: "/g/:groupId",
  #   views: {
  #     "group-view": {
  #       templateUrl: "/s/app/group/group.html"
  #       controller:"GroupCtrl as group"
  #     },
  #     "person-view": {
  #       templateUrl: "/s/app/info/info.html"
  #       controller:"InfoCtrl as info"
  #     }
  #   }

  # ).state(
  #   # individual selected
  #   # people in group shown
  #   # general info shown
  #   "person"
  #   url: "/g/:groupId/p/:personId"
  #   views: {
  #     "group-view": {
  #       templateUrl: "/s/app/group/group.html"
  #       controller:"GroupCtrl as group"
  #     },
  #     "person-view": {
  #       templateUrl: "/s/app/person/person.html"
  #       controller:"PersonCtrl as pCtrl"
  #     }
  #   }
  # )

  return
