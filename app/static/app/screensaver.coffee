"use strict"
angular.module("screensaver", []).controller(
  "ScreensaverCtrl", ["$scope", "$timeout", "$http"
    ($scope, $timeout, $http)->
    	@date = new Date();
    	@weather = "finding"

    	dateUpdater = =>
            @date = new Date();
            $timeout((-> dateUpdater()), 1000);
        dateUpdater()

      getWeather = =>
			  $http.jsonp('http://api.openweathermap.org/data/2.5/weather?q=Hanover,NH&units=imperial&callback=JSON_CALLBACK').success (data) =>
			    if data
		        @weather = data
			    return

    	$scope = @
  ]
)