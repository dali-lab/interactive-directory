"use strict"

# Declare app level module which depends on views, and components
angular.module("directory", [
  "ui.router"
  "directory.group"
]).config ($stateProvider, $urlRouterProvider) ->
  $urlRouterProvider.otherwise "/"

  $stateProvider.state(
    # no group selected
    # all people shown
    # general info shown
    "all"
    url: "/"
    views: {
      "group-view": {
        templateUrl: "/s/app/group/group.html"
        controller:"GroupCtrl"
      },
      "person-view": {
        templateUrl: "/s/app/person/person.html"
        controller:"PersonCtrl"
      }
    }

  ).state(
    # group selected
    # people in group shown
    # general info shown
    "group",
    url: "/g/:group_id",
    views: {
      "group-view": {
        templateUrl: "/s/app/group/group.html"
        controller:"GroupCtrl"
      },
      "person-view": {
        templateUrl: "/s/app/person/person.html"
        controller:"PersonCtrl"
      }
    }

  ).state(
    # individual selected
    # people in group shown
    # general info shown
    "person"
    url: "/g/:group_id/p/:person_id"
    views: {
      "group-view": {
        templateUrl: "/s/app/group/group.html"
        controller:"GroupCtrl"
      },
      "person-view": {
        templateUrl: "/s/app/person/person.html"
        controller:"PersonCtrl"
      }
    }
  )

  return
