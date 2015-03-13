"use strict"
angular.module("directory.info", []).controller("InfoCtrl",
    ["$http", "$scope", "$timeout", ($http, $scope, $timeout)->
        @date = new Date()
        @weather = {}

        WEATHER_ICON_MAPPER = {
            200: "wi-thunderstorm",
            201: "wi-thunderstorm",
            202: "wi-thunderstorm",
            210: "wi-thunderstorm",
            211: "wi-thunderstorm",
            212: "wi-thunderstorm",
            221: "wi-thunderstorm",
            230: "wi-thunderstorm",
            231: "wi-thunderstorm",
            232: "wi-thunderstorm",
            300: "wi-rain",
            301: "wi-rain",
            302: "wi-rain",
            310: "wi-rain",
            311: "wi-rain",
            312: "wi-rain",
            313: "wi-rain",
            314: "wi-rain",
            321: "wi-rain",
            500: "wi-rain",
            501: "wi-rain",
            502: "wi-rain",
            503: "wi-rain",
            504: "wi-rain",
            511: "wi-rain",
            520: "wi-rain",
            521: "wi-rain",
            522: "wi-rain",
            531: "wi-rain",
            600: "wi-snow",
            601: "wi-snow",
            602: "wi-snow",
            611: "wi-snow",
            612: "wi-snow",
            615: "wi-snow",
            616: "wi-snow",
            620: "wi-snow",
            621: "wi-snow",
            622: "wi-snow",
            701: "wi-windy",
            711: "wi-windy",
            721: "wi-windy",
            731: "wi-windy",
            741: "wi-windy",
            751: "wi-windy",
            761: "wi-windy",
            762: "wi-windy",
            771: "wi-windy",
            781: "wi-windy",
            800: "wi-day-sunny",
            801: "wi-cloudy",
            802: "wi-cloudy",
            803: "wi-cloudy",
            804: "wi-cloudy",
            900: "wi-tornado",
            901: "wi-storm-showers",
            902: "wi-hurricane ",
            903: "wi-thermometer-exterior",
            904: "wi-thermometer",
            905: "wi-strong-wind",
            906: "wi-hail",
            951: "wi-day-sunny",
            952: "wi-strong-wind",
            953: "wi-strong-wind",
            954: "wi-strong-wind",
            955: "wi-strong-wind",
            956: "wi-strong-wind",
            957: "wi-strong-wind",
            958: "wi-strong-wind",
            959: "wi-strong-wind",
            960: "wi-storm-showers",
            961: "wi-storm-showers",
            962: "wi-hurricane"
        }

        WEATHER_API = 'http://api.openweathermap.org/data/2.5/weather?&q='
        API_QUERIES = 'callback=JSON_CALLBACK&units=imperial'

        dateUpdater = =>
            @date = new Date()
            $timeout((-> dateUpdater()), 1000)
        dateUpdater()

        getWeather = (location) =>
            $http.jsonp("#{WEATHER_API}#{location}&#{API_QUERIES}").success(
                (data) =>
                    timeoutLength = 1000
                    if data
                        @weather = data
                        console.log @weather
                        timeoutLength = 300000
                    $timeout((-> getWeather(location)), timeoutLength)
            ).error((data, status)=>
                $timeout((-> getWeather(location)), 1000)
            )

        $http.get("/api/building/").success (data) =>
            getWeather(data.location)

        @getWeatherIcon = =>
            return "wi wi-windy" if !@weather.hasOwnProperty('weather')
            weatherId = @weather.weather[0].id
            return "wi #{WEATHER_ICON_MAPPER[weatherId]}"

        $scope = @
    ]
)