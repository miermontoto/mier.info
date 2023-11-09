// import md5 function from library blueimp-md5
require('md5.min.js');

window.addEventListener("load", function(event) {
	const input = document.querySelector('#md5-input');
	const output = document.querySelector('#md5-output');

	input.value = '';
	output.innerHTML = '';

	const update = () => {
		output.innerHTML = md5(input.value);
	}

	input.addEventListener('input', update);
});
