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
      @categoryName = ""
      @searchPeople = null
      @categoryPeople = null

      @search = =>
        searchQuery = "/api/search/#{@searchQuery}"
        $http.get(searchQuery).success((data)=>
          @searchPeople = data.people
        )

      @openKeyboard = ($event)=>
        @searchField = $event.currentTarget if @searchField is null
        @keyboardOpenEh = true

      @closeKeyboard = =>
        @searchField.value = ""
        @searchQuery = ""
        @keyboardOpenEh = false

      @personSelected = (id)=>
        @selectedPersonId = id

      @keyboardClicked = =>
        @searchField.focus()
        @searchQuery = @searchField.value
        @search()

      @getPeople = =>
        if !@searchQuery then @categoryPeople else @searchPeople

      query = if @groupId then "/api/group/#{@groupId}" else "/api/person"

      $http.get(query).success((data)=>
        @categoryName = data.group.name
        @categoryPeople = data.people
      )

      @getPersonMedia = (id, person)=>
        return $sce.trustAsResourceUrl(person.neutral_media) if @selectedPersonId < 0
        return if @selectedPersonId == id then $sce.trustAsResourceUrl(person.waving_media) else $sce.trustAsResourceUrl(person.pointing_media)

      @groupName = =>
        if !@searchQuery then @categoryName else "Searching: #{@searchQuery}"



      $scope = @
  ]
)