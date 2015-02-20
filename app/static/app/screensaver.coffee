"use strict"
angular.module("screensaver", []).controller("ScreensaverCtrl",
    ["$scope", "$timeout", "$http", ($scope, $timeout, $http)->
        @date = new Date()
        @weather

        WEATHER_API = 'http://api.openweathermap.org/data/2.5/weather?&q='
        API_QUERIES = 'callback=JSON_CALLBACK&units=imperial'

        dateUpdater = =>
            @date = new Date()
            $timeout((-> dateUpdater()), 1000)
        dateUpdater()

        getWeather = (location) =>
            $http.jsonp("#{WEATHER_API}#{location}&#{API_QUERIES}").success(
                (data) =>
                    if data
                        @weather = data
                    $timeout((-> getWeather(location)), 5000)
            )

        $http.get("/api/building/").success (data) =>
            getWeather(data.location)

        $scope = @
    ]
)