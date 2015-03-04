"use strict"
angular.module("directory.group", ["ui.router"]).controller(
  "GroupCtrl", ["$stateParams", "$http", "$scope", "$sce"
    ($stateParams, $http, $scope, $sce)->
      @groupId = $stateParams.groupId
      @urlPrefix = if @groupId then "#/g/#{@groupId}" else "#/a"
      @groupName = ""
      @people = []
      @selectedPersonId = -1
      @searchQuery = ""
      @keyboardOpen = false

      query = if @groupId then "/api/group/#{@groupId}" else "/api/person"

      $http.get(query).success((data)=>
        @groupName = data.group.name
        @people = data.people
      )

      @personSelected = (id)=>
        console.log "selected person id #{id}"
        @selectedPersonId = id

      @getPersonMedia = (id, person)=>
        return $sce.trustAsResourceUrl(person.neutral_media) if @selectedPersonId < 0
        return if @selectedPersonId == id then $sce.trustAsResourceUrl(person.waving_media) else $sce.trustAsResourceUrl(person.pointing_media)

      @search = =>
        searchQuery = "/api/search/#{@searchQuery}"
        $http.get(searchQuery).success((data)=>
          console.log "success"
          @groupName = "Searching: #{@searchQuery}"
          @people = data.people
        )

      @openKeyboard = =>
        @keyboardOpen = true

      @closeKeyboard = =>
        @keyboardOpen = false

      $scope = @
  ]
)