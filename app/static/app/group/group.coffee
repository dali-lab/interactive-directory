"use strict"
angular.module("directory.group", ["ui.router"]).controller(
  "GroupCtrl", ["$stateParams", "$http", "$scope", "$sce", "$timeout"
    ($stateParams, $http, $scope, $sce, $timeout)->
      @groupId = $stateParams.groupId
      @urlPrefix = if @groupId then "#/g/#{@groupId}" else "#/a"
      @groupName = ""
      @people = []
      @selectedPersonId = -1
      @searchQuery = ""
      @keyboardOpenEh = false
      @searchField = null

      @openKeyboard = ($event)=>
        console.log "openKeyboard called"
        @searchField = $event.currentTarget if @searchField is null
        @keyboardOpenEh = true

      @closeKeyboard = =>
        console.log "closeKeyboard called"
        @keyboardOpenEh = false

      @personSelected = (id)=>
        @selectedPersonId = id

      @keyboardClicked = =>
        @searchField.focus()

      query = if @groupId then "/api/group/#{@groupId}" else "/api/person"

      $http.get(query).success((data)=>
        @groupName = data.group.name
        @people = data.people
      )

      @getPersonMedia = (id, person)=>
        return $sce.trustAsResourceUrl(person.neutral_media) if @selectedPersonId < 0
        return if @selectedPersonId == id then $sce.trustAsResourceUrl(person.waving_media) else $sce.trustAsResourceUrl(person.pointing_media)

      @search = =>
        searchQuery = "/api/search/#{@searchQuery}"
        $http.get(searchQuery).success((data)=>
          @groupName = "Searching: #{@searchQuery}"
          @people = data.people
        )

      $scope = @
  ]
)