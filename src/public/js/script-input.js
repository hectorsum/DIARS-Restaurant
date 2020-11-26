
function CustomValidation(input) {
	this.invalidities = [];
	this.validityChecks = [];
	//add reference to the input node
	this.inputNode = input;
	//trigger method to attach the listener
	this.registerListener();
}

CustomValidation.prototype = {
	addInvalidity: function(message) {
		this.invalidities.push(message);
	},
	getInvalidities: function() {
		return this.invalidities.join('. \n');
	},
	checkValidity: function(input) {
		for ( var i = 0; i < this.validityChecks.length; i++ ) {
      console.log(this.validityChecks[i])
			var isInvalid = this.validityChecks[i].isInvalid(input);
			if (isInvalid) {
				this.addInvalidity(this.validityChecks[i].invalidityMessage);
			}

			var requirementElement = this.validityChecks[i].element;

			if (requirementElement) {
				if (isInvalid) {
					requirementElement.classList.add('invalid');
					requirementElement.classList.remove('valid');
				} else {
					requirementElement.classList.remove('invalid');
					requirementElement.classList.add('valid');
				}

			} // end if requirementElement
		} // end for
	},
	checkInput: function() { // checkInput now encapsulated

		this.inputNode.CustomValidation.invalidities = [];
		this.checkValidity(this.inputNode);

		if ( this.inputNode.CustomValidation.invalidities.length === 0 && this.inputNode.value !== '' ) {
			this.inputNode.setCustomValidity('');
		} else {
			var message = this.inputNode.CustomValidation.getInvalidities();
			this.inputNode.setCustomValidity(message);
		}
	},
	registerListener: function() { //register the listener here
		var CustomValidation = this;
		this.inputNode.addEventListener('keyup', function() {
			CustomValidation.checkInput();
		});
	}

};



/* ----------------------------
	Validity Checks
	The arrays of validity checks for each input
	Comprised of three things
		1. isInvalid() - the function to determine if the input fulfills a particular requirement
		2. invalidityMessage - the error message to display if the field is invalid
		3. element - The element that states the requirement
---------------------------- */

var dniValidation = [
	{
		isInvalid: function(input) {
			return input.value.length < 8;
		},
		invalidityMessage: 'Necesita al menos 8 digitos',
		element: document.querySelector('label[for="dni"] .input-requirements li:nth-child(1)')
	},
	{
		isInvalid: function(input) {
			var illegalCharacters = input.value.match(/[^a-zA-Z0-9]/g);
			return illegalCharacters ? true : false;
		},
		invalidityMessage: 'Only letters and numbers are allowed',
		element: document.querySelector('label[for="dni"] .input-requirements li:nth-child(2)')
	}
];

var telfValidation = [
	{
		isInvalid: function(input) {
			return input.value.length < 9;
		},
		invalidityMessage: 'Necesita al menos 9 digitos',
		element: document.querySelector('label[for="telf"] .input-requirements li:nth-child(1)')
  },
  {
		isInvalid: function(input) {
			var illegalCharacters = !input.value.match(/^9/g);
			return illegalCharacters ? true : false;
		},
		invalidityMessage: 'Numero celular debe empezar con 9',
		element: document.querySelector('label[for="telf"] .input-requirements li:nth-child(2)')
	}
];

var emailValidation = [
	{
		isInvalid: function(input) {
      //https://regexr.com/3e48o
      var illegalCharacters = !input.value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g);
      return illegalCharacters ? true : false;
		},
		invalidityMessage: 'Email no valido',
		element: document.querySelector('label[for="email"] .input-requirements li:nth-child(1)')
  }
];


var passwordRepeatValidityChecks = [
	{
		isInvalid: function() {
			return passwordRepeatInput.value != passwordInput.value;
		},
		invalidityMessage: 'This password needs to match the first one'
	}
];


/* ----------------------------
	Setup CustomValidation
	Setup the CustomValidation prototype for each input
	Also sets which array of validity checks to use for that input
---------------------------- */

var dniInput = document.getElementsByName('dni')[0];
var telfInput = document.getElementsByName('telf')[0];
var emailInput = document.getElementsByName('email')[0];

var passwordRepeatInput = document.getElementById('password_repeat');

dniInput.CustomValidation = new CustomValidation(dniInput);
dniInput.CustomValidation.validityChecks = dniValidation;

telfInput.CustomValidation = new CustomValidation(telfInput);
telfInput.CustomValidation.validityChecks = telfValidation;

emailInput.CustomValidation = new CustomValidation(emailInput);
emailInput.CustomValidation.validityChecks = emailValidation;


passwordRepeatInput.CustomValidation = new CustomValidation(passwordRepeatInput);
passwordRepeatInput.CustomValidation.validityChecks = passwordRepeatValidityChecks;




/* ----------------------------
	Event Listeners
---------------------------- */

var inputs = document.querySelectorAll('input:not([type="submit"])');


var submit = document.querySelector('input[type="submit"');
var form = document.getElementById('registration');

function validate() {
	for (var i = 0; i < inputs.length; i++) {
		inputs[i].CustomValidation.checkInput();
	}
}

submit.addEventListener('click', validate);
form.addEventListener('submit', validate);
