window.addEventListener("load", function(event) {
	const input = document.getElementById('md5-input');
	const output = document.getElementById('md5-output');
	const copy = document.getElementById('md5-copy');

	input.value = '';
	output.innerHTML = '';
	copy.classList.add('disabled');

	const update = () => {
		if (input.value.length === 0) {
			copy.classList.add('disabled');
			output.innerHTML = '';
			return;
		}

		copy.classList.remove('disabled');
		output.innerHTML = md5(input.value);
	}

	const copyToClipboard = () => {
		this.navigator.clipboard.writeText(output.inner);
	}

	input.addEventListener('input', update);
	copy.addEventListener('click', copyToClipboard);
});
