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
      @doNotAllowKeyboardClose = false
      @searchField = null

      @openKeyboard = ($event)=>
        console.log "openKeyboard called"
        @searchField = $event.currentTarget if @searchField is null
        @keyboardOpenEh = true
        @doNotAllowKeyboardClose = true

      @closeKeyboard = =>
        console.log "close keyboard called"

        # close keyboard in 1 second if the keyboard was not clicked
        $timeout((=>
          console.log "attempting to close keyboard"
          @keyboardOpenEh = false if not @doNotAllowKeyboardClose
          @doNotAllowKeyboardClose = false
        ), 100)

      @personSelected = (id)=>
        @selectedPersonId = id

      @keyboardClicked = =>
        console.log "keyboard clicked called"
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
          console.log "success"
          @groupName = "Searching: #{@searchQuery}"
          @people = data.people
        )

      $scope = @
  ]
)