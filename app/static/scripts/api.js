/*
 * app.js
 */

//stores global variables
var APP_STATE = {
	previousName: null,
	previousField: null,
	previousBackgroundColor: null,
	previousColor: null,

	SELECT_BG_COLOR: 'rgb(240,240,240)',
	SELECT_COLOR: 'black',
};

$(document).ready(function () {

	setupListeners();
});

function setupListeners() {
	$('#menu-field-add-individual').click(function() {selectAddIndividualButton($(this).text(), this)});
	$('#menu-field-edit-individual').click(function() {selectEditIndividualButton($(this).text(), this)});
	$('#menu-field-edit-individual-group').click(function() {selectEditIndividualGroupButton($(this).text(), this)});
	$('#menu-field-delete-individual').click(function() {selectDeleteIndividualButton($(this).text(), this)});
	$('#menu-field-add-group').click(function() {selectAddGroupButton($(this).text(), this)});
	$('#menu-field-delete-group').click(function() {selectDeleteGroupButton($(this).text(), this)});
	$('#menu-field-edit-group-name').click(function() {selectEditGroupNameButton($(this).text(), this)});
	$('#menu-field-edit-group-priority').click(function() {selectEditGroupPriorityButton($(this).text(), this)});
	$('#menu-field-edit-building').click(function() {selectEditBuildingButton($(this).text(), this)});
	$('#aws-list-buckets').click(function() {awsListBuckets($(this).text(), this)});
}

function deselectFields() {

	// reset previous field to previous CSS
	if (APP_STATE.previousField != null) { // if it's not the first field that has been clicked
		APP_STATE.previousField.style.backgroundColor = APP_STATE.previousBackgroundColor;
		APP_STATE.previousField.style.color = APP_STATE.previousColor;
	}

}

// Function to get the highest number currently being used as a group priority
function getMaxGroupPriority() {

	var maxPriority = 1;

	// Have to use ajax in order to be able to return max priority
	$.ajax({
		url: 'http://localhost:3000/api/getGroups',
		async: false,
		dataType: 'json',
		success: function(data) {
			for (var i = 0; i < data.length; i++) {
				var value = parseInt(data[i].priorityID);
				if (value > maxPriority) {
					maxPriority = value;
				}
			}
		}
	});

	return maxPriority;
}

// Function to check if a group already exists
function checkGroup(name) {

	var result = false;

	$.ajax({
		url: 'http://localhost:3000/api/getGroups',
		async: false,
		dataType: 'json',
		success: function(data) {
			for (var i = 0; i < data.length; i++) {
				if (data[i].groupName == name) {
					result = true;
				}
			}
		}
	});

	return result;
}

// Function to add a new field name and corresponding field value to 
// the field names array and field values array of an individual
// (identified by first and last name)
function updateFieldArrays(firstName, lastName, fieldName, fieldValue) {

	// Set up variables to hold the old arrays
	var oldFieldNames;
	var oldFieldValues;

	$.ajax({
		url: 'http://localhost:3000/api/getIndividualFieldArrays/' + firstName + '/' + lastName,
		async: false,
		dataType: 'json',
		success: function(data) {

			// If the individual has a field names array, set oldFieldNames to it.
			// Otherwise, set oldFieldNames to hold only the new field name
			if (typeof(data[0].fieldNames) != "undefined") {
				oldFieldNames = data[0].fieldNames;
			} else {
				oldFieldNames = [fieldName];
			}
			// If the individual has a field values array, set oldFieldValues to it.
			// Otherwise, set oldFieldValues to hold only the new field value
			if (typeof(data[0].fieldValues) != "undefined") {
				oldFieldValues = data[0].fieldValues;
			} else {
				oldFieldValues = [fieldValue];
			}
		}
	});

	// Check if the oldFieldNames array already holds the field name you are trying to
	// add. If so, change the field value to the new value (the fieldValue parameter)
	for (var i=0; i < oldFieldNames.length; i++) {
		if (oldFieldNames[i] == fieldName) {
			oldFieldValues[i] = fieldValue;
			return {
				newFieldNames: oldFieldNames,
				newFieldValues: oldFieldValues
			}
		}
	}

	// If the old field names array did not already contain the field name you were trying
	// to add, add the new field name to the field names array and the new field value to
	// the field values array
	oldFieldNames.push(fieldName);
	oldFieldValues.push(fieldValue);
	return {
		newFieldNames: oldFieldNames,
		newFieldValues: oldFieldValues
	}
}

// Function to check if the individual exists
function checkIndividual(firstName, lastName) {

	var result;

	$.ajax({
		url: 'http://localhost:3000/api/getIndividualInfo/' + firstName + '/' + lastName,
		async: false,
		dataType: 'json',
		success: function(data) {

			// If the individual exists, set the result to true. Otherwise, set it to false
			if (data && data.length) {
				result = true;
			} else {
				result = false;
			}
		}
	});

	return result;
}

// Function to create a string that will look like a proper array
// in JSON
// TODO: Probably don't need this anymore
function createStringFromArray(fieldArray) {
	var fieldString = '{\"fields\":['
	for (var i=0; i < fieldArray.length; i++) {
		fieldString += '\"' + fieldArray[i] + '\"';
		if (i+1 < fieldArray.length) {
			fieldString += ',';
		} else {
			fieldString += ']}';
		}
	}
	return fieldString;
}

function resetBackground(content, fieldDiv) {

	// set new previous field
	APP_STATE.previousField = fieldDiv;
	APP_STATE.previousBackgroundColor = fieldDiv.style.backgroundColor;
	APP_STATE.previousColor = fieldDiv.style.color;

	// Set up the color of the tab
	fieldDiv.style.backgroundColor = APP_STATE.SELECT_BG_COLOR;
	fieldDiv.style.color = APP_STATE.SELECT_COLOR;

	// Replace the option text with the appropriate title
	$('#api-option-text').text(content);

	// Clear all the panels
	var divContainer = document.getElementById('api-form-container');
	while(divContainer.firstChild){
		divContainer.removeChild(divContainer.firstChild);
	}

	var divMiddleContainer = document.getElementById('api-form-container-middle');
	while(divMiddleContainer.firstChild){
		divMiddleContainer.removeChild(divMiddleContainer.firstChild);
	}

	var divRightContainer = document.getElementById('api-form-container-right');
	while(divRightContainer.firstChild){
		divRightContainer.removeChild(divRightContainer.firstChild);
	}

	var divRight = document.getElementById('api-right-result-panel');
	while(divRight.firstChild){
		divRight.removeChild(divRight.firstChild);
	}

	var divBottom = document.getElementById('api-bottom-panel');
	while(divBottom.firstChild){
		divBottom.removeChild(divBottom.firstChild);
	}
}

// Create a new input field, given a particular name and title,
// and add it to the node given
function createField(node, name, title) {
	var inputNode = document.createElement('div');
	var inputTitle = document.createElement('div');
	inputTitle.id = name;
	inputTitle.className = 'input-title';
	inputTitle.innerHTML = title;
	var inputBox = document.createElement('input');
	inputBox.type = 'text';
	inputBox.name = name;
	inputNode.appendChild(inputTitle);
	inputNode.appendChild(inputBox);
	node.appendChild(inputNode);
}

function createRequirementsMessage(node) {
	// Indicate to the user that certain fields are required
	var requirementsMessage = document.createElement('div');
	requirementsMessage.innerHTML = "<br> Fields marked with a * are required. <br>";
	node.appendChild(requirementsMessage);
}

function createExtraSpace(node) {
	var extraSpace = document.createElement('div');
	extraSpace.innerHTML = "<br>";
	node.appendChild(extraSpace);
}

function createFieldNameOption(inputNode, fieldName) {
	var fieldOption = document.createElement('option');
	fieldOption.value = fieldName;
	fieldOption.innerHTML = fieldName;
	inputNode.appendChild(fieldOption);
}

// Create a dropdown menu with common field names for the
// user to choose from
function createFieldNamesDropDown(node) {
	var fieldsNode = document.createElement('div');

	var fieldsInput = document.createElement('select');
	fieldsInput.name = 'Field Name';

	// populate field names
	createFieldNameOption(fieldsInput, 'First Name');
	createFieldNameOption(fieldsInput, 'Last Name');
	createFieldNameOption(fieldsInput, 'Phone Number');
	createFieldNameOption(fieldsInput, 'Email');
	createFieldNameOption(fieldsInput, 'Office');
	createFieldNameOption(fieldsInput, 'Main Video/Picture');
	createFieldNameOption(fieldsInput, 'Idle Video/Picture');
	createFieldNameOption(fieldsInput, 'Waving Video/Picture');
	createFieldNameOption(fieldsInput, 'Pointing Video/Picture');

	var fieldValueInput = document.createElement('input');
	fieldValueInput.type = 'text';
	fieldValueInput.name = 'Field Value';

	fieldsNode.appendChild(fieldsInput);
	createExtraSpace(node);
	node.appendChild(fieldsNode);
	node.appendChild(fieldValueInput);
}

// Get the database value that corresponds to a particular field name
function getDatabaseValue(fieldName) {
	if (fieldName == 'First Name') {
		return 'firstName';
	}
	if (fieldName == 'Last Name') {
		return 'lastName';
	}
	if (fieldName == 'Phone Number') {
		return 'PHONE: ';
	}
	if (fieldName == 'Email') {
		return 'EMAIL: ';
	}
	if (fieldName == 'Office') {
		return 'OFFICE: ';
	}
	if (fieldName == 'Main Video/Picture') {
		return 'mainPic';
	}
	if (fieldName == 'Idle Video/Picture') {
		return 'idlePic';
	}
	if (fieldName == 'Waving Video/Picture') {
		return 'wavePic';
	}
	if (fieldName == 'Pointing Video/Picture') {
		return 'pointPic';
	}
	return null;
}

function addFieldChoices() {
	var form = document.getElementById('edit-individual-form');
	createFieldNamesDropDown(form);
}

function addCategories() {
	var centerForm = document.getElementById('field-names-form');
	var rightForm = document.getElementById('field-values-form');
	createField(centerForm, 'Field Name', 'Field Name');
	createField(rightForm, 'Field Value', 'Field Value');
}

function selectAddIndividualButton(content, fieldDiv) {

	deselectFields();
	
	resetBackground(content, fieldDiv);

	// Create form for adding new individual
	var node = document.createElement('form');
	node.id = 'add-individual-form';

	// Create input fields for first and last name
	createField(node, 'First Name', 'First Name *');
	createField(node, 'Last Name', 'Last Name *');

	// Create input field for Group (drop down)
	var groupNode = document.createElement('div');
	var groupInputTitle = document.createElement('div');
	groupInputTitle.id = 'Group';
	groupInputTitle.className = 'input-title';
	groupInputTitle.innerHTML = 'Group *';
	var groupInput = document.createElement('select');
	groupInput.name = 'Group';
	// populate group fields
	$.getJSON('http://localhost:3000/api/getGroups', function(data) {

		for (var i = 0; i < data.length; i++) {

			var groupOption = document.createElement('option');
			groupOption.value = data[i].groupName;
			groupOption.innerHTML = data[i].groupName;
			groupInput.appendChild(groupOption);
		}
	});
	groupNode.appendChild(groupInputTitle);
	groupNode.appendChild(groupInput);
	node.appendChild(groupNode);

	// Create input fields for phone number, email, and office
	createField(node, 'Phone Number', 'Phone Number');
	createField(node, 'Email', 'Email');
	createField(node, 'Office', 'Office');

	// Create input fields for media
	createField(node, 'Main Media', 'Main Video/Picture');
	createField(node, 'Idle Media', 'Idle Video/Picture');
	createField(node, 'Wave Media', 'Waving Video/Picture');
	createField(node, 'Point Media', 'Pointing Video/Picture');

	// Indicate to the user that certain fields are required
	createRequirementsMessage(node);

	// Add the form to the center panel
	document.getElementById('api-form-container').appendChild(node);

	// Set up the submit button
	var submitNode = document.createElement('form');
	var submitButton = document.createElement('input');
	submitButton.type = 'button';
	submitButton.id = 'submit-button';
	submitButton.onclick = (function() {addIndividual($(this).text(), this)});
	submitButton.value = 'Submit';
	submitNode.appendChild(submitButton);
	document.getElementById('api-bottom-panel').appendChild(submitNode);

	// Set up additional categories panel
	var centerForm = document.createElement('form');
	centerForm.id = 'field-names-form';
	var rightForm = document.createElement('form');
	rightForm.id = 'field-values-form';

	var extraCategories = document.createElement('div');
	extraCategories.innerHTML = "Add your own fields. <br><br>";
	centerForm.appendChild(extraCategories);

	// Set up add button
	var addButton = document.createElement('input');
	addButton.type = 'button';
	addButton.id = 'add-button';
	addButton.onclick = (function() {addCategories($(this).text(), this)});
	addButton.value = 'Add';
	centerForm.appendChild(addButton);

	var extraSpace = document.createElement('div');
	extraSpace.innerHTML = "<br>";
	centerForm.appendChild(extraSpace);

	document.getElementById('api-form-container-middle').appendChild(centerForm);

	var spaces = document.createElement('div');
	spaces.innerHTML = "<br><br><br><br>";
	rightForm.appendChild(spaces);
	document.getElementById('api-form-container-right').appendChild(rightForm);
	
}

function selectEditIndividualButton(content, fieldDiv) {
	
	deselectFields();
	resetBackground(content, fieldDiv);
	
	// Create form for editing an individual
	var node = document.createElement('form');
	node.id = 'edit-individual-form';

	// Create input fields for first and last name
	createField(node, 'First Name', 'First Name *');
	createField(node, 'Last Name', 'Last Name *');

	createRequirementsMessage(node);

	// TODO: Set up a way to change groups (?)

	// Indicate to the user to choose fields to edit
	var instructionsMessage = document.createElement('div');
	instructionsMessage.innerHTML = "<br> Choose which fields to edit. <br>";
	node.appendChild(instructionsMessage);

	createExtraSpace(node);

	// Set up add button
	var addButton = document.createElement('input');
	addButton.type = 'button';
	addButton.id = 'add-button';
	addButton.onclick = (function() {addFieldChoices($(this).text(), this)});
	addButton.value = 'Add';
	node.appendChild(addButton);

	createFieldNamesDropDown(node);

	// Add the form to the center panel
	document.getElementById('api-form-container').appendChild(node);

	// Set up the submit button
	var submitNode = document.createElement('form');
	var submitButton = document.createElement('input');
	submitButton.type = 'button';
	submitButton.id = 'submit-button';
	submitButton.onclick = (function() {editIndividual($(this).text(), this)});
	submitButton.value = 'Submit';
	submitNode.appendChild(submitButton);
	document.getElementById('api-bottom-panel').appendChild(submitNode);

	// Set up additional categories panel
	var centerForm = document.createElement('form');
	centerForm.id = 'field-names-form';
	var rightForm = document.createElement('form');
	rightForm.id = 'field-values-form';

	var extraCategories = document.createElement('div');
	extraCategories.innerHTML = "Add/edit other fields. <br><br>";
	centerForm.appendChild(extraCategories);

	// Set up add button
	var addButton = document.createElement('input');
	addButton.type = 'button';
	addButton.id = 'add-button';
	addButton.onclick = (function() {addCategories($(this).text(), this)});
	addButton.value = 'Add';
	centerForm.appendChild(addButton);

	var extraSpace = document.createElement('div');
	extraSpace.innerHTML = "<br>";
	centerForm.appendChild(extraSpace);

	document.getElementById('api-form-container-middle').appendChild(centerForm);

	var spaces = document.createElement('div');
	spaces.innerHTML = "<br><br><br><br>";
	rightForm.appendChild(spaces);
	document.getElementById('api-form-container-right').appendChild(rightForm);

	addCategories();
}

function selectEditIndividualGroupButton(content, fieldDiv) {

	deselectFields();
	resetBackground(content, fieldDiv);

	// Create form for deleting an individual
	var node = document.createElement('form');
	node.id = 'edit-individual-group-form';

	// Create input fields for first and last name
	createField(node, 'First Name', 'First Name *');
	createField(node, 'Last Name', 'Last Name *');

	// Create input field for Group (drop down)
	var groupNode = document.createElement('div');
	var groupInputTitle = document.createElement('div');
	groupInputTitle.id = 'Group';
	groupInputTitle.className = 'input-title';
	groupInputTitle.innerHTML = 'Group Name *';
	var groupInput = document.createElement('select');
	groupInput.name = 'Group Name';
	// populate group fields
	$.getJSON('http://localhost:3000/api/getGroups', function(data) {

		for (var i = 0; i < data.length; i++) {

			var groupOption = document.createElement('option');
			groupOption.value = data[i].groupName;
			groupOption.innerHTML = data[i].groupName;
			groupInput.appendChild(groupOption);
		}
	});
	groupNode.appendChild(groupInputTitle);
	groupNode.appendChild(groupInput);
	node.appendChild(groupNode);

	createRequirementsMessage(node);

	// Add the form to the center panel
	document.getElementById('api-form-container').appendChild(node);

	// Set up the submit button
	var submitNode = document.createElement('form');
	var submitButton = document.createElement('input');
	submitButton.type = 'button';
	submitButton.id = 'submit-button';
	submitButton.onclick = (function() {editIndividualGroup($(this).text(), this)});
	submitButton.value = 'Submit';
	submitNode.appendChild(submitButton);
	document.getElementById('api-bottom-panel').appendChild(submitNode);
}

function selectDeleteIndividualButton(content, fieldDiv) {

	deselectFields();
	resetBackground(content, fieldDiv);

	// Create form for deleting an individual
	var node = document.createElement('form');
	node.id = 'delete-individual-form';

	// Create input fields for first and last name
	createField(node, 'First Name', 'First Name *');
	createField(node, 'Last Name', 'Last Name *');

	createRequirementsMessage(node);

	// Add the form to the center panel
	document.getElementById('api-form-container').appendChild(node);

	// Set up the submit button
	var submitNode = document.createElement('form');
	var submitButton = document.createElement('input');
	submitButton.type = 'button';
	submitButton.id = 'submit-button';
	submitButton.onclick = (function() {deleteIndividual($(this).text(), this)});
	submitButton.value = 'Submit';
	submitNode.appendChild(submitButton);
	document.getElementById('api-bottom-panel').appendChild(submitNode);
}

function selectAddGroupButton(content, fieldDiv) {

	deselectFields();
	resetBackground(content, fieldDiv);

	// Create form for adding new group
	var node = document.createElement('form');
	node.id = 'add-group-form';

	// Create input field for Group Name
	createField(node, 'Group Name', 'Group Name *');

	// Create input field for Priority. Create a drop down menu,
	// so the user can only pick numbers up to one higher than the
	// highest priority currently in use
	var priorityNode = document.createElement('div');
	var priorityInputTitle = document.createElement('div');
	priorityInputTitle.id = 'Priority';
	priorityInputTitle.className = 'input-title';
	priorityInputTitle.innerHTML = 'Priority *';
	var priorityInput = document.createElement('select');
	priorityInput.name = 'Priority';
	var maxPriority = getMaxGroupPriority();
	for (var i = 1; i <= maxPriority + 1; i++) {
		var priorityOption = document.createElement('option');
		priorityOption.value = i;
		priorityOption.innerHTML = i;
		priorityInput.appendChild(priorityOption);
	}
	priorityNode.appendChild(priorityInputTitle);
	priorityNode.appendChild(priorityInput);
	node.appendChild(priorityNode);

	// Indicate to the user that certain fields are required
	createRequirementsMessage(node);

	// Add the form to the center panel
	document.getElementById('api-form-container').appendChild(node);

	// Set up the submit button
	var submitNode = document.createElement('form');
	var submitButton = document.createElement('input');
	submitButton.type = 'button';
	submitButton.id = 'submit-button';
	submitButton.onclick = (function() {addGroup($(this).text(), this)});
	submitButton.value = 'Submit';
	submitNode.appendChild(submitButton);
	document.getElementById('api-bottom-panel').appendChild(submitNode);
}

function selectDeleteGroupButton(content, fieldDiv) {

	deselectFields();
	resetBackground(content, fieldDiv);

	// Create form for deleting a group
	var node = document.createElement('form');
	node.id = 'delete-group-form';

	// Create input field for Group (drop down)
	var groupNode = document.createElement('div');
	var groupInputTitle = document.createElement('div');
	groupInputTitle.id = 'Group';
	groupInputTitle.className = 'input-title';
	groupInputTitle.innerHTML = 'Group Name *';
	var groupInput = document.createElement('select');
	groupInput.name = 'Group Name';
	// populate group fields
	$.getJSON('http://localhost:3000/api/getGroups', function(data) {

		for (var i = 0; i < data.length; i++) {

			var groupOption = document.createElement('option');
			groupOption.value = data[i].groupName;
			groupOption.innerHTML = data[i].groupName;
			groupInput.appendChild(groupOption);
		}
	});
	groupNode.appendChild(groupInputTitle);
	groupNode.appendChild(groupInput);
	node.appendChild(groupNode);

	// Indicate to the user that certain fields are required
	createRequirementsMessage(node);

	// Add the form to the center panel
	document.getElementById('api-form-container').appendChild(node);

	// Set up the submit button
	var submitNode = document.createElement('form');
	var submitButton = document.createElement('input');
	submitButton.type = 'button';
	submitButton.id = 'submit-button';
	submitButton.onclick = (function() {deleteGroup($(this).text(), this)});
	submitButton.value = 'Submit';
	submitNode.appendChild(submitButton);
	document.getElementById('api-bottom-panel').appendChild(submitNode);
}

function selectEditGroupNameButton(content, fieldDiv) {

	deselectFields();
	resetBackground(content, fieldDiv);

	// Create form for editing a group's priority
	var node = document.createElement('form');
	node.id = 'edit-group-name-form';

	// Create input field for Group (drop down)
	var groupNode = document.createElement('div');
	var groupInputTitle = document.createElement('div');
	groupInputTitle.id = 'Group';
	groupInputTitle.className = 'input-title';
	groupInputTitle.innerHTML = 'Group Name *';
	var groupInput = document.createElement('select');
	groupInput.name = 'Group Name';
	// populate group fields
	$.getJSON('http://localhost:3000/api/getGroups', function(data) {

		for (var i = 0; i < data.length; i++) {

			var groupOption = document.createElement('option');
			groupOption.value = data[i].groupName;
			groupOption.innerHTML = data[i].groupName;
			groupInput.appendChild(groupOption);
		}
	});
	groupNode.appendChild(groupInputTitle);
	groupNode.appendChild(groupInput);
	node.appendChild(groupNode);

	// Create input field for the new group name
	// Create input field for Group Name
	createField(node, 'New Group Name', 'New Group Name *');

	// Indicate to the user that certain fields are required
	createRequirementsMessage(node);

	// Add the form to the center panel
	document.getElementById('api-form-container').appendChild(node);

	// Set up the submit button
	var submitNode = document.createElement('form');
	var submitButton = document.createElement('input');
	submitButton.type = 'button';
	submitButton.id = 'submit-button';
	submitButton.onclick = (function() {editGroupName($(this).text(), this)});
	submitButton.value = 'Submit';
	submitNode.appendChild(submitButton);
	document.getElementById('api-bottom-panel').appendChild(submitNode);
}

function selectEditGroupPriorityButton(content, fieldDiv) {

	deselectFields();
	resetBackground(content, fieldDiv);

	// Create form for editing a group's priority
	var node = document.createElement('form');
	node.id = 'edit-group-priority-form';

	// Create input field for Group (drop down)
	var groupNode = document.createElement('div');
	var groupInputTitle = document.createElement('div');
	groupInputTitle.id = 'Group';
	groupInputTitle.className = 'input-title';
	groupInputTitle.innerHTML = 'Group Name *';
	var groupInput = document.createElement('select');
	groupInput.name = 'Group Name';
	// populate group fields
	$.getJSON('http://localhost:3000/api/getGroups', function(data) {

		for (var i = 0; i < data.length; i++) {

			var groupOption = document.createElement('option');
			groupOption.value = data[i].groupName;
			groupOption.innerHTML = data[i].groupName;
			groupInput.appendChild(groupOption);
		}
	});
	groupNode.appendChild(groupInputTitle);
	groupNode.appendChild(groupInput);
	node.appendChild(groupNode);

	// Create input field for Priority. Create a drop down menu,
	// so the user can only pick numbers up to one higher than the
	// highest priority currently in use
	var priorityNode = document.createElement('div');
	var priorityInputTitle = document.createElement('div');
	priorityInputTitle.id = 'Priority';
	priorityInputTitle.className = 'input-title';
	priorityInputTitle.innerHTML = 'Priority *';
	var priorityInput = document.createElement('select');
	priorityInput.name = 'Priority';
	var maxPriority = getMaxGroupPriority();
	for (var i = 1; i <= maxPriority + 1; i++) {
		var priorityOption = document.createElement('option');
		priorityOption.value = i;
		priorityOption.innerHTML = i;
		priorityInput.appendChild(priorityOption);
	}
	priorityNode.appendChild(priorityInputTitle);
	priorityNode.appendChild(priorityInput);
	node.appendChild(priorityNode);

	// Indicate to the user that certain fields are required
	createRequirementsMessage(node);

	// Add the form to the center panel
	document.getElementById('api-form-container').appendChild(node);

	// Set up the submit button
	var submitNode = document.createElement('form');
	var submitButton = document.createElement('input');
	submitButton.type = 'button';
	submitButton.id = 'submit-button';
	submitButton.onclick = (function() {editGroupPriority($(this).text(), this)});
	submitButton.value = 'Submit';
	submitNode.appendChild(submitButton);
	document.getElementById('api-bottom-panel').appendChild(submitNode);
}

function selectEditBuildingButton(content, fieldDiv) {

	deselectFields();
	resetBackground(content, fieldDiv);

	// Create form for deleting an individual
	var node = document.createElement('form');
	node.id = 'edit-building-form';

	// Create input fields for first and last name
	createField(node, 'New Name', 'New Name');

	// Add the form to the center panel
	document.getElementById('api-form-container').appendChild(node);

	// Set up the submit button
	var submitNode = document.createElement('form');
	var submitButton = document.createElement('input');
	submitButton.type = 'button';
	submitButton.id = 'submit-button';
	submitButton.onclick = (function() {editBuilding($(this).text(), this)});
	submitButton.value = 'Submit';
	submitNode.appendChild(submitButton);
	document.getElementById('api-bottom-panel').appendChild(submitNode);
}

function awsListBuckets(content, fieldDiv) {
	deselectFields();
	resetBackground(content, fieldDiv);

	var resultsPanel = document.getElementById('api-right-result-panel');
	while (resultsPanel.firstChild){
		resultsPanel.removeChild(resultsPanel.firstChild);
	}

	var resultNode = document.createElement('div');
	resultNode.id = 'api-results';
	var text = '<br><br> S3 Buckets: <br>';

	//var AWS = require('aws-sdk');
	//var s3 = new AWS.S3();
	//s3.listBuckets(function(err, data) {
	//	for (var index in data.Buckets) {
	//		var bucket = data.Buckets[index];
	//		text += 'Bucket: ' + bucket.Name + '<br>';
	//	}
	//});

	resultNode.innerHTML = text;
	resultsPanel.appendChild(resultNode);
}

function addIndividual() {

	// Clear the results panel
	var resultsPanel = document.getElementById('api-right-result-panel');
	while (resultsPanel.firstChild){
		resultsPanel.removeChild(resultsPanel.firstChild);
	}

	// Set up the results panel to display the results of adding the individual
	var resultNode = document.createElement('div');
	resultNode.id = 'api-results';
	var form = document.getElementById('add-individual-form');
	var text = '<br><br> New Individual Created: <br>';

	var firstName = form.elements[0].value;
	var lastName = form.elements[1].value;

	// If the user has not entered both a first name and a last name, indicate
	// that these fields are required
	if (firstName == '' || lastName == '') {
		var errorMessage = '<br><br> Error: <br>';
		if (firstName == '') {
			errorMessage += 'You must enter a First Name. <br>'
		}
		if (lastName == '') {
			errorMessage += 'You must enter a Last Name. <br>'
		}
		resultNode.innerHTML = errorMessage;
		resultsPanel.appendChild(resultNode);
		return;
	}

	// If the individual already exists, cannot create an individual with the same name
	if (checkIndividual(firstName, lastName)) {
		var errorMessage = '<br><br> Error: <br> The individual ' + firstName + ' ' + lastName + 
		' already exists in the database.<br><br>' + 
		' You must add a middle initial or other unique feature to the name if there are two individuals with the same name.';
		resultNode.innerHTML = errorMessage;
		resultsPanel.appendChild(resultNode);
		return;
	}

	var group = form.elements[2].value;

	// Create individual with first name, last name, and group
	$.getJSON('http://localhost:3000/api/createIndividual/' + firstName + '/' + lastName + '/' + group, function(data) {
	});

	// Check if individual has media specified. If so, add media.
	//var mainMedia = form.elements[7].value;
	//var idleMedia = form.elements[8].value;
	//var waveMedia = form.elements[9].value;
	//var pointMedia = form.elements[10].value;
	//if (mainMedia != '') {
	//	$.getJSON('http://localhost:3000/api/changeMedia/' + firstName + '/' + lastName + '/mainPic/' + mainMedia, function(data) {
	//	});
	//}
	//if (idleMedia != '') {
	//	$.getJSON('http://localhost:3000/api/changeMedia/' + firstName + '/' + lastName + '/idlePic/' + idleMedia, function(data) {
	//	});
	//}
	//if (waveMedia != '') {
	//	$.getJSON('http://localhost:3000/api/changeMedia/' + firstName + '/' + lastName + '/wavePic/' + waveMedia, function(data) {
	//	});
	//}
	//if (pointMedia != '') {
	//	$.getJSON('http://localhost:3000/api/changeMedia/' + firstName + '/' + lastName + '/pointPic/' + pointMedia, function(data) {
	//	});
	//}

	// Go through the form with all the common field names, and add any specified to the new individual
	// Indicate to the user that each field has been added
	for (var i = 0; i < form.length; i++) {
		var formName = form.elements[i].name;
		var formValue = form.elements[i].value;
		if (formValue != '') {
			if (formName == 'Phone Number' || formName == 'Email' || formName == 'Office') {
				var newFieldDatabaseName = getDatabaseValue(formName);
				var indivFieldArrays = updateFieldArrays(firstName, lastName, newFieldDatabaseName, formValue);
				var newFieldNamesArray = indivFieldArrays.newFieldNames;
				var newFieldValuesArray = indivFieldArrays.newFieldValues;

				$.getJSON('http://localhost:3000/api/changeIndividualField/' + firstName + '/' + lastName + '/fieldNames/' + 
					JSON.stringify({"fields":newFieldNamesArray}), function(data) {
				});
				$.getJSON('http://localhost:3000/api/changeIndividualField/' + firstName + '/' + lastName + '/fieldValues/' + 
					JSON.stringify({"fields":newFieldValuesArray}), function(data) {
				});

			}
			text += formName + ': ' + formValue + '<br>';
		}
	}

	// Go through the added fields, and add them to the new individual
	// Indicate to the user that each field has been added
	var fieldNamesForm = document.getElementById('field-names-form');
	var fieldValuesForm = document.getElementById('field-values-form');
	for (var j = 0; j < fieldValuesForm.length; j++) {
		var fieldName = fieldNamesForm.elements[j+1].value;
		var fieldValue = fieldValuesForm.elements[j].value;
		if (fieldName != ''){
			if (fieldValue != '') {

				var indivFieldArrays = updateFieldArrays(firstName, lastName, fieldName, fieldValue);
				var newFieldNamesArray = indivFieldArrays.newFieldNames;
				var newFieldValuesArray = indivFieldArrays.newFieldValues;

				$.getJSON('http://localhost:3000/api/changeIndividualField/' + firstName + '/' + lastName + '/fieldNames/' + 
					JSON.stringify({"fields":newFieldNamesArray}), function(data) {
				});
				$.getJSON('http://localhost:3000/api/changeIndividualField/' + firstName + '/' + lastName + '/fieldValues/' + 
					JSON.stringify({"fields":newFieldValuesArray}), function(data) {
				});

				text += fieldName + ': ' + fieldValue + '<br>';	
			}
			
		}
	}

	// Display the results
	resultNode.innerHTML = text;
	resultsPanel.appendChild(resultNode);
}

function editIndividual() {

	// Clear the results panel
	var resultsPanel = document.getElementById('api-right-result-panel');
	while (resultsPanel.firstChild){
		resultsPanel.removeChild(resultsPanel.firstChild);
	}

	// Set up the results panel to display the results of adding the individual
	var resultNode = document.createElement('div');
	resultNode.id = 'api-results';
	var form = document.getElementById('edit-individual-form');
	var text = '<br><br> Individual Edited: <br>';

	var firstName = form.elements[0].value;
	var lastName = form.elements[1].value;

	// If the user has not entered both a first name and a last name, indicate
	// that these fields are required
	if (firstName == '' || lastName == '') {
		var errorMessage = '<br><br> Error: <br>';
		if (firstName == '') {
			errorMessage += 'You must enter a First Name. <br>'
		}
		if (lastName == '') {
			errorMessage += 'You must enter a Last Name. <br>'
		}
		resultNode.innerHTML = errorMessage;
		resultsPanel.appendChild(resultNode);
		return;
	}

	if (!checkIndividual(firstName, lastName)) {
		var errorMessage = '<br><br> Error: <br> The individual ' + firstName + ' ' + lastName + ' is not in the database.';
		resultNode.innerHTML = errorMessage;
		resultsPanel.appendChild(resultNode);
		return;
	}

	//$.getJSON('http://localhost:3000/api/deleteGroup/' + groupName, function(data) {
	//});
	
	text += form.elements[0].name + ': ' + firstName + '<br>';
	text += form.elements[1].name + ': ' + lastName + '<br><br>';

	// Go through the form with all the common field names, and add any specified to the new individual
	// Indicate to the user that each field has been added
	for (var i = 3; i < form.length - 1; i+=2) {
		var newFieldSelection = form.elements[i].value;
		var newFieldInput = form.elements[i+1].value;
		if (newFieldInput != '') {
			if (newFieldSelection == 'Phone Number' || newFieldSelection == 'Email' || newFieldSelection == 'Office') {
				var newFieldDatabaseName = getDatabaseValue(newFieldSelection);
				var indivFieldArrays = updateFieldArrays(firstName, lastName, newFieldDatabaseName, newFieldInput);
				var newFieldNamesArray = indivFieldArrays.newFieldNames;
				var newFieldValuesArray = indivFieldArrays.newFieldValues;

				$.getJSON('http://localhost:3000/api/changeIndividualField/' + firstName + '/' + lastName + '/fieldNames/' + 
					JSON.stringify({"fields":newFieldNamesArray}), function(data) {
				});
				$.getJSON('http://localhost:3000/api/changeIndividualField/' + firstName + '/' + lastName + '/fieldValues/' + 
					JSON.stringify({"fields":newFieldValuesArray}), function(data) {
				});

			} else if (newFieldSelection == 'First Name' || newFieldSelection == 'Last Name') {
							
				var newFieldDatabaseName = getDatabaseValue(newFieldSelection);

				$.getJSON('http://localhost:3000/api/changeIndividualField/' + firstName + '/' + lastName + 
					'/' + newFieldDatabaseName + '/' + JSON.stringify({"fields":newFieldInput}), function(data) {
				});

				if (newFieldSelection == 'First Name') {
					firstName = newFieldInput;
				} else {
					lastName = newFieldInput;
				}
			}
			text += 'New ' + newFieldSelection+ ': ' + newFieldInput + '<br>';
		}
	}

	// Go through the added fields, and add them to the new individual
	// Indicate to the user that each field has been added
	var fieldNamesForm = document.getElementById('field-names-form');
	var fieldValuesForm = document.getElementById('field-values-form');
	for (var j = 0; j < fieldValuesForm.length; j++) {
		var newFieldName = fieldNamesForm.elements[j+1].value;
		var newFieldValue = fieldValuesForm.elements[j].value;
		if (newFieldName != ''){
			if (newFieldValue != '') {
				var indivFieldArrays = updateFieldArrays(firstName, lastName, newFieldName, newFieldValue);
				var newFieldNamesArray = indivFieldArrays.newFieldNames;
				var newFieldValuesArray = indivFieldArrays.newFieldValues;

				text += newFieldNamesArray + '<br>' + newFieldValuesArray + '<br>';

				$.getJSON('http://localhost:3000/api/changeIndividualField/' + firstName + '/' + lastName + '/fieldNames/' + 
					JSON.stringify({"fields":newFieldNamesArray}), function(data) {
				});
				$.getJSON('http://localhost:3000/api/changeIndividualField/' + firstName + '/' + lastName + '/fieldValues/' + 
					JSON.stringify({"fields":newFieldValuesArray}), function(data) {
				});

				text += 'New ' + newFieldName+ ': ' + newFieldValue + '<br>';	
			}
			
		}
	}

	resultNode.innerHTML = text;
	resultsPanel.appendChild(resultNode);
}

function editIndividualGroup() {

	// Clear the results panel
	var resultsPanel = document.getElementById('api-right-result-panel');
	while (resultsPanel.firstChild){
		resultsPanel.removeChild(resultsPanel.firstChild);
	}

	// Set up the results panel to display the results of adding the individual
	var resultNode = document.createElement('div');
	resultNode.id = 'api-results';
	var form = document.getElementById('edit-individual-group-form');
	var text = '<br><br> Individual Edited: <br>';

	var firstName = form.elements[0].value;
	var lastName = form.elements[1].value;
	var group = form.elements[2].value;

	// If the user has not entered both a first name and a last name, indicate
	// that these fields are required
	if (firstName == '' || lastName == '') {
		var errorMessage = '<br><br> Error: <br>';
		if (firstName == '') {
			errorMessage += 'You must enter a First Name. <br>'
		}
		if (lastName == '') {
			errorMessage += 'You must enter a Last Name. <br>'
		}
		resultNode.innerHTML = errorMessage;
		resultsPanel.appendChild(resultNode);
		return;
	}

	if (!checkIndividual(firstName, lastName)) {
		var errorMessage = '<br><br> Error: <br> The individual ' + firstName + ' ' + lastName + ' is not in the database.';
		resultNode.innerHTML = errorMessage;
		resultsPanel.appendChild(resultNode);
		return;
	}

	// Edit the individual's group, and display the results to the user
	$.getJSON('http://localhost:3000/api/changeIndividualField/' + firstName + '/' + lastName + 
		'/group/' + JSON.stringify({"fields":group}), function(data) {
	});
	
	text += form.elements[0].name + ': ' + firstName + '<br>';
	text += form.elements[1].name + ': ' + lastName + '<br>';
	text += 'New Group: ' + group + '<br>';

	resultNode.innerHTML = text;
	resultsPanel.appendChild(resultNode);
}

function deleteIndividual() {

	// Clear the results panel
	var resultsPanel = document.getElementById('api-right-result-panel');
	while (resultsPanel.firstChild){
		resultsPanel.removeChild(resultsPanel.firstChild);
	}

	// Set up the results panel to display the results of adding the individual
	var resultNode = document.createElement('div');
	resultNode.id = 'api-results';
	var form = document.getElementById('delete-individual-form');
	var text = '<br><br> Individual Deleted: <br>';

	var firstName = form.elements[0].value;
	var lastName = form.elements[1].value;

	// If the user has not entered both a first name and a last name, indicate
	// that these fields are required
	if (firstName == '' || lastName == '') {
		var errorMessage = '<br><br> Error: <br>';
		if (firstName == '') {
			errorMessage += 'You must enter a First Name. <br>'
		}
		if (lastName == '') {
			errorMessage += 'You must enter a Last Name. <br>'
		}
		resultNode.innerHTML = errorMessage;
		resultsPanel.appendChild(resultNode);
		return;
	}

	if (!checkIndividual(firstName, lastName)) {
		var errorMessage = '<br><br> Error: <br> The individual ' + firstName + ' ' + lastName + ' is not in the database.';
		resultNode.innerHTML = errorMessage;
		resultsPanel.appendChild(resultNode);
		return;
	}

	// Delete the individual, and display the results to the user
	$.getJSON('http://localhost:3000/api/deleteIndividual/' + firstName + '/' + lastName, function(data) {
	});
	
	text += form.elements[0].name + ': ' + firstName + '<br>';
	text += form.elements[1].name + ': ' + lastName + '<br>';

	resultNode.innerHTML = text;
	resultsPanel.appendChild(resultNode);
}

function addGroup() {

	// Clear the results panel
	var resultsPanel = document.getElementById('api-right-result-panel');
	while (resultsPanel.firstChild){
		resultsPanel.removeChild(resultsPanel.firstChild);
	}

	// Set up the results panel to display the results of adding the individual
	var resultNode = document.createElement('div');
	resultNode.id = 'api-results';
	var form = document.getElementById('add-group-form');
	var text = '<br><br> New Group Created: <br>';

	var newGroupName = form.elements[0].value;
	var newPriority = form.elements[1].value;

	// If the user has not entered both a group name and a priority, indicate
	// that these fields are required
	if (newGroupName == '' || newPriority == '') {
		var errorMessage = '<br><br> Error: <br>';
		if (newGroupName == '') {
			errorMessage += 'You must enter a Group Name. <br>'
		}
		if (newPriority == '') {
			errorMessage += 'You must enter a Priority. <br>'
		}
		resultNode.innerHTML = errorMessage;
		resultsPanel.appendChild(resultNode);
		return;
	}

	if (checkGroup(newGroupName)) {
		var errorMessage = '<br><br> Error: <br> The group ' + newGroupName + ' already exists.';
		resultNode.innerHTML = errorMessage;
		resultsPanel.appendChild(resultNode);
		return;
	}

	var newPriorityInt = parseInt(newPriority);

	// Add the group, and display the results to the user
	$.getJSON('http://localhost:3000/api/createGroup/' + newGroupName + '/' + newPriorityInt, function(data) {
	});

	var i;
	for (i = 0; i < form.length; i++) {
		if (form.elements[i].value != '') {
			text += form.elements[i].name + ': ' + form.elements[i].value + '<br>';
		}
	}



	resultNode.innerHTML = text;
	resultsPanel.appendChild(resultNode);
}

function editGroupName() {

	// Clear the results panel
	var resultsPanel = document.getElementById('api-right-result-panel');
	while (resultsPanel.firstChild){
		resultsPanel.removeChild(resultsPanel.firstChild);
	}

	// Set up the results panel to display the results of adding the individual
	var resultNode = document.createElement('div');
	resultNode.id = 'api-results';
	var form = document.getElementById('edit-group-name-form');
	var text = '<br><br> Group Name Changed: <br>';

	var groupName = form.elements[0].value;
	var newGroupName = form.elements[1].value;

	// Edit the group name, and also change the group name for all individuals in the group
	$.getJSON('http://localhost:3000/api/changeGroupName/' + groupName + '/' + newGroupName, function(data) {
	});
	$.getJSON('http://localhost:3000/api/changeAllIndividualsGroup/' + groupName + '/' + newGroupName, function(data) {		
	});

	// Display the results to the user
	var i;
	for (i = 0; i < form.length; i++) {
		if (form.elements[i].value != '') {
			text += form.elements[i].name + ': ' + form.elements[i].value + '<br>';
		}
	}

	resultNode.innerHTML = text;
	resultsPanel.appendChild(resultNode);
}

function editGroupPriority() {

	// Clear the results panel
	var resultsPanel = document.getElementById('api-right-result-panel');
	while (resultsPanel.firstChild){
		resultsPanel.removeChild(resultsPanel.firstChild);
	}

	// Set up the results panel to display the results of adding the individual
	var resultNode = document.createElement('div');
	resultNode.id = 'api-results';
	var form = document.getElementById('edit-group-priority-form');
	var text = '<br><br> Group Priority Changed: <br>';

	var newGroupName = form.elements[0].value;
	var newPriority = form.elements[1].value;

	var newPriorityInt = parseInt(newPriority);

	// Edit the group priority, and display the results to the user
	$.getJSON('http://localhost:3000/api/changeGroupPriority/' + newGroupName + '/' + newPriorityInt, function(data) {
	});

	var i;
	for (i = 0; i < form.length; i++) {
		if (form.elements[i].value != '') {
			text += form.elements[i].name + ': ' + form.elements[i].value + '<br>';
		}
	}

	resultNode.innerHTML = text;
	resultsPanel.appendChild(resultNode);
}

function deleteGroup() {

	// Clear the results panel
	var resultsPanel = document.getElementById('api-right-result-panel');
	while (resultsPanel.firstChild){
		resultsPanel.removeChild(resultsPanel.firstChild);
	}

	// Set up the results panel to display the results of adding the individual
	var resultNode = document.createElement('div');
	resultNode.id = 'api-results';
	var form = document.getElementById('delete-group-form');

	if (confirm("Deleting a group will delete all the individuals in that group.\nAre you sure you want to delete this group?")) {
		var text = '<br><br> Group Deleted: <br>';

		var groupName = form.elements[0].value;

		// Delete the group, and all individuals in the group, and display the results to the user
		$.getJSON('http://localhost:3000/api/deleteIndividuals/' + groupName, function(data) {		
		});
		$.getJSON('http://localhost:3000/api/deleteGroup/' + groupName, function(data) {
		});
	
		text += form.elements[0].name + ': ' + groupName;	
	} else {
		var text = '<br><br> You chose not to delete the group.';
	}
	resultNode.innerHTML = text;
	resultsPanel.appendChild(resultNode);
}

function editBuilding() {

	// Clear the results panel
	var resultsPanel = document.getElementById('api-right-result-panel');
	while (resultsPanel.firstChild){
		resultsPanel.removeChild(resultsPanel.firstChild);
	}

	// Set up the results panel to display the results of adding the individual
	var resultNode = document.createElement('div');
	resultNode.id = 'api-results';
	var form = document.getElementById('edit-building-form');
	var text = '<br><br> Building Edited: <br>';

	var name = form.elements[0].value;

	// If the user has not entered both a first name and a last name, indicate
	// that these fields are required
	if (name != '') {
		$.getJSON('http://localhost:3000/api/changeBuildingName/' + name, function(data) {
		});
		text += form.elements[0].name + ': ' + name + '<br>';
	}

	resultNode.innerHTML = text;
	resultsPanel.appendChild(resultNode);
}