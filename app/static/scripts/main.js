/*
 * main.js
 *
 * Used for Interactive Directory app for the Digital Arts Leadership and
 * Innovation Lab at Dartmouth College
 *
 * Lisa Luo, Daniel Chen, Bo Gibson, Sophia Haim
 */

// stores global variables
var APP_STATE = {
	previousName: null,
	previousField: null,
	previousBackgroundColor: null,
	previousColor: null,

	// constants
	// defines the CSS for the selected fieldDiv
	SELECT_BG_COLOR: 'rgb(240,240,240)',
	SELECT_COLOR: 'black',
	PEOPLE_PER_ROW: 3,
};

$(document).ready(function () {
	// place building information
	$.getJSON('/api/building/', function(data) {
		$('#menu-title').innerHTML=data.name;
		$('#building-name').innerHTML=data.name;
		$('#building-image').src=data.image;
	});

	// populate group fields
	$.getJSON('/api/group/', function(data) {
		var menuFieldBase = 'menu-field';

		for (var i = 0; i < data.groups.length; i++) {
			var menuFieldName = menuFieldBase + (i + 2);

			var div = document.createElement('div');

			div.id = menuFieldName;
			$(div).data('group-id', data.groups[i].group_id);
			div.onclick = (function() {setSelectedField($(this).data('group-id'), this)});
			div.innerHTML = data.groups[i].name;

			document.getElementById('menu-sidebar-left').appendChild(div);
		}
	});

	// TODO reset field back to All if search is selected for a certain
	// amount of time

	createMapButtons();
	setupListeners();
});


function setupListeners() {
	$('#menu-title').click(displayBuilding);
	$('#menu-field1').click(function() {setSelectedField($(this).text(), this)});
	$('#search-input').click(selectSearchBar).click(function () {performSearch(event);});

	/* map listeners */
	$('#map-button').click(toggleMap);
	$('#exit-map').click(toggleMap);
}

function createMapButtons() {
	// TODO GET THESE NUMBERS FROM DATABASE
	var minFloors = 0;
	var maxFloors = 2;
	var newButton;
	var currentFloor;

	for (currentFloor = minFloors; currentFloor <= maxFloors; currentFloor++) {
		newButton = $('<div id="' + currentFloor + '" class="floor-button"></div>');
		newButton.text(currentFloor);
		newButton.attr('id', currentFloor);
		newButton.click(function() {
			displayMap(this);
		});

		$('#map-buttons').append(newButton);
	}
}

function displayMap(button) {
	var floorNumber = $(button).attr('id');

	// TODO REPLACE WITH GETTING THE IMAGE FROM DB USING floorNumber
	$('#map-img').attr('src', 'public/img/maps/' + floorNumber + '.gif')
}

// turns off building display, turns on person display
function displayPerson() {
	$('#person-display').show();
	$('#building-display').hide();
}

// turns off person display, displays building display
function displayBuilding() {
	deselectFields();
	$('#person-display').hide();
	$('#building-display').show();
}

// called when a field is selected
function setSelectedField(content, fieldDiv) {
	displayPerson();

	// hide search-text
	$('#search-text').hide();
	$("#search-exit").hide();
	$("#keyboard").hide();

	// make field-text visible
	$('#field-text').show();

	deselectFields();

	// set new previous field
	APP_STATE.previousField = fieldDiv;
	APP_STATE.previousBackgroundColor = fieldDiv.style.backgroundColor;
	APP_STATE.previousColor = fieldDiv.style.color;

	// change the selected div's color
	fieldDiv.style.backgroundColor = APP_STATE.SELECT_BG_COLOR;

	// change the font color of the selected divs
	fieldDiv.style.color = APP_STATE.SELECT_COLOR;

	// change the center title's name
	$('#field-text').text(content);

	// reset search bar
	$('#search-input').val(''); //Clear the text input

	// DOESN'T WORK
	// reset person information
	$('#person-selected').hide(); // hide
	$('#no-person-selected').show(); // show

	var div = document.getElementById('people-container');
	while(div.firstChild){
    	div.removeChild(div.firstChild);
	}

	// PULL UP CORRECT PROFESSORS HERE
	populateProfessors(content);
}

/*
	Populates the middle section based on the field.
*/
function populateProfessors(groupId) {

	// get array of people
	$.getJSON('api/group/' + groupId + '/', function(data) {

		var colTracker = 0;

		// create initial row
		var row = document.createElement('div');
		row.class = 'row';

		// loop through each person in the array.
		var arrayLength = data.people.length;
		for (var i = 0; i < arrayLength; i++) {
			console.log('adding ' + data.people[i].first_name + ' ' + data.people[i].last_name
				+ ' ' + data.people[i]._id);

			// create new column
			var node = document.createElement('div');
			node.className = 'col-md-3';
			node.id = data.people[i]._id;
			$(node).data('person-id', data.people[i].person_id);
		  	node.onclick = (function() {setSelectedPerson($(this).data('person-id'), this)});

			// create circular
			var circleimg = document.createElement('div');
			circleimg.id = data.people[i]._id + 'image';	// set id to individual's ID + 'image'
			circleimg.className = 'circular';

			// set the circular image to be the idle pic
			urlString = 'public/img/' + data.people[i].idlePic;
			circleimg.style.backgroundImage = "url(" + urlString + ")";


			// create name label
			var namelabel = document.createElement('div');

			namelabel.className = 'name-label'
			namelabel.innerHTML = data.people[i].first_name + ' ' + data.people[i].last_name;

			// append items to node
			node.appendChild(circleimg);
			node.appendChild(namelabel);

			// append node to row
			row.appendChild(node);

			// bookeeping for row
			colTracker++;
			if ( colTracker >= APP_STATE.PEOPLE_PER_ROW ) {

				// add row to document
				document.getElementById('people-container').appendChild(row);

				// create a new row
				var row = document.createElement('div');
				row.className = 'row';

				// reset number of people in row b/c new row
				colTracker = 0;
			}
		}

		// If looped through all individuals and haven't completed a row, just add a row
		// with fewer people to the 'people-container'
		if (colTracker < APP_STATE.PEOPLE_PER_ROW) {
			document.getElementById('people-container').appendChild(row);
		}

	});
}

function deselectFields() {
	$('#people-container').empty();
	$('#media-display').hide();

	// reset previous field to previous CSS
	if (APP_STATE.previousField != null) { // if it's not the first field that has been clicked
		APP_STATE.previousField.style.backgroundColor = APP_STATE.previousBackgroundColor;
		APP_STATE.previousField.style.color = APP_STATE.previousColor;
	}
}

function toggleMap(){
	$("#map").toggle()
}

// get the information for display in right panel
function getPersonInfo(id){
	$.getJSON('/getPersonInfo/id', function(data) {
		document.getElementById("person-info").innerHTML=data[0];
	});
};

// defines the CSS for the selected nameDiv
function setSelectedPerson(person_id, nameDiv) {
	displayPerson();

	// reset previous button to previous CSS
	if (APP_STATE.previousName != null) { // if it's not the button field that has been clicked

		// unhiglight previous button
	}

	// set new previous field
	APP_STATE.previousName = nameDiv;

	// highlight the currently selected div

	// change the selected name
	$('#person-selected').text($(nameDiv).text());

	// show the correct span and hide the wrong one
	$('#person-selected').show();
	$('#no-person-selected').hide();
	$('#media-display').show();

	// PULL UP SELECTED PROFESSORS INFORMATION
	console.log('id: ' + person_id);
	var id = person_id;
	//urlString = 'public/img/' + data[i].wavePic;
	//nameDiv.getElementById('thumbnail').style.backgroundImage = "url(" + urlString + ")";

	// remove all previous person info
	var div = document.getElementById('person-info');
	while(div.firstChild){
		div.removeChild(div.firstChild);
	}

	$.getJSON('api/person/' + person_id, function(data) {

		//document.getElementById(data[0].firstName + data[0].lastName + 'image').style.backgroundImage = "url(" + urlString + ")";
		// var div = document.getElementById(id);
		// for (var i = 0; i < div.childNodes.length; i++) {
		//  	if (div.childNodes[i].className == 'circular') {
		//  		if (div.childNodes[i].id == data[0]._id + 'image') {
		//  			console.log('yes');
		//  			urlString = 'public/img/' + data[0].wavePic;
		//  			div.childNodes[i].style.backgroundImage = "url(" + urlString + ")";
		//  		}
		//  		else {
		//  			console.log('no');
		//  			//otherId = div.childNodes[i].id - 'image';
		//  		}
		//  	}
		// }

		// Get the div of the center panel
		var centerDiv = document.getElementById('people-container');

		// Get array of row divs in the center panel
		var rowArray = centerDiv.childNodes;

		// Loop through the rows in the center panel
		for (var i = 0; i < rowArray.length; i++) {

			// Get the current row
			var currentRow = rowArray[i];

			// Loop through the node divs in the current row
			for (var k = 0; k < currentRow.childNodes.length; k++) {

				// Get the current node
				var currentNode = currentRow.childNodes[k];

				// Loop through the elements within the node
				for (var j = 0 ; j < currentNode.childNodes.length; j++) {
					// If the element is in the circular class
					if (currentNode.childNodes[j].className == 'circular') {

						// If the ID of the element matches the ID of the name selected,
						// change the image in the circle to be the waving pic
						// if (currentNode.childNodes[j].id == data[0]._id + 'image') {
						// 	urlString = 'public/img/' + data[0].wavePic;
						// 	currentNode.childNodes[j].style.backgroundImage = "url(" + urlString + ")";
						// }

						// Otherwise, get the ID corresponding to the circle, and set the image
						// to be the point Pic
						// else {
						// 	var otherImageId = currentNode.childNodes[j].id;		// Get image ID
						// 	console.log('otherImageId: ' + otherImageId);
						// 	var otherId = otherImageId.substring(0, otherImageId.length - 5);	// Get individual ID
						// 	console.log('otherId: ' + otherId);
						// 	$.getJSON('/getPersonInfo/' + otherId, function(data) {
						// 		urlString2 = 'public/img/' + data[0].pointPic;					// Get point pic

						// 	});
						// 	currentNode.childNodes[j].style.backgroundImage = "url(" + urlString2 + ")";	// Set image
						// }
					}
				}
			}
		}

		// Get the information on the individual
		// var extraFields = data[0].fieldNames;
	 	// var arrayLength = extraFields.length;
	 	// Put all the individual's information into the right panel
	 	// for (var i = 0; i < arrayLength; i++) {
	 	// 	document.getElementById('person-info').innerHTML += data[0].fieldNames[i] + ': ' + data[0].fieldValues[i] + '</p>';
	 	// }
	 	console.log('here');
		document.getElementById('person-info').innerHTML =
			'<p>' + 'phone number' + ': ' + data.phone_number +'</p>' +
			'<p>' + 'first_name' + ': ' + data.first_name + '</p>' +
			'<p>' + 'last_name' + ': ' + data.last_name + '</p>' +
			'<p>' + 'phone_number' + ': ' + data.phone_number + '</p>' +
			'<p>' + 'email' + ': ' + data.email + '</p>' +
			'<p>' + 'office' + ': ' + data.office + '</p>';
	});
}

// called when the user selects the search bar
function selectSearchBar() {
	// show search-text
	$("#search-text").show();

	// hide field-text
	$("#field-text").hide();

	// unselect all fields
	deselectFields();

	// TODO: only show the keyboard when the search field has been touched
	$("#search-exit").show();
	$("#keyboard").show();

	// open touch keyboard
	var keyboard = document.createElement('script');
	keyboard.type='text/javascript';
	keyboard.src='public/scripts/touch_keyboard.js';

	document.getElementsByTagName('head')[0].appendChild(keyboard);

	// search input needs to be updated
	// delete text when search bar is inactive for too long...

	$('#search-exit').click(function () {
    $("#search-exit").hide();
		$("#keyboard").hide();
		setSelectedField('All', this);
	});
}

function performSearch(ev) {
	var key = ev.keyCode
	if (key == 13) {
		var searchVal = document.getElementById('search-input').value;
		console.log('searchVal: ' + searchVal);

		var div = document.getElementById('people-container');
		while(div.firstChild){
    		div.removeChild(div.firstChild);
		}

		// get array of people
		$.getJSON('/search/' + searchVal, function(data) {

			var colTracker = 0;

			// create initial row
			var row = document.createElement('div');
			row.class = 'row';

		// loop through each person in the array.
		var arrayLength = data.length;
		for (var i = 0; i < arrayLength; i++) {
			console.log('adding ' + data[i].firstName + ' ' + data[i].lastName + ' ' + data[i]._id);

			// create new column
			var node = document.createElement('div');
			node.className = 'col-md-3';	// This size is important for the layout
			node.id = data[i]._id;
		  	node.onclick = (function() {setSelectedPerson($(this).text(), this)});

			// create circular
			var circleimg = document.createElement('div');
			circleimg.id = data[i]._id + 'image';	// set id to individual's ID + 'image'
			circleimg.className = 'circular';

			// set the circular image to be the idle pic
			urlString = 'public/img/' + data[i].idlePic;
			circleimg.style.backgroundImage = "url(" + urlString + ")";


			// create name label
			var namelabel = document.createElement('div');

			namelabel.className = 'name-label'
			namelabel.innerHTML = data[i].firstName + ' ' + data[i].lastName;

			// append items to node
			node.appendChild(circleimg);
			node.appendChild(namelabel);

			// append node to row
			row.appendChild(node);

			// bookeeping for row
			colTracker++;
			if ( colTracker >= APP_STATE.PEOPLE_PER_ROW ) {

				// add row to document
				document.getElementById('people-container').appendChild(row);

				// create a new row
				var row = document.createElement('div');
				row.className = 'row';

				// reset number of people in row b/c new row
				colTracker = 0;
			}
		}

		// If looped through all individuals and haven't completed a row, just add a row
		// with fewer people to the 'people-container'
		if (colTracker < APP_STATE.PEOPLE_PER_ROW) {
			document.getElementById('people-container').appendChild(row);
		}

		});
	}
}

// create function that populates

// Function to add a field for an individual
function updateField(dbName, colName, queryFieldName, queryFieldValue, fieldName, fieldValue) {

	// Get the collection specified
	var col = db.getSiblingDB(dbName).getCollection(colName);

	var action1 = {};
	action1[queryFieldName] = queryFieldValue;

	var action = {};
	action[fieldName] = fieldValue;

	col.update(action1,{$set:action});

}
